
import React, { createContext, useContext } from 'react';
import { User } from '@/types/auth.types';
import { useAuth } from '@/hooks/auth/useAuth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signUp: (name: string, email: string, password: string, agencyName?: string) => Promise<boolean>;
  logIn: (email: string, password: string) => Promise<boolean>;
  logOut: () => Promise<void>;
  updateSetupStatus: (completed: boolean) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signUp: async () => false,
  logIn: async () => false,
  logOut: async () => {},
  updateSetupStatus: async () => false
});

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};
