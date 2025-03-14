
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw, AlertCircle, Trash2 } from 'lucide-react';

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
  const clearStorageAndReload = () => {
    // Clear all storage
    console.log('Clearing all storage and reloading page');
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear any cookies related to Supabase auth
    document.cookie.split(";").forEach(function(c) {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    // Reload the page
    window.location.reload();
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md glass-card animate-fade-in shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-center text-red-500 mb-4">
            <AlertCircle size={48} />
          </div>
          <CardTitle className="text-2xl font-display text-center">
            Authentication Issue
          </CardTitle>
          <CardDescription className="text-center">
            We're having trouble connecting to the authentication service
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center">
          <p className="mb-6">
            It looks like you're signed in but we're having trouble loading your account details.
            Please try these troubleshooting steps:
          </p>
          
          <div className="space-y-4">
            <Button 
              onClick={onRefreshSession}
              className="w-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center gap-2"
              disabled={isRefreshing}
            >
              <RotateCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? "Refreshing Session..." : "Refresh Session"}
            </Button>
            
            <Button 
              onClick={onReloadPage}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reload Page
            </Button>
            
            <Button 
              onClick={clearStorageAndReload}
              variant="destructive"
              className="w-full flex items-center justify-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
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
