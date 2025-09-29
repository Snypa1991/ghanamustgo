
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { DUMMY_USERS, User } from '@/lib/dummy-data';
import { usePathname, useRouter } from 'next/navigation';

interface AppContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (user: User) => void; // This might be deprecated soon
  logout: () => void;
  updateUser: (user: User) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        // User is signed in via Firebase.
        // Now, let's find their corresponding app profile data.
        // In a real app, this would be a fetch from Firestore.
        let appUser = DUMMY_USERS.find(u => u.email === fbUser.email);
        
        const storedUser = localStorage.getItem(`ghana-must-go-user-${fbUser.uid}`);
        
        if (storedUser) {
            appUser = JSON.parse(storedUser);
        } else if (!appUser) {
          // If user signs up, they won't be in DUMMY_USERS.
          // Create a temporary profile for them.
          appUser = {
            id: fbUser.uid,
            name: fbUser.displayName || 'New User',
            email: fbUser.email!,
            role: 'unassigned',
          };
        }
        setUser(appUser);
        localStorage.setItem(`ghana-must-go-user-${fbUser.uid}`, JSON.stringify(appUser));
        
      } else {
        // User is signed out.
        if(user){
            localStorage.removeItem(`ghana-must-go-user-${user.id}`);
        }
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (userData: User) => {
    // This is now primarily handled by Firebase onAuthStateChanged.
    // We might keep this for legacy reasons or remove it.
    // For now, it helps link dummy data.
    const fbUser = auth.currentUser;
    if (fbUser) {
        localStorage.setItem(`ghana-must-go-user-${fbUser.uid}`, JSON.stringify(userData));
        setUser(userData);
    }
  };

  const logout = async () => {
    await auth.signOut();
    // The onAuthStateChanged listener will handle setting user to null.
    // Redirect to home to prevent being stuck on protected pages.
    router.push('/');
  };

  const updateUser = (userData: User) => {
    const fbUser = auth.currentUser;
    if (fbUser) {
        localStorage.setItem(`ghana-must-go-user-${fbUser.uid}`, JSON.stringify(userData));
        setUser(userData);
    }
  };

  return (
    <AppContext.Provider value={{ user, firebaseUser, loading, login, logout, updateUser }}>
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
