
import { useState, useRef } from 'react';
import { User } from '@/types/auth.types';
import { useAuthState } from '@/hooks/useAuthState';
import { useLogin } from '@/hooks/auth/useLogin';
import { useSignup } from '@/hooks/auth/useSignup';
import { useSetupStatus } from '@/hooks/auth/useSetupStatus';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";

export const useAuthContext = () => {
  // State management hooks
  const { user, setUser, isLoading, setIsLoading, refreshSession } = useAuthState();
  
  // Auth service hooks
  const loginFn = useLogin();
  const signupFn = useSignup();
  const { checkSetupStatus, updateSetupStatus } = useSetupStatus(setUser);
  
  // Debug logging ref
  const debugLogRef = useRef(true);

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

  return {
    user,
    isLoading,
    login,
    signup,
    logout,
    checkSetupStatus,
    updateSetupStatus,
    refreshSession,
    debugLogRef
  };
};
