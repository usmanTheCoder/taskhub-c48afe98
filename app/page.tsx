'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { Button } from '@/components/UI/Button';
import { Spinner } from '@/components/UI/Spinner';
import { trpc } from '@/lib/trpc';

const Home = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const { data: tasksCount, isLoading: isLoadingTasksCount } = trpc.task.getTasksCount.useQuery();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/tasks');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || isLoadingTasksCount) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="max-w-md px-8 py-12 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-8">Welcome to TaskHub</h1>
        <p className="text-gray-600 text-center mb-8">
          {isAuthenticated
            ? `Hey ${user?.name}, you have ${tasksCount || 0} tasks!`
            : 'Manage your tasks efficiently with TaskHub.'}
        </p>
        <div className="flex justify-center gap-4">
          {!isAuthenticated && (
            <>
              <Link href="/login" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition-colors">
                <FaSignInAlt />
                Login
              </Link>
              <Link href="/register" className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition-colors">
                <FaUserPlus />
                Register
              </Link>
            </>
          )}
          {isAuthenticated && (
            <Button onClick={() => router.push('/tasks')}>View Tasks</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;