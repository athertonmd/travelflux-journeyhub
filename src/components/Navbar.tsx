
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut, HomeIcon, Package, Component, ScrollText, Mail } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dock, DockIcon, DockItem, DockLabel } from '@/components/ui/dock';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Sample authentication state - replace with actual auth
  const isAuthenticated = location.pathname.includes('/dashboard');
  const user = isAuthenticated ? {
    name: 'John Doe',
    email: 'john@example.com'
  } : null;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when changing routes
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navLinks = isAuthenticated ? [{
    name: 'Dashboard',
    path: '/dashboard',
    icon: <HomeIcon className="h-full w-full text-neutral-600 dark:text-neutral-300" />
  }, {
    name: 'Itineraries',
    path: '/itineraries',
    icon: <ScrollText className="h-full w-full text-neutral-600 dark:text-neutral-300" />
  }, {
    name: 'Customers',
    path: '/customers',
    icon: <User className="h-full w-full text-neutral-600 dark:text-neutral-300" />
  }, {
    name: 'Documents',
    path: '/documents',
    icon: <Package className="h-full w-full text-neutral-600 dark:text-neutral-300" />
  }] : [{
    name: 'Home',
    path: '/',
    icon: <HomeIcon className="h-full w-full text-neutral-600 dark:text-neutral-300" />
  }, {
    name: 'Features',
    path: '/#features',
    section: 'features',
    icon: <Component className="h-full w-full text-neutral-600 dark:text-neutral-300" />
  }, {
    name: 'Pricing',
    path: '/#pricing',
    section: 'pricing',
    icon: <Package className="h-full w-full text-neutral-600 dark:text-neutral-300" />
  }, {
    name: 'Contact',
    path: '/#contact',
    section: 'contact',
    icon: <Mail className="h-full w-full text-neutral-600 dark:text-neutral-300" />
  }];

  return <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-primary font-display font-bold text-xl">Tripscape</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex space-x-2">
              <Dock className="bg-transparent items-center px-2" panelHeight={48} magnification={60}>
                {navLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    to={link.path}
                    onClick={(e) => link.section && handleNavClick(e, link.section)}
                  >
                    <DockItem className="rounded-full bg-transparent">
                      <DockLabel>{link.name}</DockLabel>
                      <DockIcon>{link.icon}</DockIcon>
                    </DockItem>
                  </Link>
                ))}
              </Dock>
            </div>
            
            <div className="flex items-center space-x-2">
              {isAuthenticated ? <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 border border-primary/20">
                      <User size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 animate-slide-up">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex items-center space-x-2">
                      <span>{user?.name}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{user?.email}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex items-center space-x-2 cursor-pointer">
                      <LogOut size={16} />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu> : <>
                  <Button variant="ghost" asChild>
                    <Link to="/login">Log in</Link>
                  </Button>
                  <Button asChild className="animated-border-button">
                    <Link to="/signup">Sign up</Link>
                  </Button>
                </>}
            </div>
          </div>
          
          <div className="md:hidden flex items-center">
            <button onClick={toggleMobileMenu} className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 focus:outline-none">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-screen bg-white/95 backdrop-blur-md shadow-lg' : 'max-h-0'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map(link => <Link 
              key={link.name} 
              to={link.path} 
              onClick={(e) => link.section && handleNavClick(e, link.section)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium ${location.pathname === link.path ? 'text-primary bg-primary/10' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <div className="w-5 h-5">{link.icon}</div>
              {link.name}
            </Link>)}
          
          {isAuthenticated ? <div className="border-t border-gray-200 pt-4 pb-3">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User size={20} />
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user?.name}</div>
                  <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">
                  Log out
                </Link>
              </div>
            </div> : <div className="mt-4 space-y-2 px-3">
              <Button variant="outline" asChild className="w-full justify-center">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild className="w-full justify-center animated-border-button">
                <Link to="/signup">Sign up</Link>
              </Button>
            </div>}
        </div>
      </div>
    </nav>;
};

export default Navbar;
