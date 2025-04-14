
import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import Dashboard from './pages/Dashboard';
import Welcome from './pages/onboarding/Welcome';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import NotFound from './pages/NotFound';
import Settings from './pages/Settings';
import Credits from './pages/Credits';
import Users from './pages/Users';
import TripLog from './pages/TripLog';
import Itineraries from './pages/Itineraries';
import Contact from './pages/Contact';
import MicrosoftTeams from './pages/features/MicrosoftTeams';
import RiskManagement from './pages/features/RiskManagement';
import DocumentDelivery from './pages/features/DocumentDelivery';
import Mobile from './pages/features/Mobile';
import VideoUpload from './pages/admin/VideoUpload';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';
import { useAuth } from './hooks/useAuth';
import LoginInitialLoading from './components/auth/LoginInitialLoading';

const AuthRoute = ({ element }: { element: React.ReactNode }) => {
  const { user, isLoading, sessionChecked } = useAuth();
  
  // Add debugging logs to trace the authentication state
  useEffect(() => {
    console.log('AuthRoute: Authentication state', { 
      hasUser: !!user,
      isLoading,
      sessionChecked,
      userDetails: user ? {
        id: user.id,
        email: user.email,
        setupCompleted: user.setupCompleted
      } : 'No user'
    });
  }, [user, isLoading, sessionChecked]);
  
  // If auth is still loading, show loading component
  if (isLoading || !sessionChecked) {
    console.log('AuthRoute: Still loading auth data, showing loading state');
    return <LoginInitialLoading />;
  }
  
  // If no user found, redirect to login
  if (!user) {
    console.log('AuthRoute: No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  // If user hasn't completed setup, redirect to welcome
  if (user && !user.setupCompleted) {
    console.log('AuthRoute: User found but setup not completed, redirecting to welcome');
    return <Navigate to="/welcome" replace />;
  }
  
  console.log('AuthRoute: User authenticated and setup completed, rendering requested page');
  return <>{element}</>;
};

function App() {
  // Add a global verification of auth provider availability
  useEffect(() => {
    try {
      // Just testing if the hook works at the App level
      const authCheck = useAuth();
      console.log('App: Auth provider successfully loaded', {
        userExists: !!authCheck.user,
        isLoading: authCheck.isLoading,
        sessionChecked: authCheck.sessionChecked
      });
    } catch (error) {
      console.error('App: Error accessing Auth provider', error);
    }
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={<LoginInitialLoading />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={
              <ErrorBoundary>
                <Login />
              </ErrorBoundary>
            } />
            <Route path="/signup" element={
              <ErrorBoundary>
                <SignUp />
              </ErrorBoundary>
            } />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/features/microsoft-teams" element={<MicrosoftTeams />} />
            <Route path="/features/risk-management" element={<RiskManagement />} />
            <Route path="/features/document-delivery" element={<DocumentDelivery />} />
            <Route path="/features/mobile" element={<Mobile />} />
            <Route path="/dashboard" element={<AuthRoute element={<Dashboard />} />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/settings" element={<AuthRoute element={<Settings />} />} />
            <Route path="/credits" element={<AuthRoute element={<Credits />} />} />
            <Route path="/users" element={<AuthRoute element={<Users />} />} />
            <Route path="/customers" element={<AuthRoute element={<Users />} />} />
            <Route path="/trip-log" element={<AuthRoute element={<TripLog />} />} />
            <Route path="/itineraries" element={<AuthRoute element={<Itineraries />} />} />
            <Route path="/admin/video-upload" element={<AuthRoute element={<VideoUpload />} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
