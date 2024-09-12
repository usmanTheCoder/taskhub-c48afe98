'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import { registerValidation } from '@/utils/validation';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/slices/authSlice';
import { FaUserCircle, FaLock } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';
import ErrorAlert from '@/components/UI/ErrorAlert';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const { mutate: register, isLoading } = trpc.auth.register.useMutation({
    onSuccess: (data) => {
      dispatch(setUser(data.user));
      router.push('/tasks');
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationError = registerValidation(username, email, password, confirmPassword);
    if (validationError) {
      setError(validationError);
      return;
    }
    register({ username, email, password });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md px-6 py-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">Register</h2>
        <form onSubmit={handleRegister}>
          {error && <ErrorAlert message={error} />}
          <Input
            icon={<FaUserCircle className="text-gray-400" />}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            icon={<MdEmail className="text-gray-400" />}
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            icon={<FaLock className="text-gray-400" />}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            icon={<FaLock className="text-gray-400" />}
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button type="submit" loading={isLoading}>
            Register
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;