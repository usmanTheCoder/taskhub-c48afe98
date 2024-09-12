'use client';

import React, { useEffect, useState } from 'react';
import { MdCheckCircle } from 'react-icons/md';

interface SuccessAlertProps {
  message: string;
  duration?: number;
  onClose?: () => void;
}

const SuccessAlert: React.FC<SuccessAlertProps> = ({
  message,
  duration = 3000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return isVisible ? (
    <div className="fixed bottom-4 left-4 z-50 flex items-center bg-green-500 px-4 py-3 rounded-md shadow-md">
      <MdCheckCircle className="text-white mr-2" size={24} />
      <span className="text-white font-semibold">{message}</span>
    </div>
  ) : null;
};

export default SuccessAlert;