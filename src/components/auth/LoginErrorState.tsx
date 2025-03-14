
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, RotateCcw } from 'lucide-react';

interface LoginErrorStateProps {
  isRefreshing: boolean;
  refreshAttemptCount: number;
  authStuck: boolean;
  onRefreshSession: () => Promise<boolean>;
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
            {refreshAttemptCount > 1 
              ? "We're still having trouble connecting to the authentication service"
              : "We're having trouble connecting to the authentication service"}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center">
          <p className="mb-6">
            This could be due to network issues or a temporary problem with our service.
            {refreshAttemptCount > 1 && " You can try reloading the page or signing in with different credentials."}
          </p>
          
          <Button 
            onClick={onReloadPage}
            className="w-full mb-4 bg-blue-500 hover:bg-blue-600 flex items-center justify-center gap-2"
          >
            <RotateCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Reload Page
          </Button>
          
          <p className="text-sm text-gray-600 mt-4">
            If reloading doesn't work, you can try:
          </p>
          <ul className="text-sm text-gray-600 list-disc list-inside mt-2 text-left">
            <li>Clearing your browser cache and cookies</li>
            <li>Using an incognito/private browsing window</li>
            <li>Checking your network connection</li>
          </ul>
        </CardContent>
        
        <CardFooter className="flex flex-col text-sm text-gray-500">
          <p className="text-center">
            If this issue persists, please contact support.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginErrorState;
