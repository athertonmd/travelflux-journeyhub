
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Trash2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface LoadingErrorStateProps {
  error: string | null;
  retryCount: number;
  onRefreshSession: () => Promise<boolean>;
  onClearAndReload: () => void;
}

const LoadingErrorState: React.FC<LoadingErrorStateProps> = ({
  error,
  retryCount,
  onRefreshSession,
  onClearAndReload
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="bg-red-50 text-red-900">
          <CardTitle className="flex items-center text-xl">
            <AlertCircle className="h-5 w-5 mr-2" />
            Setup Error
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              We're having trouble loading your agency setup:
            </p>
            <div className="p-3 bg-red-50 rounded-md text-sm text-red-800">
              {error || "Unable to load your agency setup. This could be due to a network issue or session problem."}
            </div>
            {retryCount > 0 && (
              <p className="text-xs text-amber-600">
                Retry attempts: {retryCount}
              </p>
            )}
            <p className="text-sm text-gray-600">
              You can try refreshing your session or clearing stored data to resolve this issue.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button 
            className="w-full flex items-center justify-center"
            onClick={onRefreshSession}
            variant="default"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Session
          </Button>
          <Button 
            className="w-full flex items-center justify-center"
            onClick={onClearAndReload}
            variant="destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Storage & Reload
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoadingErrorState;
