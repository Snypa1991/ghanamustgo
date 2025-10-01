"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

// Define the shape of the context data
interface AuthContextType {
  user: User | null;
  login: (userData: any) => void; // This will be a placeholder
  logout: () => void;
}

// Create the context
const AppContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Login function (placeholder, actual login logic will be on the login page)
  const login = (userData: any) => {
    // This function is now a placeholder.
    // The onAuthStateChanged listener will automatically update the user state.
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      // The onAuthStateChanged listener will automatically set the user to null.
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const value = { user, login, logout };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Create the custom hook to use the auth context
export function useAuth() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AppProvider');
  }
  return context;
}
