'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import { useDispatch } from 'react-redux';
import { setUser, removeUser } from '@/store/slices/authSlice';
import { User } from '@prisma/client';

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const { mutate: login } = trpc.auth.login.useMutation();
  const { mutate: register } = trpc.auth.register.useMutation();
  const { mutate: logout } = trpc.auth.logout.useMutation();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserState(JSON.parse(storedUser));
      dispatch(setUser(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  const handleLogin = async (email: string, password: string) => {
    try {
      const user = await login({ email, password });
      setUserState(user);
      dispatch(setUser(user));
      localStorage.setItem('user', JSON.stringify(user));
      router.push('/tasks');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleRegister = async (email: string, password: string) => {
    try {
      const user = await register({ email, password });
      setUserState(user);
      dispatch(setUser(user));
      localStorage.setItem('user', JSON.stringify(user));
      router.push('/tasks');
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUserState(null);
      dispatch(removeUser());
      localStorage.removeItem('user');
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = { user, login: handleLogin, register: handleRegister, logout: handleLogout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};