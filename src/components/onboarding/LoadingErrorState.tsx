
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';

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
      {error && <p className="mb-4 text-red-500">{error}</p>}
      
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button 
          onClick={onRefreshSession} 
          variant="default"
          className="flex items-center gap-2 w-full"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Session
        </Button>
        
        <Button 
          onClick={onClearAndReload}
          variant="destructive"
          className="w-full"
        >
          Clear Storage & Restart
        </Button>
      </div>
    </div>
  );
};

export default LoadingErrorState;
