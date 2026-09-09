'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface AdminContextType {
  isAdmin: boolean;
  isLocked: boolean;
  login: (enteredPin: string) => boolean;
  logout: () => void;
  pin: string;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [pin, setPin] = useState('');

  // Automatically grant admin access if logged in via Google with your email
  useEffect(() => {
    if (session?.user?.email === 'punithcoding01@gmail.com') {
      setIsAdmin(true);
    }
  }, [session]);

  useEffect(() => {
    const locked = localStorage.getItem('admin_locked');
    if (locked === 'true') {
      setIsLocked(true);
    }
  }, []);

  const login = (enteredPin: string) => {
    if (isLocked) return false;

    if (enteredPin === '1234') {
      setIsAdmin(true);
      localStorage.removeItem('admin_failed_attempts');
      return true;
    } else {
      const attempts = parseInt(localStorage.getItem('admin_failed_attempts') || '0', 10) + 1;
      localStorage.setItem('admin_failed_attempts', attempts.toString());

      if (attempts >= 2) {
        setIsLocked(true);
        localStorage.setItem('admin_locked', 'true');
      }
      return false;
    }
  };

  const logout = () => {
    setIsAdmin(false);
  };

  return (
    <AdminContext.Provider value={{ isAdmin, isLocked, pin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within an AdminProvider');
  return context;
}