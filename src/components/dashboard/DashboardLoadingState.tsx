
import React from 'react';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/auth/LoadingSpinner';

interface DashboardLoadingStateProps {
  timeSinceMount: number;
  sessionCheckAttempts: number;
  onClearAndReload: () => void;
}

const DashboardLoadingState: React.FC<DashboardLoadingStateProps> = ({
  timeSinceMount,
  sessionCheckAttempts,
  onClearAndReload
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <LoadingSpinner size={16} />
      <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
      <p className="mt-2 text-xs text-muted-foreground">
        {timeSinceMount > 5 ? 
          "This is taking longer than expected. Please wait..." : 
          "(This may take a moment)"}
      </p>
      {sessionCheckAttempts > 0 && (
        <p className="mt-2 text-xs text-muted-foreground">Session check attempts: {sessionCheckAttempts}</p>
      )}
      {timeSinceMount > 8 && (
        <Button
          onClick={onClearAndReload}
          variant="outline"
          size="sm"
          className="mt-4"
        >
          Restart Login Process
        </Button>
      )}
    </div>
  );
};

export default DashboardLoadingState;
