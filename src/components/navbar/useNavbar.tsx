
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, MessageSquare, ShieldAlert, Smartphone } from 'lucide-react';
import { FeatureSubItem, NavLink } from './types';

export const useNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Determine if user is authenticated
  const isAuthenticated = !!user;

  // Feature submenu items
  const featureSubItems: FeatureSubItem[] = [
    {
      name: 'Mobile',
      path: '/features/mobile',
      icon: <Smartphone className="h-4 w-4 mr-2" />
    },
    {
      name: 'Document Delivery',
      path: '/features/document-delivery',
      icon: <FileText className="h-4 w-4 mr-2" />
    },
    {
      name: 'Microsoft Teams',
      path: '/features/microsoft-teams',
      icon: <MessageSquare className="h-4 w-4 mr-2" />
    },
    {
      name: 'Risk Management',
      path: '/features/risk-management',
      icon: <ShieldAlert className="h-4 w-4 mr-2" />
    }
  ];

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

  const navLinks: NavLink[] = isAuthenticated ? [{
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
  }, {
    name: 'Blog',
    path: '/blog'
  }] : [{
    name: 'Home',
    path: '/#home',
    section: 'home'
  }, {
    name: 'Features',
    path: '/#features',
    section: 'features',
    hasSubmenu: true
  }, {
    name: 'Pricing',
    path: '/#pricing',
    section: 'pricing'
  }, {
    name: 'Contact',
    path: '/contact'
  }, {
    name: 'Blog',
    path: '/blog'
  }];

  return {
    isScrolled,
    isMobileMenuOpen,
    isAuthenticated,
    user,
    navLinks,
    featureSubItems,
    toggleMobileMenu,
    handleNavClick,
    handleLogout
  };
};
