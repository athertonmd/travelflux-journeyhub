
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
import Mobile from "./pages/features/Mobile";
import DocumentDelivery from "./pages/features/DocumentDelivery";
import MicrosoftTeams from "./pages/features/MicrosoftTeams";
import TravelRisk from "./pages/features/TravelRisk";
import { AuthProvider } from "./contexts/AuthContext";

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
            
            {/* Feature Pages */}
            <Route path="/features/mobile" element={<Mobile />} />
            <Route path="/features/document-delivery" element={<DocumentDelivery />} />
            <Route path="/features/microsoft-teams" element={<MicrosoftTeams />} />
            <Route path="/features/travel-risk" element={<TravelRisk />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
