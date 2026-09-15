'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  UserProfile,
  LoginDto,
  RegisterDto,
  login as apiLogin,
  register as apiRegister,
  getProfile as apiGetProfile,
} from '@/lib/api';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const savedToken = localStorage.getItem('nest_articles_token');
        if (savedToken) {
          setToken(savedToken);
          const profile = await apiGetProfile(savedToken);
          setUser(profile);
        }
      } catch (err) {
        console.error('Failed to restore session:', err);
        localStorage.removeItem('nest_articles_token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (credentials: LoginDto) => {
    const { access_token } = await apiLogin(credentials);
    localStorage.setItem('nest_articles_token', access_token);
    setToken(access_token);
    const profile = await apiGetProfile(access_token);
    setUser(profile);
  };

  const register = async (data: RegisterDto) => {
    await apiRegister(data);
    // Automatically log in after registration
    await login({ email: data.email, password: data.password });
  };

  const logout = () => {
    localStorage.removeItem('nest_articles_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
