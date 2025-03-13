
import React, { createContext, useContext, useEffect } from 'react';
import { AuthContextType } from '@/types/auth.types';
import { useAuthContext } from '@/hooks/auth/useAuthContext';

// Create context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
  signup: async () => false,
  logout: async () => {},
  checkSetupStatus: async () => false,
  updateSetupStatus: async () => false,
  refreshSession: async () => null
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get all auth functionality from our custom hook
  const {
    user,
    isLoading,
    login,
    signup,
    logout,
    checkSetupStatus,
    updateSetupStatus,
    refreshSession,
    debugLogRef
  } = useAuthContext();
  
  // Debug logging effect - make sure it's consistent in the render cycle
  useEffect(() => {
    if (debugLogRef.current) {
      console.log('AuthContext state updated:', { 
        isLoggedIn: !!user, 
        isLoading, 
        setupCompleted: user?.setupCompleted,
        user: user ? {
          id: user.id,
          email: user.email,
          setupCompleted: user.setupCompleted
        } : null
      });
    }
  }, [user, isLoading]);

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    signup,
    logout,
    checkSetupStatus,
    updateSetupStatus,
    refreshSession
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
