'use client';

import React from 'react';
import { RiAlertFill } from 'react-icons/ri';

interface ErrorAlertProps {
  message: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message }) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error!</strong>
      <span className="block sm:inline">{message}</span>
      <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
        <RiAlertFill className="h-6 w-6 text-red-500" />
      </span>
    </div>
  );
};

export default ErrorAlert;