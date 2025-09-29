
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, DUMMY_USERS } from '@/lib/dummy-data';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut as firebaseSignOut, User as FirebaseUser } from 'firebase/auth';
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
      if (firebaseUser) {
        // If there's an active Firebase user, find their corresponding app user data
        const appUser = DUMMY_USERS.find(u => u.email === firebaseUser.email) || {
             id: firebaseUser.uid,
             name: firebaseUser.displayName || 'New User',
             email: firebaseUser.email!,
             role: 'unassigned'
        };
        setUser(appUser);
      } else {
        // If no Firebase user, clear the app user state
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    setLoading(true);
    await firebaseSignOut(auth);
    // onAuthStateChanged will handle setting user to null
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
      // Sign out any previous user to ensure a clean state
      if (auth.currentUser) {
        await firebaseSignOut(auth);
      }
      
      const appUser = DUMMY_USERS.find(u => u.email === newUser.email);

      if (appUser && appUser.password) {
          const userCredential = await signInWithEmailAndPassword(auth, appUser.email, appUser.password);
          if (userCredential.user) {
              // The onAuthStateChanged listener will fire and set the user state.
              // We can then redirect.
              redirectToDashboard(appUser);
          }
      } else {
        throw new Error("Dummy user not found or password not set.");
      }
    } catch (e) {
      console.error("Test user sign-in failed", e);
      setLoading(false); // Stop loading on error
    }
    // setLoading(false) will be handled by the onAuthStateChanged listener
  };
  
  const updateUser = (updatedUser: User) => {
    // This is for client-side role updates for newly signed up users
    // In a real app, this might trigger a backend update.
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
