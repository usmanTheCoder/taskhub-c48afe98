'use client';

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import { setAuthToken, getAuthToken, removeAuthToken } from './utils';
import { useDispatch } from 'react-redux';
import { setUser, unsetUser } from '@/store/slices/authSlice';

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  isLoading: false,
  error: null,
});

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const { mutate: loginMutation } = trpc.auth.login.useMutation();
  const { mutate: registerMutation } = trpc.auth.register.useMutation();
  const { mutate: logoutMutation } = trpc.auth.logout.useMutation();

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const { user, token } = await loginMutation({ email, password });
        setAuthToken(token);
        setUser(user);
        dispatch(setUser(user));
        setIsAuthenticated(true);
        router.push('/tasks');
      } catch (err) {
        setError('Invalid email or password');
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, loginMutation, router],
  );

  const register = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const { user, token } = await registerMutation({ email, password });
        setAuthToken(token);
        setUser(user);
        dispatch(setUser(user));
        setIsAuthenticated(true);
        router.push('/tasks');
      } catch (err) {
        setError('Failed to register');
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, registerMutation, router],
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await logoutMutation();
      removeAuthToken();
      setUser(null);
      dispatch(unsetUser());
      setIsAuthenticated(false);
      router.push('/');
    } catch (err) {
      setError('Failed to logout');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, logoutMutation, router]);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const authContextValue: AuthContextValue = {
    isAuthenticated,
    user,
    login,
    register,
    logout,
    isLoading,
    error,
  };

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

export default AuthProvider;