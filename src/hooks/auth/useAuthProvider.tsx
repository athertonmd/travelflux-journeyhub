
import { useState, useEffect, useCallback } from 'react';
import { supabase, clearAuthData } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { User, AuthContextType } from '@/types/auth.types';
import { useUpdateUserState } from '@/hooks/auth/useUpdateUserState';
import { useAuthOperations } from '@/hooks/auth/useAuthOperations';
import { useSetupStatusUpdate } from '@/hooks/auth/useSetupStatusUpdate';

export const useAuthProvider = (): AuthContextType => {
  // State management
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);

  // Custom hooks
  const { updateUserState } = useUpdateUserState();
  const { signUp, signIn, signOut } = useAuthOperations(setIsLoading);
  const { updateSetupStatus } = useSetupStatusUpdate(user, setUser, setIsLoading);

  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error.message);
          setAuthError(error.message);
          return;
        }
        
        if (data.session?.user) {
          await updateUserState(data.session.user, setUser);
        }
        setSessionChecked(true);
      } catch (error: any) {
        console.error('Error checking session:', error);
        setAuthError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_OUT') {
          setUser(null);
          return;
        }
        
        if (session?.user) {
          await updateUserState(session.user, setUser);
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [updateUserState]);
  
  // Refresh session functionality
  const refreshSession = useCallback(async (): Promise<User | null> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Session refresh error:', error.message);
        setAuthError(error.message);
        setIsLoading(false);
        return null;
      }
      
      if (data.session?.user) {
        const userData = await updateUserState(data.session.user, setUser);
        setIsLoading(false);
        return userData;
      }
      
      setIsLoading(false);
      return null;
    } catch (error: any) {
      console.error('Error refreshing session:', error);
      setAuthError(error.message);
      setIsLoading(false);
      return null;
    }
  }, [updateUserState]);
  
  // Alias logIn and logOut for backward compatibility
  const logIn = useCallback(async (email: string, password: string): Promise<boolean> => {
    return signIn(email, password);
  }, [signIn]);
  
  const logOut = useCallback(async (): Promise<void> => {
    return signOut();
  }, [signOut]);

  return {
    user,
    isLoading,
    authError,
    signUp,
    signIn,
    signOut,
    logIn,
    logOut,
    updateSetupStatus,
    refreshSession,
    sessionChecked
  };
};
