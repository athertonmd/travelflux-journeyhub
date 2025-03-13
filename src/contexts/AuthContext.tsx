
import React, { createContext, useContext } from 'react';
import { User } from '@/types/auth.types';
import { useAuth as useAuthImplementation } from '@/hooks/useAuth';

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
  
  // Add an unhandled promise rejection listener to catch auth-related promise rejections
  React.useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Log the unhandled promise rejection
      console.error('Unhandled promise rejection:', event.reason);
    };
    
    // Add the event listener
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    // Clean up
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};
