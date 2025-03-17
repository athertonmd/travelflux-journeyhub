
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import RequireAuth from '@/components/auth/RequireAuth';

// Pages
import Index from '@/pages/Index';
import Login from '@/pages/auth/Login';
import SignUp from '@/pages/auth/SignUp';
import Dashboard from '@/pages/Dashboard';
import Welcome from '@/pages/onboarding/Welcome';
import NotFound from '@/pages/NotFound';
import Credits from '@/pages/Credits';
import Settings from '@/pages/Settings';
import Users from '@/pages/Users';
import Itineraries from '@/pages/Itineraries';
import TripLog from '@/pages/TripLog';
import Contact from '@/pages/Contact';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import MicrosoftTeams from '@/pages/features/MicrosoftTeams';
import RiskManagement from '@/pages/features/RiskManagement';
import Mobile from '@/pages/features/Mobile';
import DocumentDelivery from '@/pages/features/DocumentDelivery';
import VideoUpload from '@/pages/admin/VideoUpload';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          
          {/* Feature Pages */}
          <Route path="/features/microsoft-teams" element={<MicrosoftTeams />} />
          <Route path="/features/risk-management" element={<RiskManagement />} />
          <Route path="/features/mobile" element={<Mobile />} />
          <Route path="/features/document-delivery" element={<DocumentDelivery />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/welcome" element={<RequireAuth><Welcome /></RequireAuth>} />
          <Route path="/credits" element={<RequireAuth><Credits /></RequireAuth>} />
          <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
          <Route path="/users" element={<RequireAuth><Users /></RequireAuth>} />
          <Route path="/itineraries" element={<RequireAuth><Itineraries /></RequireAuth>} />
          <Route path="/trip-log" element={<RequireAuth><TripLog /></RequireAuth>} />
          <Route path="/admin/video-upload" element={<RequireAuth><VideoUpload /></RequireAuth>} />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
