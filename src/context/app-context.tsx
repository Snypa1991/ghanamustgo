
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { DUMMY_USERS, User } from '@/lib/dummy-data';

interface AppContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User | null }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchUserForTesting: (role: User['role']) => Promise<{ success: boolean; error?: string }>;
  redirectToDashboard: (user: User) => void;
  updateUser: (user: User) => void;
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
    let isInitialCheck = true;
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const existingUser = DUMMY_USERS.find(u => u.email === firebaseUser.email);
        if (existingUser) {
            setUser(existingUser);
        } else {
             const newUser: User = {
                id: firebaseUser.uid,
                email: firebaseUser.email!,
                name: firebaseUser.displayName || 'New User',
                role: 'unassigned',
            };
            DUMMY_USERS.push(newUser);
            setUser(newUser);
        }
      } else {
        // If it's not the initial check and there's a user set (i.e. a test user),
        // but no firebaseUser, it means a real user signed out.
        // We should not log out a test user.
        if (!isInitialCheck && user && DUMMY_USERS.some(u => u.id === user.id && u.password)) {
             // This was a real user, now they are logged out.
             setUser(null);
        }
      }
      setLoading(false);
      isInitialCheck = false;
    });

    return () => unsubscribe();
  }, [user]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string; user?: User | null }> => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const appUser = DUMMY_USERS.find(u => u.email === firebaseUser.email);
      if (appUser) {
        setUser(appUser);
        setLoading(false);
        return { success: true, user: appUser };
      }
      setLoading(false);
      return { success: false, error: 'User not found in application data.' };
    } catch (error: any) {
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const signup = async (name: string, email: string, password: string) => {
      setLoading(true);
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        // The onAuthStateChanged listener will handle setting the user
        return { success: true };
      } catch (error: any) {
        setLoading(false);
        return { success: false, error: error.message };
      }
  };

  const logout = async () => {
    setLoading(true);
    if (auth.currentUser) {
        await firebaseSignOut(auth);
    }
    setUser(null);
    setLoading(false);
    router.push('/login');
  };

  const switchUserForTesting = async (role: User['role']) => {
    setLoading(true);
    if (auth.currentUser) {
        await firebaseSignOut(auth);
    }
    
    const testUser = DUMMY_USERS.find(u => u.role === role);
    if (testUser) {
      setUser(testUser);
      // We don't need to call redirectToDashboard here because the useEffect on the test login page will handle it.
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
