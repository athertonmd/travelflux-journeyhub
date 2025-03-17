
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface ResetSessionButtonProps {
  isLoading: boolean;
  onReset: () => void;
  label?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
  icon?: React.ReactNode;
  size?: "default" | "sm" | "lg" | "icon";
}

const ResetSessionButton: React.FC<ResetSessionButtonProps> = ({ 
  isLoading, 
  onReset,
  label = "Reset session data",
  variant = "outline",
  className = "text-xs",
  icon,
  size = "sm"
}) => {
  return (
    <div className="text-center mt-2">
      <Button
        type="button"
        variant={variant}
        size={size}
        className={className}
        onClick={onReset}
        disabled={isLoading}
      >
        {icon || (variant === "outline" ? <RefreshCw className="h-4 w-4 mr-2" /> : null)}
        {isLoading ? "Processing..." : label}
      </Button>
    </div>
  );
};

export default ResetSessionButton;
