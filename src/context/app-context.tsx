
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, DUMMY_USERS } from '@/lib/dummy-data';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';


interface AppContextType {
  user: User | null;
  updateUser: (user: User) => void;
  logout: () => void;
  loading: boolean;
  switchUserForTesting: (user: User) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        const appUser = DUMMY_USERS.find(u => u.email === firebaseUser.email) || {
             id: firebaseUser.uid,
             name: firebaseUser.displayName || 'New User',
             email: firebaseUser.email!,
             role: 'unassigned'
        };
        setUser(appUser);
        redirectToDashboard(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const logout = async () => {
    setLoading(true);
    await firebaseSignOut(auth);
    setUser(null);
    router.push('/login');
    setLoading(false);
  };
  
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

  const switchUserForTesting = async (newUser: User) => {
    setLoading(true);
    try {
      if (auth.currentUser?.email !== newUser.email) {
          await firebaseSignOut(auth);
          if (newUser.password) {
            // onAuthStateChanged will handle setting the user and redirecting.
            await signInWithEmailAndPassword(auth, newUser.email, newUser.password);
          } else {
             throw new Error("Dummy user password not set.");
          }
      } else {
        // If already logged in as this user, just ensure redirection happens.
        const finalUser = DUMMY_USERS.find(u => u.email === newUser.email)!;
        setUser(finalUser);
        redirectToDashboard(finalUser);
        setLoading(false);
      }
      
    } catch (e) {
      console.error("Test user sign-in failed", e);
      await firebaseSignOut(auth);
      setUser(null);
      router.push('/login');
      setLoading(false);
    }
  };
  
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  }

  return (
    <AppContext.Provider value={{ user, logout, loading, switchUserForTesting, updateUser }}>
      {children}
    </AppContext.Provider>
  );
}


export function AppProvider({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}

export function useAuth() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AppProvider');
  }
  return context;
}
