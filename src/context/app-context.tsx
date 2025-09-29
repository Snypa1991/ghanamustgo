
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
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
  redirectToDashboard: (targetUser: User) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const redirectToDashboard = useCallback((targetUser: User) => {
    if (!targetUser) return;
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
  }, [router]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        // Find the full user profile from our dummy data
        const appUser = DUMMY_USERS.find(u => u.email === firebaseUser.email);
        if (appUser) {
            setUser(appUser);
        } else {
            // This handles newly created users who are not in the dummy list
            const newUser: User = {
                id: firebaseUser.uid,
                name: firebaseUser.displayName || 'New User',
                email: firebaseUser.email!,
                role: 'unassigned' // Default role for new signups
            };
            // Add to dummy users for this session to ensure consistency
            if (!DUMMY_USERS.some(u => u.id === newUser.id)) {
                DUMMY_USERS.push(newUser); 
            }
            setUser(newUser);
        }
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
       // onAuthStateChanged will handle setting the user and redirecting
      const appUser = DUMMY_USERS.find(u => u.email === userCredential.user.email);
      if (appUser) {
        redirectToDashboard(appUser);
      }
      return { success: true };
    } catch (error: any) {
      console.error("Login failed:", error);
      let errorMessage = "An unknown error occurred.";
      if (error.code) {
        switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
                errorMessage = 'Invalid email or password. Please try again.';
                break;
            default:
                errorMessage = error.message;
        }
      } else if (error.message) {
          errorMessage = error.message;
      }
       setLoading(false);
      return { success: false, error: errorMessage };
    } 
    // No finally block needed as success path is handled by onAuthStateChanged
  };

  const logout = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    router.push('/login');
  };
  
  const updateUser = (updatedUser: User) => {
    // This is for client-side role updates for newly signed-up users
    setUser(updatedUser);
    const userIndex = DUMMY_USERS.findIndex(u => u.id === updatedUser.id);
    if (userIndex !== -1) {
      DUMMY_USERS[userIndex] = updatedUser;
    }
  };

  return (
    <AppContext.Provider value={{ user, loading, login, logout, updateUser, redirectToDashboard }}>
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
