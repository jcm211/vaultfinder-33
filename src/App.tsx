
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SearchProvider } from "./context/SearchContext";
import SystemLockScreen from "./components/SystemLockScreen";
import Index from "./pages/Index";
import Results from "./pages/Results";
import Admin from "./pages/Admin";
import FirewallConfig from "./pages/FirewallConfig";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// App wrapper with auth context
const AppWithAuth = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { systemLocked } = useAuth();

  useEffect(() => {
    // Simulate initial loading
    setTimeout(() => {
      setIsLoaded(true);
    }, 500);
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-primary/30 mb-4 animate-float"></div>
          <div className="h-2 w-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {systemLocked && <SystemLockScreen />}
      
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/results" element={<Results />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } />
          <Route path="/admin/firewall" element={
            <ProtectedRoute>
              <FirewallConfig />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SearchProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppWithAuth />
          </TooltipProvider>
        </SearchProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
