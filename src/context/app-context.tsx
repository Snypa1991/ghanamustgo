"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { DUMMY_USERS, User } from '@/lib/dummy-data';

interface AppContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchUserForTesting: (role: User['role']) => Promise<{ success: boolean; error?: string }>;
  redirectToDashboard: (user: User) => void;
  updateUser: (user: User) => void; // Add this
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const redirectToDashboard = useCallback((userToRedirect: User) => {
    switch (userToRedirect.role) {
      case 'admin':
        router.push('/admin/dashboard');
        break;
      case 'biker':
      case 'driver':
        router.push('/dashboard');
        break;
      case 'vendor':
        router.push('/vendor/dashboard');
        break;
      case 'unassigned':
        router.push('/role-selection');
        break;
      default:
        router.push('/book');
        break;
    }
  }, [router]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // This is a real user. We can create a "local" user object from it.
        // In a real app, you'd fetch profile data from Firestore.
        // For now, we'll check if they match a dummy user or create a new one.
        const existingUser = DUMMY_USERS.find(u => u.email === firebaseUser.email);
        if (existingUser) {
            setUser(existingUser);
        } else {
             const newUser: User = {
                id: firebaseUser.uid,
                email: firebaseUser.email!,
                name: firebaseUser.displayName || 'New User',
                role: 'unassigned', // Default role for new signups
            };
            DUMMY_USERS.push(newUser);
            setUser(newUser);
        }
      } else {
        // No Firebase user. We might still have a test user.
        // We let logout() handle setting user to null.
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle setting the user
      return { success: true };
    } catch (error: any) {
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const signup = async (name: string, email: string, password: string) => {
      setLoading(true);
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        // onAuthStateChanged will handle the new user
        return { success: true };
      } catch (error: any) {
        setLoading(false);
        return { success: false, error: error.message };
      }
  };

  const logout = async () => {
    setLoading(true);
    // Sign out from firebase if the user is a real one
    if (auth.currentUser) {
        await firebaseSignOut(auth);
    }
    // Clear local user state for both real and test users
    setUser(null);
    setLoading(false);
    router.push('/login');
  };

  const switchUserForTesting = async (role: User['role']) => {
    setLoading(true);
     // If there's a real user signed in, sign them out first.
    if (auth.currentUser) {
        await firebaseSignOut(auth);
    }
    
    const testUser = DUMMY_USERS.find(u => u.role === role);
    if (testUser) {
      setUser(testUser);
      redirectToDashboard(testUser);
      setLoading(false);
      return { success: true };
    } else {
      setLoading(false);
      return { success: false, error: `No test user found with role: ${role}` };
    }
  };
  
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    const userIndex = DUMMY_USERS.findIndex(u => u.id === updatedUser.id);
    if (userIndex > -1) {
        DUMMY_USERS[userIndex] = updatedUser;
    }
  }


  const value = { user, loading, login, signup, logout, switchUserForTesting, redirectToDashboard, updateUser };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAuth() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AppProvider');
  }
  return context;
}
