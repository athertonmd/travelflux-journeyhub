
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoginPageContent from '@/components/auth/LoginPageContent';
import LoginErrorState from '@/components/auth/LoginErrorState';
import { useLoginPage } from '@/hooks/auth/useLoginPage';
import { useSessionReset } from '@/hooks/auth/useSessionReset';
import ErrorBoundary from '@/components/ErrorBoundary';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const {
    user,
    authLoading,
    isSubmitting,
    redirecting,
    authStuck,
    refreshingSession,
    connectionRetries,
    handleSubmit,
    handleRefreshSession,
    setAuthStuck,
    refreshSession
  } = useLoginPage();
  
  const { resetSessionState } = useSessionReset();
  const navigate = useNavigate();

  // Reset session state on component mount
  useEffect(() => {
    // If there was a previous stuck state, reset the session
    if (localStorage.getItem('auth_previously_stuck') === 'true') {
      console.log("Previous stuck state detected, resetting session");
      resetSessionState().then(() => {
        localStorage.removeItem('auth_previously_stuck');
      });
    }
    
    // Attempt an initial session refresh when mounting
    if (!user && !authLoading && !isSubmitting) {
      console.log("Login page mounted, trying initial refresh");
      refreshSession().catch(err => {
        console.error("Initial refresh error:", err);
      });
    }
    
    // Set up cleanup function for if the user navigates away
    return () => {
      // If we're in a stuck state when leaving, remember that for next time
      if (authStuck) {
        localStorage.setItem('auth_previously_stuck', 'true');
      }
    };
  }, [resetSessionState, authStuck, user, authLoading, isSubmitting, refreshSession]);
  
  // Navigate to dashboard if user logged in
  useEffect(() => {
    if (user && !authLoading && !redirecting) {
      console.log("User detected, redirecting to dashboard");
      setAuthStuck(false);
      navigate('/dashboard');
    }
  }, [user, authLoading, redirecting, navigate, setAuthStuck]);
  
  // Handle page reload
  const handleReloadPage = () => {
    localStorage.removeItem('auth_previously_stuck');
    window.location.reload();
  };

  // Handler for refresh session to adapt return type
  const handleRefreshSessionAdapter = async () => {
    try {
      const result = await handleRefreshSession();
      console.log("Refresh session result:", result);
      return result;
    } catch (error) {
      console.error("Error in refresh session adapter:", error);
      toast({
        title: "Session refresh failed",
        description: "Please try reloading the page instead.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Custom fallback for auth errors
  const authErrorFallback = (
    <LoginErrorState
      isRefreshing={refreshingSession}
      refreshAttemptCount={connectionRetries}
      authStuck={true}
      onRefreshSession={handleRefreshSessionAdapter}
      onReloadPage={handleReloadPage}
    />
  );

  // Show error state if auth is stuck
  if (authStuck) {
    return (
      <LoginErrorState
        isRefreshing={refreshingSession}
        refreshAttemptCount={connectionRetries}
        authStuck={authStuck}
        onRefreshSession={handleRefreshSessionAdapter}
        onReloadPage={handleReloadPage}
      />
    );
  }

  // Redirect to dashboard if authenticated
  if (user && !authLoading) {
    console.log("User is authenticated, redirecting to dashboard");
    navigate('/dashboard');
    return null;
  }

  return (
    <ErrorBoundary fallback={authErrorFallback}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <LoginPageContent 
          isLoading={authLoading || isSubmitting}
          onLogin={async (email, password, remember) => {
            try {
              console.log("Login attempt initiated for:", email);
              const result = await handleSubmit(email, password);
              
              if (result) {
                console.log("Login successful, navigation will be handled by hook");
              }
              
              return result;
            } catch (error) {
              console.error("Login error caught in component:", error);
              toast({
                title: "Login error",
                description: "An unexpected error occurred. Please try again.",
                variant: "destructive",
              });
              return false;
            }
          }}
        />
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default Login;
