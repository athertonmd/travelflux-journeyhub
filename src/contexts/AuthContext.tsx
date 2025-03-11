
import React, { createContext, useContext } from 'react';
import { AuthContextType } from '@/types/auth.types';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthActions } from '@/hooks/useAuthActions';

// Create context with a default value that matches the shape
const defaultValue: AuthContextType = {
  user: null,
  isLoading: true,
  login: async () => false,
  signup: async () => false,
  logout: async () => {},
  checkSetupStatus: async () => false,
  updateSetupStatus: async () => false
};

const AuthContext = createContext<AuthContextType>(defaultValue);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, setUser, isLoading, setIsLoading } = useAuthState();
  const { login, signup, logout, checkSetupStatus, updateSetupStatus } = useAuthActions(setUser, setIsLoading);

  // Add debug logging to help diagnose auth state issues
  React.useEffect(() => {
    console.log('AuthContext state updated:', { 
      isLoggedIn: !!user, 
      isLoading, 
      setupCompleted: user?.setupCompleted
    });
  }, [user, isLoading]);

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    signup,
    logout,
    checkSetupStatus,
    updateSetupStatus
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
