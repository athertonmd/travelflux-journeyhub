import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw, AlertCircle, Info, RefreshCw } from 'lucide-react';
import { clearAuthData } from '@/integrations/supabase/client';

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
    // Show toast
    // Set clear in progress flag to prevent loops
    sessionStorage.setItem('manual-clear-in-progress', 'true');
    
    // Clear all storage using the helper function
    console.log('Clearing all storage and reloading page');
    clearAuthData();
    
    // Add a slight delay to ensure the clear operation completes
    setTimeout(() => {
      // Use replace instead of href to avoid adding to browser history
      window.location.replace('/login?cleared=true');
    }, 1000);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md glass-card animate-fade-in shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-center text-amber-500 mb-4">
            <AlertCircle size={48} />
          </div>
          <CardTitle className="text-2xl font-display text-center">
            Authentication Issue
          </CardTitle>
          <CardDescription className="text-center">
            We're having trouble with the authentication process
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center">
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6 text-left">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
              <p className="text-sm text-amber-800">
                {authStuck 
                  ? "The authentication process is taking longer than expected. Most users resolve this by clicking the 'Clear Storage & Login Again' button below."
                  : "We're having trouble verifying your credentials. This is typically fixed by clearing your browser storage and trying again."}
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={clearStorageAndReload}
              className="w-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Clear Storage & Login Again
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Or try these options</span>
              </div>
            </div>
            
            <Button 
              onClick={onRefreshSession}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              disabled={isRefreshing || refreshAttemptCount >= 3}
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
          </div>
          
          <div className="mt-8 text-sm text-gray-600 bg-gray-100 p-4 rounded-md text-left">
            <h3 className="font-semibold mb-2">Why This Happens:</h3>
            <p className="mb-4">Authentication issues are often caused by browser caching conflicts or stuck sessions. The "Clear Storage & Login Again" button is the most reliable fix as it performs a complete reset of your session data.</p>
            
            <h3 className="font-semibold mb-2">Additional Troubleshooting:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Try using an incognito/private browsing window</li>
              <li>Clear your browser cookies and cache</li>
              <li>Check if you have any browser extensions blocking cookies</li>
              <li>Try a different browser</li>
            </ul>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col text-sm text-gray-500">
          <p className="text-center">
            If this issue persists after trying all solutions, please contact support.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginErrorState;
