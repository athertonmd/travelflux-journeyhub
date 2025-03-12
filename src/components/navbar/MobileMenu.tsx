import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronDown, User } from 'lucide-react';
import { FeatureSubItem } from './types.tsx';

interface MobileMenuProps {
  isOpen: boolean;
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

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  navLinks,
  featureSubItems,
  handleNavClick,
  isAuthenticated,
  user,
  handleLogout
}) => {
  const location = useLocation();
  
  return (
    <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-screen bg-white/95 backdrop-blur-md shadow-lg' : 'max-h-0'}`}>
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        {navLinks.map(link => 
          link.hasSubmenu ? (
            <div key={link.name} className="space-y-1">
              <Link 
                to={link.path} 
                onClick={(e) => link.section && handleNavClick(e, link.section)}
                className={`flex items-center justify-between px-3 py-2 rounded-md text-base font-medium ${location.pathname.startsWith('/features') ? 'text-primary bg-primary/10' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <span>{link.name}</span>
                <ChevronDown className="h-4 w-4" />
              </Link>
              <div className="pl-4 space-y-1 border-l-2 border-gray-200 ml-3">
                {featureSubItems.map(subItem => (
                  <Link 
                    key={subItem.name}
                    to={subItem.path}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === subItem.path ? 'text-primary bg-primary/10' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {subItem.icon}
                    <span>{subItem.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link 
              key={link.name} 
              to={link.path} 
              onClick={(e) => link.section && handleNavClick(e, link.section)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === link.path ? 'text-primary bg-primary/10' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              {link.name}
            </Link>
          )
        )}
        
        {isAuthenticated ? (
          <div className="border-t border-gray-200 pt-4 pb-3">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <User size={20} />
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{user.name}</div>
                <div className="text-sm font-medium text-gray-500">{user.email}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <button 
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Log out
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-2 px-3">
            <Button variant="outline" asChild className="w-full justify-center">
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild className="w-full justify-center animated-border-button">
              <Link to="/signup">Sign up</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
