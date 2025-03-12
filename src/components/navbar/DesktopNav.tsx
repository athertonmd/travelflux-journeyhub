
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronDown, LogOut, User } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FeatureSubItem } from './types';

interface DesktopNavProps {
  navLinks: {
    name: string;
    path: string;
    section?: string;
    hasSubmenu?: boolean;
  }[];
  featureSubItems: FeatureSubItem[];
  handleNavClick: (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => void;
  isAuthenticated: boolean;
  user: any;
  handleLogout: () => void;
}

const DesktopNav: React.FC<DesktopNavProps> = ({
  navLinks,
  featureSubItems,
  handleNavClick,
  isAuthenticated,
  user,
  handleLogout
}) => {
  const location = useLocation();
  
  return (
    <div className="hidden md:flex items-center space-x-4">
      <div className="flex space-x-8">
        {navLinks.map(link => 
          link.hasSubmenu ? (
            <DropdownMenu key={link.name}>
              <DropdownMenuTrigger className="group flex items-center text-sm font-medium transition-colors hover:text-primary">
                <Link 
                  to={link.path} 
                  onClick={(e) => link.section && handleNavClick(e, link.section)}
                  className={`flex items-center ${location.pathname.startsWith('/features') ? 'text-primary' : 'text-gray-600'}`}
                >
                  {link.name}
                  <ChevronDown className="ml-1 h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                </Link>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56">
                {featureSubItems.map(subItem => (
                  <DropdownMenuItem key={subItem.name} asChild>
                    <Link 
                      to={subItem.path} 
                      className="flex items-center cursor-pointer"
                    >
                      {subItem.icon}
                      <span>{subItem.name}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link 
              key={link.name} 
              to={link.path} 
              onClick={(e) => link.section && handleNavClick(e, link.section)}
              className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === link.path ? 'text-primary' : 'text-gray-600'}`}
            >
              {link.name}
            </Link>
          )
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 border border-primary/20">
                <User size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 animate-slide-up">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center space-x-2">
                <span>{user.name}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>{user.email}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center space-x-2 cursor-pointer" onClick={handleLogout}>
                <LogOut size={16} />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Button variant="ghost" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild className="animated-border-button">
              <Link to="/signup">Sign up</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default DesktopNav;
