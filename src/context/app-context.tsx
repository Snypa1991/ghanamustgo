
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, DUMMY_USERS } from '@/lib/dummy-data';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';

interface AppContextType {
  user: User | null;
  updateUser: (user: User) => void;
  logout: () => void;
  loading: boolean;
  switchUserForTesting: (user: User) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Find the user from our dummy data based on email
        // If display name is available on firebase user, we can use that too
        const appUser = DUMMY_USERS.find(u => u.email === firebaseUser.email) || {
             id: firebaseUser.uid,
             name: firebaseUser.displayName || 'New User',
             email: firebaseUser.email!,
             role: 'unassigned' // Default role for new signups
        };
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setUser(null);
       // Navigate to login page after logout
      window.location.href = '/login';
    } catch (error) { 
      console.error("Firebase logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  const switchUserForTesting = (newUser: User) => {
    setLoading(true);
    // Sign out current user silently
    firebaseSignOut(auth).finally(() => {
        const appUser = DUMMY_USERS.find(u => u.email === newUser.email);
        if (appUser && appUser.password) {
            signInWithEmailAndPassword(auth, appUser.email, appUser.password)
                .catch(e => {
                    console.error("Test user sign-in failed", e);
                    setLoading(false);
                });
        } else {
            // If user has no password (e.g. new signup), just set them locally
            setUser(appUser || null);
            setLoading(false);
        }
    });
  };
  
  const updateUser = (updatedUser: User) => {
    // This function is used to update user details locally, e.g., after role selection.
    // In a real app, this would also write to a Firestore 'users' collection.
    setUser(updatedUser);
  }


  return (
    <AppContext.Provider value={{ user, logout, loading, switchUserForTesting, updateUser }}>
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
