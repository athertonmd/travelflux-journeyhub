
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Settings, CreditCard, FileText, Users, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const DashboardSidebar = () => {
  const location = useLocation();
  const { logOut } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home className="h-5 w-5" /> },
    { name: 'Itineraries', path: '/itineraries', icon: <FileText className="h-5 w-5" /> },
    { name: 'Customers', path: '/customers', icon: <Users className="h-5 w-5" /> },
    { name: 'Credits', path: '/credits', icon: <CreditCard className="h-5 w-5" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="h-5 w-5" /> },
  ];
  
  return (
    <div className="hidden md:flex flex-col w-64 border-r border-border bg-card h-screen py-6 px-3">
      <div className="flex items-center px-4 mb-8">
        <span className="text-xl font-semibold">Tripscape</span>
      </div>
      
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {React.cloneElement(item.icon, {
                className: cn(
                  "mr-3",
                  isActive ? "text-primary" : "text-muted-foreground"
                )
              })}
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="px-4 mt-6 pt-6 border-t border-border">
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={logOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
