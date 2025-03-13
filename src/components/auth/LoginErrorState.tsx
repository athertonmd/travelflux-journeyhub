
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface LoginErrorStateProps {
  isRefreshing: boolean;
  refreshAttemptCount: number;
  authStuck: boolean;
  onRefreshSession: () => Promise<void>;
}

const LoginErrorState: React.FC<LoginErrorStateProps> = ({
  isRefreshing,
  refreshAttemptCount,
  authStuck,
  onRefreshSession,
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Authentication is taking longer than expected</h2>
        <p className="mb-4">This could be due to network issues or a problem with the authentication service.</p>
        <Button 
          onClick={onRefreshSession} 
          disabled={isRefreshing}
          className="mx-auto"
        >
          {isRefreshing ? 'Refreshing...' : 'Refresh Session'}
        </Button>
        {(authStuck || refreshAttemptCount > 0) && !isRefreshing && (
          <div className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="mx-auto"
            >
              Reload Page
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginErrorState;
