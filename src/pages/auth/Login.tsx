
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoginPageContent from '@/components/auth/LoginPageContent';
import LoginErrorState from '@/components/auth/LoginErrorState';
import { useLoginPage } from '@/hooks/auth/useLoginPage';

const Login = () => {
  const {
    authLoading,
    isSubmitting,
    authStuck,
    refreshingSession,
    handleSubmit,
    handleRefreshSession
  } = useLoginPage();

  const [refreshAttemptCount, setRefreshAttemptCount] = React.useState(0);
  
  // Handle refresh session with attempt counting
  const handleRefresh = async () => {
    setRefreshAttemptCount(prev => prev + 1);
    await handleRefreshSession();
  };

  // Show error state if auth is stuck
  if (authStuck) {
    return (
      <LoginErrorState
        isRefreshing={refreshingSession}
        refreshAttemptCount={refreshAttemptCount}
        authStuck={authStuck}
        onRefreshSession={handleRefresh}
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
