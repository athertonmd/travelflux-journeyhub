
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Home, Settings, CreditCard, FileText, Users, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const DashboardMobileNav = () => {
  const [open, setOpen] = useState(false);
  const { logOut } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home className="h-5 w-5" /> },
    { name: 'Itineraries', path: '/itineraries', icon: <FileText className="h-5 w-5" /> },
    { name: 'Customers', path: '/customers', icon: <Users className="h-5 w-5" /> },
    { name: 'Credits', path: '/credits', icon: <CreditCard className="h-5 w-5" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="h-5 w-5" /> },
  ];
  
  return (
    <div className="md:hidden flex items-center">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="mr-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="text-lg font-semibold">Tripscape</span>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <nav className="flex-1 overflow-auto py-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center px-4 py-3 text-base hover:bg-accent"
                  onClick={() => setOpen(false)}
                >
                  {React.cloneElement(item.icon, {
                    className: "mr-3 text-muted-foreground"
                  })}
                  {item.name}
                </Link>
              ))}
            </nav>
            
            <div className="p-4 border-t">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  setOpen(false);
                  logOut();
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default DashboardMobileNav;
