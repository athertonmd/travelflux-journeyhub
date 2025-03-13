
import React from 'react';

const LoadingSpinner = ({ size = 12, className = "" }: { size?: number, className?: string }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full h-${size} w-${size} border-t-2 border-b-2 border-primary`}></div>
    </div>
  );
};

export default LoadingSpinner;
