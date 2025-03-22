import React from 'react';
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
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoginInitialLoading />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user && !user.setupCompleted) {
    return <Navigate to="/welcome" replace />;
  }
  
  return <>{element}</>;
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
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
          <Route path="/welcome" element={<AuthRoute element={<Welcome />} />} />
          <Route path="/settings" element={<AuthRoute element={<Settings />} />} />
          <Route path="/credits" element={<AuthRoute element={<Credits />} />} />
          <Route path="/users" element={<AuthRoute element={<Users />} />} />
          <Route path="/customers" element={<AuthRoute element={<Users />} />} />
          <Route path="/trip-log" element={<AuthRoute element={<TripLog />} />} />
          <Route path="/itineraries" element={<AuthRoute element={<Itineraries />} />} />
          <Route path="/admin/video-upload" element={<AuthRoute element={<VideoUpload />} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
