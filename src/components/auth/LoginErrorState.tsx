
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface LoginErrorStateProps {
  isRefreshing: boolean;
  refreshAttemptCount: number;
  authStuck: boolean;
  onRefreshSession: () => Promise<void>;
  onReloadPage: () => void;
}

const LoginErrorState: React.FC<LoginErrorStateProps> = ({
  isRefreshing,
  refreshAttemptCount,
  authStuck,
  onRefreshSession,
  onReloadPage,
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md glass-card animate-fade-in shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-display text-center">
            Connection Issue
          </CardTitle>
          <CardDescription className="text-center">
            We're having trouble connecting to the authentication service
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center">
          <p className="mb-6">
            This could be due to network issues or a temporary problem with our service.
          </p>
          
          <Button 
            onClick={onRefreshSession} 
            disabled={isRefreshing}
            className="w-full mb-4 bg-blue-500 hover:bg-blue-600"
          >
            {isRefreshing ? 'Refreshing Connection...' : 'Refresh Connection'}
          </Button>
          
          {(refreshAttemptCount > 0 || authStuck) && !isRefreshing && (
            <div className="mt-2">
              <Button 
                variant="outline" 
                onClick={onReloadPage}
                className="w-full"
              >
                Reload Page
              </Button>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col text-sm text-gray-500">
          <p className="text-center">
            {refreshAttemptCount > 1 
              ? "If this issue persists, please try again later or contact support."
              : "This will clear your local session data and attempt to reconnect."}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginErrorState;
