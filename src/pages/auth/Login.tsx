
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoginPageContent from '@/components/auth/LoginPageContent';
import LoginErrorState from '@/components/auth/LoginErrorState';
import { useLoginPage } from '@/hooks/auth/useLoginPage';
import { useSessionManager } from '@/hooks/auth/useSessionManager';

const Login = () => {
  const {
    authLoading,
    isSubmitting,
    authStuck,
    refreshingSession,
    connectionRetries,
    handleSubmit,
    handleRefreshSession
  } = useLoginPage();
  
  const { resetSessionState } = useSessionManager();
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
    
    // Set up cleanup function for if the user navigates away
    return () => {
      // If we're in a stuck state when leaving, remember that for next time
      if (authStuck) {
        localStorage.setItem('auth_previously_stuck', 'true');
      }
    };
  }, [resetSessionState]);
  
  // Handle page reload
  const handleReloadPage = () => {
    window.location.reload();
  };

  // Show error state if auth is stuck
  if (authStuck) {
    return (
      <LoginErrorState
        isRefreshing={refreshingSession}
        refreshAttemptCount={connectionRetries}
        authStuck={authStuck}
        onRefreshSession={handleRefreshSession}
        onReloadPage={handleReloadPage}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <LoginPageContent 
        isLoading={authLoading || isSubmitting}
        onLogin={async (email, password, remember) => {
          const result = await handleSubmit(email, password);
          // Remember me functionality can be implemented here
          return result;
        }}
      />
      <Footer />
    </div>
  );
};

export default Login;
