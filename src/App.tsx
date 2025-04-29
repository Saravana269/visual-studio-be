
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { AppHeader } from "./components/layout/AppHeader";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { supabase } from "@/integrations/supabase/client";

// Import pages
import ElementsManager from "./pages/ElementsManager";
import COEManager from "./pages/COEManager";
import COEDetailView from "./components/coe/COEDetailView";
import CoreSetManager from "./pages/CoreSetManager";
import CoreSetAssignment from "./pages/CoreSetAssignment"; // Import the new page
import WidgetManager from "./pages/WidgetManager";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import AuthCallback from "./components/auth/AuthCallback";
import { User } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        setIsLoading(false);
        setIsAuthInitialized(true);
      }
    );

    // Then check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
        setIsAuthInitialized(true);
      }
    };

    checkSession();

    return () => subscription.unsubscribe();
  }, []);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // If not authenticated, only show auth page
  if (!user && isAuthInitialized) {
    return (
      <Router>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
        <Toaster />
      </Router>
    );
  }

  // If authenticated, show main application with proper layout
  return (
    <Router>
      <TooltipProvider>
        <div className="flex h-screen bg-black text-white">
          <Sidebar onSignOut={() => supabase.auth.signOut()} />
          
          <div className="flex-1 flex flex-col ml-16">
            <AppHeader />
            
            <main className="flex-1 p-6 mt-16 overflow-y-auto">
              <Routes>
                {/* Redirect root path to elements */}
                <Route path="/" element={<Navigate to="/elements" replace />} />
                
                {/* Main application routes */}
                <Route path="/elements" element={<ElementsManager />} />
                <Route path="/coe" element={<COEManager />} />
                <Route path="/coe/:id" element={<COEDetailView />} />
                <Route path="/core-set" element={<CoreSetManager />} />
                <Route path="/core-set/:id/assignment" element={<CoreSetAssignment />} /> {/* Add new route */}
                <Route path="/widgets" element={<WidgetManager />} />
                <Route path="/settings" element={<Settings />} />
                
                {/* Auth routes redirect to elements if already authenticated */}
                <Route path="/auth" element={<Navigate to="/elements" replace />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                
                {/* Catch all for unknown routes */}
                <Route path="*" element={<Navigate to="/elements" replace />} />
              </Routes>
            </main>
          </div>
          
          <Toaster />
        </div>
      </TooltipProvider>
    </Router>
  );
}

export default App;
