
import React from 'react';

const LoadingSpinner = ({ size = 12, className = "" }: { size?: number, className?: string }) => {
  // Calculate actual size in pixels for better visibility
  const pixelSize = size * 4; // 4px per size unit
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className={`animate-spin rounded-full border-t-2 border-b-2 border-primary`}
        style={{ 
          width: `${pixelSize}px`, 
          height: `${pixelSize}px`,
          borderWidth: `${Math.max(2, size/4)}px` 
        }}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
