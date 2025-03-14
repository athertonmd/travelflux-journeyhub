
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
            {refreshAttemptCount > 1 && " Try these troubleshooting steps:"}
          </p>
          
          <div className="space-y-4">
            <Button 
              onClick={onReloadPage}
              className="w-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center gap-2"
            >
              <RotateCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Reload Page
            </Button>
            
            <Button 
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                onReloadPage();
              }}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              Clear Storage & Reload
            </Button>
          </div>
          
          <div className="mt-8 text-sm text-gray-600 bg-gray-100 p-4 rounded-md text-left">
            <h3 className="font-semibold mb-2">Troubleshooting Tips:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Try using an incognito/private browsing window</li>
              <li>Clear your browser cookies and cache</li>
              <li>Check if you have any browser extensions blocking cookies</li>
              <li>Try a different browser</li>
              <li>Check your network connection</li>
              <li>Ensure your browser is up to date</li>
            </ul>
          </div>
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
