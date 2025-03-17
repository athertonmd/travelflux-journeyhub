
import React from 'react';
import { Button } from '@/components/ui/button';

interface ResetSessionButtonProps {
  isLoading: boolean;
  onReset: () => void;
}

const ResetSessionButton: React.FC<ResetSessionButtonProps> = ({ 
  isLoading, 
  onReset 
}) => {
  return (
    <div className="text-center mt-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="text-xs"
        onClick={onReset}
        disabled={isLoading}
      >
        Reset session data
      </Button>
    </div>
  );
};

export default ResetSessionButton;
