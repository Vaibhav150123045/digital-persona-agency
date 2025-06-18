import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import GDPRBanner from "@/components/GDPRBanner";
import useGDPRConsent from "@/hooks/useGDPRConsent";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import DemoLanding from "./pages/DemoLanding";
import DemoOnboarding from "./pages/DemoOnboarding";
import DemoDashboard from "./pages/DemoDashboard";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import Blog from "./pages/Blog";
import HelpCenter from "./pages/HelpCenter";
import ContactPage from "./pages/ContactPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";
import AdminDashboardPage from "@/pages/AdminDashboard";
import CourseProviderDashboard from "@/pages/CourseProviderDashboard";

const queryClient = new QueryClient();

function App() {
  const { showBanner, acceptAll, rejectAll, updatePreferences, closeBanner } = useGDPRConsent();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-spais-purple-500 to-slate-900">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/dashboard" element={<Dashboard />} />
                {/* Demo Routes */}
                <Route path="/demo" element={<DemoLanding />} />
                <Route path="/demo-onboarding" element={<DemoOnboarding />} />
                <Route path="/demo-dashboard" element={<DemoDashboard />} />
                {/* Other Routes */}
                <Route path="/careers" element={<Careers />} />
                <Route path="/press" element={<Press />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/help" element={<HelpCenter />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/course-provider" element={<CourseProviderDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              
              {/* GDPR Banner */}
              {showBanner && (
                <GDPRBanner
                  onAccept={acceptAll}
                  onReject={rejectAll}
                  onUpdatePreferences={updatePreferences}
                  onClose={closeBanner}
                />
              )}
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
