
import React, { createContext, useContext } from 'react';
import { User } from '@/types/auth.types';
import { useAuth as useAuthImplementation } from '@/hooks/auth/useAuth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signUp: (name: string, email: string, password: string, agencyName?: string) => Promise<boolean>;
  logIn: (email: string, password: string) => Promise<boolean>;
  logOut: () => Promise<void>;
  updateSetupStatus: (completed: boolean) => Promise<boolean>;
  refreshSession: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signUp: async () => false,
  logIn: async () => false,
  logOut: async () => {},
  updateSetupStatus: async () => false,
  refreshSession: async () => null
});

// This hook provides access to the auth context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

// Export useAuth as an alias of useAuthContext for backward compatibility
export const useAuth = useAuthContext;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuthImplementation();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};
