
import React, { createContext, useContext, ReactNode } from 'react';
import { AuthContextType } from '@/types/auth.types';
import { useAuth as useAuthImplementation } from '@/hooks/useAuth';

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signUp: async () => false,
  logIn: async () => false,
  logOut: async () => {},
  updateSetupStatus: async () => false,
  refreshSession: async () => null
});

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuthImplementation();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};
