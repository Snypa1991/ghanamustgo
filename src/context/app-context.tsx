
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, DUMMY_USERS } from '@/lib/dummy-data';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut as firebaseSignOut, User as FirebaseUser } from 'firebase/auth';
import { useRouter } from 'next/navigation';


interface AppContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const redirectToDashboard = (targetUser: User) => {
    if (targetUser.role === 'unassigned') {
      router.push('/role-selection');
    } else if (targetUser.role === 'admin') {
      router.push('/admin/dashboard');
    } else if (targetUser.role === 'biker' || targetUser.role === 'driver') {
      router.push('/dashboard');
    } else if (targetUser.role === 'vendor') {
      router.push('/vendor/dashboard');
    } else {
      router.push('/book');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        // Find the full user profile from our dummy data
        const appUser = DUMMY_USERS.find(u => u.email === firebaseUser.email) || {
             id: firebaseUser.uid,
             name: firebaseUser.displayName || 'New User',
             email: firebaseUser.email!,
             role: 'unassigned'
        };
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
       const appUser = DUMMY_USERS.find(u => u.email === firebaseUser.email) || {
             id: firebaseUser.uid,
             name: firebaseUser.displayName || 'New User',
             email: firebaseUser.email!,
             role: 'unassigned'
        };
      setUser(appUser);
      redirectToDashboard(appUser);
      return { success: true };
    } catch (error: any) {
      console.error("Login failed:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    router.push('/login');
  };
  
  const updateUser = (updatedUser: User) => {
    // This is for client-side role updates for newly signed-up users
    setUser(updatedUser);
  };

  return (
    <AppContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AppProvider');
  }
  return context;
}
