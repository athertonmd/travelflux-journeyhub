
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSessionManager } from '@/hooks/auth/useSessionManager';
import { toast } from '@/hooks/use-toast';

export const useLoginPage = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, login, refreshSession: contextRefreshSession } = useAuth();
  const { resetSessionState } = useSessionManager();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [loginAttemptFailed, setLoginAttemptFailed] = useState(false);
  const [authStuck, setAuthStuck] = useState(false);
  const [refreshingSession, setRefreshingSession] = useState(false);
  const [refreshAttemptCount, setRefreshAttemptCount] = useState(0);
  
  console.log('Login page hook with auth state:', { 
    user: user ? { id: user.id, setupCompleted: user.setupCompleted } : null, 
    authLoading, 
    isSubmitting,
    redirecting,
    loginAttemptFailed,
    refreshingSession,
    refreshAttemptCount
  });
  
  // Timeout to detect if auth is stuck - shorter timeout than the core auth system
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (authLoading && !authStuck && !refreshingSession) {
      timeout = setTimeout(() => {
        console.log('Auth loading timeout reached, might be stuck');
        setAuthStuck(true);
      }, 3000); // 3 seconds timeout (shorter than the auth core timeout)
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [authLoading, authStuck, refreshingSession]);
  
  // Auto-refresh if auth gets stuck for too long
  useEffect(() => {
    let autoRefreshTimeout: NodeJS.Timeout;
    
    if (authStuck && !refreshingSession && refreshAttemptCount === 0) {
      autoRefreshTimeout = setTimeout(() => {
        console.log('Auto-triggering session refresh after auth stuck timeout');
        handleRefreshSession();
      }, 2000); // Auto-refresh after 2 seconds of being stuck
    }
    
    return () => {
      if (autoRefreshTimeout) clearTimeout(autoRefreshTimeout);
    };
  }, [authStuck, refreshingSession, refreshAttemptCount]);
  
  // Redirect if user is already logged in
  useEffect(() => {
    // Only redirect if we have a user AND auth loading has finished
    if (user && !authLoading && !redirecting) {
      const destination = user.setupCompleted ? '/dashboard' : '/welcome';
      console.log(`User authenticated (setupCompleted: ${user.setupCompleted}), redirecting to: ${destination}`);
      
      setRedirecting(true);
      
      // Small timeout to avoid race conditions
      setTimeout(() => {
        navigate(destination);
      }, 200);
    }
  }, [user, authLoading, navigate, redirecting]);
  
  const handleLogin = async (email: string, password: string, remember: boolean) => {
    if (isSubmitting) {
      console.log('Already processing login, skipping');
      return false;
    }
    
    try {
      setIsSubmitting(true);
      setLoginAttemptFailed(false);
      console.log('Attempting login for:', email);
      
      // Attempt login
      const success = await login(email, password);
      console.log('Login result:', success);
      
      if (!success) {
        setLoginAttemptFailed(true);
      }
      
      return success;
    } catch (error) {
      console.error('Login handler error:', error);
      setLoginAttemptFailed(true);
      return false;
    } finally {
      // Always reset submission state after a short delay
      setTimeout(() => {
        setIsSubmitting(false);
      }, 300); // Give time for auth state to update
    }
  };
  
  const handleRefreshSession = useCallback(async () => {
    if (refreshingSession) {
      console.log('Already refreshing session, skipping');
      return;
    }
    
    // Track refresh attempts
    setRefreshAttemptCount(prev => prev + 1);
    setRefreshingSession(true);
    
    toast({
      title: "Refreshing session",
      description: "Please wait while we refresh your session...",
    });
    
    try {
      console.log('Manually triggering session refresh');
      
      // Reset session state completely if we've tried standard refresh 
      // multiple times without success
      if (refreshAttemptCount >= 1 || authStuck) {
        console.log('Using aggressive session reset approach');
        await resetSessionState();
        
        // After reset, wait a moment
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Try refresh session through the context
      const user = await contextRefreshSession();
      console.log('Refresh session result:', user ? 'success' : 'failed');
      
      // Reset auth stuck state if successful
      if (user) {
        setAuthStuck(false);
        toast({
          title: "Session refreshed",
          description: "Your session has been refreshed successfully.",
        });
      } else {
        // Always reset the auth stuck state even if refresh failed
        // to allow the normal auth flow to continue
        setAuthStuck(false);
        
        toast({
          title: "Session refresh complete",
          description: "You can now try to log in again.",
        });
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
      // Always reset auth stuck state to allow normal login flow
      setAuthStuck(false);
      
      toast({
        title: "Session reset complete",
        description: "You can now try to log in again.",
      });
    } finally {
      // Always reset refreshing state after a delay
      setTimeout(() => {
        setRefreshingSession(false);
      }, 1000);
    }
  }, [refreshingSession, refreshAttemptCount, authStuck, contextRefreshSession, resetSessionState]);

  return {
    user,
    authLoading,
    isSubmitting,
    redirecting,
    loginAttemptFailed,
    authStuck,
    refreshingSession,
    refreshAttemptCount,
    handleLogin,
    handleRefreshSession
  };
};
