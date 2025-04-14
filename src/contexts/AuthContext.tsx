
import React, { createContext, useContext, ReactNode } from 'react';
import { AuthContextType } from '@/types/auth.types';
import { useAuthProvider } from '@/hooks/auth/useAuthProvider';

// Create the auth context with a default undefined value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the AuthProvider component that wraps the application
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Use the hook that contains all the auth logic
  const authValues = useAuthProvider();
  
  return (
    <AuthContext.Provider value={authValues}>
      {children}
    </AuthContext.Provider>
  );
};

// Re-export the User type with the correct syntax for isolatedModules
export type { User } from '@/types/auth.types';
