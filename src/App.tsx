
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/users" element={<Users />} />
          <Route path="/trip-log" element={<TripLog />} />
          <Route path="/itineraries" element={<Itineraries />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/features/microsoft-teams" element={<MicrosoftTeams />} />
          <Route path="/features/risk-management" element={<RiskManagement />} />
          <Route path="/features/document-delivery" element={<DocumentDelivery />} />
          <Route path="/features/mobile" element={<Mobile />} />
          <Route path="/admin/video-upload" element={<VideoUpload />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
