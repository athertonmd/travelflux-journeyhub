
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import DesktopNav from './navbar/DesktopNav';
import MobileMenu from './navbar/MobileMenu';
import { useNavbar } from './navbar/useNavbar.tsx';

const Navbar = () => {
  const {
    isScrolled,
    isMobileMenuOpen,
    isAuthenticated,
    user,
    navLinks,
    featureSubItems,
    toggleMobileMenu,
    handleNavClick,
    handleLogout
  } = useNavbar();

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-primary font-display font-bold text-xl">Tripscape</span>
            </Link>
          </div>
          
          <DesktopNav 
            navLinks={navLinks}
            featureSubItems={featureSubItems}
            handleNavClick={handleNavClick}
            isAuthenticated={isAuthenticated}
            user={user}
            handleLogout={handleLogout}
          />
          
          <div className="md:hidden flex items-center">
            <button onClick={toggleMobileMenu} className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 focus:outline-none">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        navLinks={navLinks}
        featureSubItems={featureSubItems}
        handleNavClick={handleNavClick}
        isAuthenticated={isAuthenticated}
        user={user}
        handleLogout={handleLogout}
      />
    </nav>
  );
};

export default Navbar;
