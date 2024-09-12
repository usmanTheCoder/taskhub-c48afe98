'use client';

import React from 'react';
import Link from 'next/link';
import { FaHome } from 'react-icons/fa';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-screen bg-gray-100"
    >
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-2xl text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link href="/" className="btn btn-primary flex items-center justify-center">
          <FaHome className="mr-2" />
          Go to Home
        </Link>
      </div>
    </motion.div>
  );
};

export default NotFound;