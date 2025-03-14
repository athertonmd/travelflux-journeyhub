
import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '@/types/auth.types';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Settings, LogOut, CreditCard } from 'lucide-react';

interface DashboardHeaderProps {
  user: User;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
  const { logOut } = useAuth();
  
  const handleLogOut = async () => {
    await logOut();
  };
  
  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto py-4 px-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">Welcome, {user.name}</h1>
            <p className="text-muted-foreground">{user.agencyName || 'Your Dashboard'}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              asChild
            >
              <Link to="/credits" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Credits
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              asChild
            >
              <Link to="/settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
