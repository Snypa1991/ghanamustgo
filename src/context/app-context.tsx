
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/lib/dummy-data';

interface AppContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('ghana-must-go-user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem('ghana-must-go-user');
      }
    }
  }, []);

  const login = (userData: User) => {
    localStorage.setItem('ghana-must-go-user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('ghana-must-go-user');
    setUser(null);
  };

  const updateUser = (userData: User) => {
    // This function updates the user in the context and localStorage.
    // In a real app, this would likely be part of a more complex state management
    // logic that also pushes updates to a backend.
    localStorage.setItem('ghana-must-go-user', JSON.stringify(userData));
    setUser(userData);
  };


  return (
    <AppContext.Provider value={{ user, login, logout, updateUser }}>
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
