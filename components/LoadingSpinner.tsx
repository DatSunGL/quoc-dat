import React, { useState, useEffect } from 'react';

interface LoadingSpinnerProps {
  message: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-8 flex flex-col items-center justify-center gap-4 text-center">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-green-400"></div>
      <p className="text-lg font-semibold text-gray-300">{message || `AI đang xử lý`}{dots}</p>
      <p className="text-sm text-gray-500">Quá trình này có thể mất một chút thời gian, vui lòng không đóng tab.</p>
    </div>
  );
};

export default LoadingSpinner;