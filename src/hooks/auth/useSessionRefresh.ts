
import { useState, useRef, useCallback } from 'react';
import { supabase, clearAuthData } from '@/integrations/supabase/client';
import { User } from '@/types/auth.types';

export const useSessionRefresh = (
  updateUserState: (supabaseUser: any) => Promise<User | null>,
  setIsLoading: (isLoading: boolean) => void,
  setAuthError: (error: string | null) => void
) => {
  const refreshAttempts = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastRefreshedAt = useRef<number>(0);

  const refreshSession = useCallback(async () => {
    try {
      // Prevent too frequent refreshes
      const now = Date.now();
      if (now - lastRefreshedAt.current < 5000) {
        console.log('Skipping refresh - too soon since last refresh');
        return null;
      }
      lastRefreshedAt.current = now;
      
      if (refreshAttempts.current >= 3) {
        console.log('Too many refresh attempts, suggesting clearing storage');
        setAuthError('Session refresh failed after multiple attempts. Please try clearing storage.');
        setIsLoading(false);
        return null;
      }
      
      refreshAttempts.current += 1;
      setIsLoading(true);
      setAuthError(null);
      
      console.log(`Manually refreshing session (attempt ${refreshAttempts.current})`);
      
      // Cancel any existing requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Create a new abort controller
      abortControllerRef.current = new AbortController();
      
      // Add a timeout to prevent hanging
      const timeoutPromise = new Promise<{error: Error}>((_, reject) => {
        setTimeout(() => reject({error: new Error('Session refresh timeout')}), 5000);
      });
      
      // Try to force-refresh the session
      const refreshPromise = supabase.auth.refreshSession();
      
      // Race between the actual operation and the timeout
      let result;
      try {
        result = await Promise.race([refreshPromise, timeoutPromise]);
      } catch (error: any) {
        console.error('Session refresh timed out:', error.message);
        setAuthError('Session refresh timed out. Please try again or clear storage.');
        setIsLoading(false);
        return null;
      }
      
      if (result.error) {
        console.error('Error refreshing session:', result.error.message);
        
        // If we have a token error or refresh error, it's likely the token is invalid
        // or the refresh token has expired
        if (
          result.error.message.includes('JWT') || 
          result.error.message.includes('token') ||
          result.error.message.includes('refresh')
        ) {
          console.log('Token error detected, clearing auth data for fresh login');
          clearAuthData();
        }
        
        setAuthError(result.error.message);
        setIsLoading(false);
        return null;
      }
      
      if (result.data?.session?.user) {
        console.log('Session refreshed successfully');
        return await updateUserState(result.data.session.user);
      }
      
      console.log('No session found after refresh');
      setIsLoading(false);
      return null;
    } catch (error: any) {
      console.error('Session refresh error:', error.message);
      setAuthError(error.message);
      setIsLoading(false);
      return null;
    }
  }, [updateUserState, setIsLoading, setAuthError]);

  const resetRefreshState = () => {
    refreshAttempts.current = 0;
    lastRefreshedAt.current = 0;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  return {
    refreshSession,
    resetRefreshState,
    abortController: abortControllerRef
  };
};
