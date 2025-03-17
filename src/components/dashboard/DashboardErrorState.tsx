
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ResetSessionButton from '@/components/auth/ResetSessionButton';
import { toast } from '@/hooks/use-toast';

interface DashboardErrorStateProps {
  isRecovering: boolean;
  sessionChecked: boolean;
  sessionCheckAttempts: number;
  timeSinceMount: number;
  onRefreshConnection: () => Promise<void>;
}

const DashboardErrorState: React.FC<DashboardErrorStateProps> = ({
  isRecovering,
  sessionChecked,
  sessionCheckAttempts,
  timeSinceMount,
  onRefreshConnection
}) => {
  const navigate = useNavigate();

  const handleClearAndReload = () => {
    try {
      console.log('Dashboard: Clearing storage and reloading');
      // Flag to prevent auth state change loops during manual clear
      sessionStorage.setItem('manual-clear-in-progress', 'true');
      
      localStorage.clear();
      sessionStorage.clear();
      
      // Redirect to login with cleared=true parameter to indicate storage was cleared
      window.location.href = '/login?cleared=true';
    } catch (error) {
      console.error('Dashboard: Clear storage error:', error);
      toast({
        title: "Error",
        description: "Failed to clear storage. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <p className="text-lg font-semibold mb-2">Loading is taking longer than expected</p>
      <p className="mb-4 text-muted-foreground">
        {sessionChecked ? 'Your session is verified but we\'re having trouble loading your data.' 
                        : 'We\'re having trouble verifying your session.'}
      </p>
      <div className="flex flex-col gap-4 w-full max-w-md">
        <Button 
          onClick={onRefreshConnection} 
          variant="default"
          className="flex items-center gap-2"
          disabled={isRecovering}
        >
          <RefreshCw className={`h-4 w-4 ${isRecovering ? 'animate-spin' : ''}`} />
          {isRecovering ? "Refreshing..." : "Refresh Session"}
        </Button>
        
        <ResetSessionButton 
          isLoading={isRecovering}
          onReset={handleClearAndReload}
          variant="destructive"
          label="Clear Storage & Reload"
          className="w-full"
        />
        
        <div className="mt-4 text-xs text-muted-foreground text-center">
          <p>If you continue to experience issues, please contact support.</p>
          <p className="mt-1">Session checked: {sessionChecked ? 'Yes' : 'No'} | Load attempts: {sessionCheckAttempts}</p>
          <p className="mt-1">Time since page load: {timeSinceMount} seconds</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardErrorState;
