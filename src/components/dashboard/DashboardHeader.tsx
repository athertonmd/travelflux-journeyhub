
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import LoadingSpinner from '@/components/auth/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';

interface DashboardHeaderProps {
  pageTitle: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ pageTitle }) => {
  const { user, logOut, isLoading } = useAuth();
  
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-semibold">{pageTitle}</h1>
      
      <div className="flex items-center space-x-4">
        {user && (
          <div className="text-sm text-gray-600">
            Welcome, {user.user_metadata?.name || user.email}
          </div>
        )}
        
        <Button 
          size="sm" 
          variant="outline"
          onClick={logOut}
          disabled={isLoading}
        >
          {isLoading ? (
            <LoadingSpinner size={4} />
          ) : (
            <>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
