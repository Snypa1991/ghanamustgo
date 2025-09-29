
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, DUMMY_USERS } from '@/lib/dummy-data';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';

interface AppContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Find the user from our dummy data
        const appUser = DUMMY_USERS.find(u => u.email === firebaseUser.email);
        setUser(appUser || null);
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
      await signInWithEmailAndPassword(auth, email, password);
      // Auth state change will handle setting the user
    } catch (error) {
      console.error("Firebase login error:", error);
      // The component calling login should handle showing an error toast
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Firebase logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider value={{ user, login, logout, loading }}>
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
