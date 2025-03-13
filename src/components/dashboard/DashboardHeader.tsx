
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, HelpCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User } from '@/types/auth.types';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardHeaderProps {
  user: User;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
  const navigate = useNavigate();
  const { logOut } = useAuth();
  
  const handleLogout = async () => {
    await logOut();
    navigate('/');
  };
  
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto py-4 px-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Agency Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">Welcome, {user.name || user.email}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/settings')}
          >
            <Settings className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            title="Log out"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
