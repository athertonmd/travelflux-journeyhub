import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Determine if user is authenticated
  const isAuthenticated = !!user;

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
      if (sectionId === 'home') {
        // Scroll to top of the page smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = isAuthenticated ? [{
    name: 'Dashboard',
    path: '/dashboard'
  }, {
    name: 'Itineraries',
    path: '/itineraries'
  }, {
    name: 'Customers',
    path: '/customers'
  }, {
    name: 'Documents',
    path: '/documents'
  }] : [{
    name: 'Home',
    path: '/#home',
    section: 'home'
  }, {
    name: 'Features',
    path: '/#features',
    section: 'features'
  }, {
    name: 'Pricing',
    path: '/#pricing',
    section: 'pricing'
  }, {
    name: 'Contact',
    path: '/contact'
  }];

  return <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-primary font-display font-bold text-xl">Tripscape</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex space-x-8">
              {navLinks.map(link => <Link 
                  key={link.name} 
                  to={link.path} 
                  onClick={(e) => link.section && handleNavClick(e, link.section)}
                  className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === link.path ? 'text-primary' : 'text-gray-600'}`}
                >
                  {link.name}
                </Link>)}
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
              className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === link.path ? 'text-primary bg-primary/10' : 'text-gray-700 hover:bg-gray-50'}`}
            >
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
