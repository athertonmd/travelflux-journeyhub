
import React, { createContext, useContext } from 'react';
import { AuthContextType } from '@/types/auth.types';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthActions } from '@/hooks/useAuthActions';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

  const value = {
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
