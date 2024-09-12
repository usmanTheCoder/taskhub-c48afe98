import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { trpc } from '@/lib/trpc';
import { useDispatch } from 'react-redux';
import { setUser, removeUser } from '@/store/slices/authSlice';
import { validateEmail, validatePassword } from '@/utils/validation';

export const useAuth = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { mutate: register } = trpc.useMutation('auth.register', {
    onSuccess: (data) => {
      dispatch(setUser(data.user));
      router.push('/tasks');
    },
    onError: (error) => {
      setError(error.message);
      setIsLoading(false);
    },
  });

  const { mutate: login } = trpc.useMutation('auth.login', {
    onSuccess: (data) => {
      dispatch(setUser(data.user));
      router.push('/tasks');
    },
    onError: (error) => {
      setError(error.message);
      setIsLoading(false);
    },
  });

  const logout = useCallback(() => {
    dispatch(removeUser());
    router.push('/');
  }, [dispatch, router]);

  const registerUser = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);

      const isValidEmail = validateEmail(email);
      const isValidPassword = validatePassword(password);

      if (!isValidEmail) {
        setError('Invalid email address');
        setIsLoading(false);
        return;
      }

      if (!isValidPassword) {
        setError('Password must be at least 8 characters long');
        setIsLoading(false);
        return;
      }

      try {
        await register({ email, password });
      } catch (err) {
        setError('Failed to register user');
        setIsLoading(false);
      }
    },
    [register],
  );

  const loginUser = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);

      const isValidEmail = validateEmail(email);
      const isValidPassword = validatePassword(password);

      if (!isValidEmail) {
        setError('Invalid email address');
        setIsLoading(false);
        return;
      }

      if (!isValidPassword) {
        setError('Password must be at least 8 characters long');
        setIsLoading(false);
        return;
      }

      try {
        await login({ email, password });
      } catch (err) {
        setError('Failed to login user');
        setIsLoading(false);
      }
    },
    [login],
  );

  return {
    isLoading,
    error,
    register: registerUser,
    login: loginUser,
    logout,
  };
};