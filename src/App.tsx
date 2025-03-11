
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
