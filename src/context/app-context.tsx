
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
  switchUserForTesting: (user: User) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Add a flag to local storage to bypass login for development
const SKIP_LOGIN_KEY = 'skip-login-for-dev';

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const skipLogin = localStorage.getItem(SKIP_LOGIN_KEY) === 'true';

    if (skipLogin && process.env.NODE_ENV === 'development') {
      // Log in with the first dummy user and skip Firebase auth
      setUser(DUMMY_USERS[0]);
      setLoading(false);
      return;
    }

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
      // Remove the skip login flag on logout
      localStorage.removeItem(SKIP_LOGIN_KEY);
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) { 
      console.error("Firebase logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  // This function can be called from a developer menu or console
  const enableSkipLogin = () => {
    localStorage.setItem(SKIP_LOGIN_KEY, 'true');
    console.log("Login skip enabled. Refresh the page.");
  };

  // Expose the function to the window object for easy access in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      (window as any).enableSkipLogin = enableSkipLogin;
      console.log("To skip login on next refresh, call enableSkipLogin() in the console.");
    }
  }, []);

  const switchUserForTesting = (newUser: User) => {
    // When switching users, we should not use the skip login feature
    localStorage.removeItem(SKIP_LOGIN_KEY);
    firebaseSignOut(auth).then(() => {
        setUser(null);
        // A real sign-in is needed to get a Firebase user, 
        // but for this dummy setup, we can just set the user directly
        // after a delay to simulate a real auth flow.
        setTimeout(() => {
          // In a real app, you would sign in with the new user's credentials.
          // For this dummy app, we just set the user directly.
          const appUser = DUMMY_USERS.find(u => u.email === newUser.email);
           if (appUser && appUser.password) {
             signInWithEmailAndPassword(auth, appUser.email, appUser.password).catch(e => console.error("Test user sign-in failed", e));
           } else {
             setUser(appUser || null);
           }
        }, 500);
    }).catch(error => console.error("Error signing out during user switch:", error));
  };


  return (
    <AppContext.Provider value={{ user, login, logout, loading, switchUserForTesting }}>
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
