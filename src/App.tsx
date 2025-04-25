
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AuthCallback from "./components/auth/AuthCallback";
import { AppLayout } from "./components/layout/AppLayout";
import ElementsManager from "./pages/ElementsManager";
import COEManager from "./pages/COEManager";
import CoreSetManager from "./pages/CoreSetManager";
import WidgetManager from "./pages/WidgetManager";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/elements" replace />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* Protected routes with sidebar layout */}
          <Route path="/elements" element={<AppLayout><ElementsManager /></AppLayout>} />
          <Route path="/coes" element={<AppLayout><COEManager /></AppLayout>} />
          <Route path="/core-sets" element={<AppLayout><CoreSetManager /></AppLayout>} />
          <Route path="/widgets" element={<AppLayout><WidgetManager /></AppLayout>} />
          <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
