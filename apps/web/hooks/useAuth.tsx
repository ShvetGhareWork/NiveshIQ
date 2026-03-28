'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phoneNumber: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('oracle_user');
    const savedToken = localStorage.getItem('oracle_token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      localStorage.setItem('oracle_token', data.token);
      localStorage.setItem('oracle_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, phoneNumber: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phoneNumber, password }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      localStorage.setItem('oracle_token', data.token);
      localStorage.setItem('oracle_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('oracle_token');
    localStorage.removeItem('oracle_user');
    setToken(null);
    setUser(null);
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
