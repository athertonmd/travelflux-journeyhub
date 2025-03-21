
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, ArrowRight } from 'lucide-react';

interface LoadingErrorStateProps {
  error: string | null;
  retryCount: number;
  onRefreshSession: () => Promise<void>;
  onClearAndReload: () => void;
}

const LoadingErrorState: React.FC<LoadingErrorStateProps> = ({
  error,
  retryCount,
  onRefreshSession,
  onClearAndReload
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="mb-4 text-amber-500">
        <AlertTriangle size={40} />
      </div>
      <p className="mb-2 text-lg font-semibold">Loading is taking longer than expected...</p>
      {error && (
        <div className="mb-4 p-3 border border-red-200 bg-red-50 rounded-md max-w-md text-center">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button 
          onClick={onRefreshSession} 
          variant="default"
          className="flex items-center gap-2 w-full"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Session {retryCount > 0 && `(Attempt ${retryCount + 1})`}
        </Button>
        
        <Button 
          onClick={onClearAndReload}
          variant="outline"
          className="w-full flex items-center gap-2"
        >
          Clear Storage & Login Again
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      
      <p className="mt-4 text-xs text-muted-foreground max-w-md text-center">
        If you continue to experience issues, please contact customer support for assistance.
      </p>
    </div>
  );
};

export default LoadingErrorState;
