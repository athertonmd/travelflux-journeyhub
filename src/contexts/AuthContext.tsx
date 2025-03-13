
import React, { createContext, useContext, useEffect, useRef } from 'react';
import { AuthContextType } from '@/types/auth.types';
import { useAuthState } from '@/hooks/useAuthState';
import { useLogin } from '@/hooks/auth/useLogin';
import { useSignup } from '@/hooks/auth/useSignup';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { useSetupStatus } from '@/hooks/auth/useSetupStatus';

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
  // Get all the hooks first to maintain consistent order
  const { user, setUser, isLoading, setIsLoading, refreshSession } = useAuthState();
  const loginFn = useLogin();
  const signupFn = useSignup();
  const { checkSetupStatus, updateSetupStatus } = useSetupStatus(setUser);
  
  // Add debug logging ref to avoid hook ordering issues
  const debugLogRef = useRef(true);

  // Debug logging effect - make sure ALL hook calls are above this
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

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const user = await loginFn(email, password);
      
      // If login appears to succeed but we don't get a user, try refreshing session
      if (!user) {
        console.log('Login succeeded but no user returned, trying to refresh session');
        const refreshedUser = await refreshSession();
        return !!refreshedUser;
      }
      
      return !!user;
    } catch (error) {
      console.error('Login error in context:', error);
      return false;
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string, agencyName?: string): Promise<boolean> => {
    try {
      const user = await signupFn(name, email, password, agencyName);
      if (!user) {
        console.log('Signup succeeded but no user returned, trying to refresh session');
        const refreshedUser = await refreshSession();
        return !!refreshedUser;
      }
      return !!user;
    } catch (error) {
      console.error('Signup error in context:', error);
      return false;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: "An error occurred during logout.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
