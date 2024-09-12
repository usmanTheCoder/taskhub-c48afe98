'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { trpc } from '@/lib/trpc';
import AuthProvider from '@/components/Authentication/AuthProvider';
import Spinner from '@/components/UI/Spinner';

const inter = Inter({ subsets: ['latin'] });

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const [trpcClient] = React.useState(() => trpc.createClient());
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        {isLoading ? (
          <div className="flex items-center justify-center h-screen">
            <Spinner />
          </div>
        ) : (
          <Provider store={store}>
            <trpc.Provider client={trpcClient} queryClient={trpc.queryClient}>
              <AuthProvider>{children}</AuthProvider>
            </trpc.Provider>
          </Provider>
        )}
      </body>
    </html>
  );
};

export default RootLayout;