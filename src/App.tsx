
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";
import Contact from "./pages/Contact";
import { AuthProvider } from "./contexts/AuthContext";
import MobilePage from "./pages/features/Mobile";
import DocumentDeliveryPage from "./pages/features/DocumentDelivery";
import MicrosoftTeamsPage from "./pages/features/MicrosoftTeams";
import RiskManagementPage from "./pages/features/RiskManagement";
import Welcome from "./pages/onboarding/Welcome";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import VideoUpload from './pages/admin/VideoUpload';
import ErrorBoundary from "./components/ErrorBoundary";
import Credits from "./pages/Credits";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorBoundary>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Router>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/features/mobile" element={<MobilePage />} />
                <Route path="/features/document-delivery" element={<DocumentDeliveryPage />} />
                <Route path="/features/microsoft-teams" element={<MicrosoftTeamsPage />} />
                <Route path="/features/risk-management" element={<RiskManagementPage />} />
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/credits" element={<Credits />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogPost />} />
                <Route path="/admin/videos" element={<VideoUpload />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </AuthProvider>
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
