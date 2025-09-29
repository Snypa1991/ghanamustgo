
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/lib/dummy-data';

interface AppContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  favorites: string[];
  toggleFavorite: (restaurantId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

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
    
    const storedFavorites = localStorage.getItem('ghana-must-go-favorites');
    if(storedFavorites) {
        try {
            setFavorites(JSON.parse(storedFavorites));
        } catch (error) {
            console.error("Failed to parse favorites from localStorage", error);
            localStorage.removeItem('ghana-must-go-favorites');
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
    localStorage.setItem('ghana-must-go-user', JSON.stringify(userData));
    setUser(userData);
  };
  
  const toggleFavorite = (restaurantId: string) => {
    setFavorites(prevFavorites => {
      const newFavorites = prevFavorites.includes(restaurantId)
        ? prevFavorites.filter(id => id !== restaurantId)
        : [...prevFavorites, restaurantId];
        
      localStorage.setItem('ghana-must-go-favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };


  return (
    <AppContext.Provider value={{ user, login, logout, updateUser, favorites, toggleFavorite }}>
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
