// src/features/shared/components/Alert.jsx

import React, { useEffect } from 'react';

export const Alert = ({ 
  message, 
  type = 'info', 
  onClose, 
  autoClose = true,
  duration = 4000 
}) => {
  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const bgColor = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  };

  const textColor = {
    success: 'text-green-700',
    error: 'text-red-700',
    warning: 'text-yellow-700',
    info: 'text-blue-700',
  };

  return (
    <div 
      className={`border rounded-lg p-4 ${bgColor[type]} ${textColor[type]} text-sm`}
      role="alert"
    >
      {message}
    </div>
  );
};
