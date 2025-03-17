
import React, { createContext, useContext, ReactNode } from 'react';
import { AuthContextType } from '@/types/auth.types';
import { useAuthProvider } from '@/hooks/auth/useAuthProvider';

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Use the hook that contains all the auth logic
  const authValues = useAuthProvider();
  
  return (
    <AuthContext.Provider value={authValues}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Re-export the User type with the correct syntax for isolatedModules
export type { User } from '@/types/auth.types';
