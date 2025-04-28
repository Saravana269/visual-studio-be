
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
import CoreSetManager from "./pages/CoreSetManager";
import WidgetManager from "./pages/WidgetManager";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // If not authenticated, only show auth page
  if (!session) {
    return (
      <Router>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </Router>
    );
  }

  // If authenticated, show Elements Manager as landing page
  return (
    <Router>
      <TooltipProvider>
        <div className="flex h-screen bg-black text-white">
          <Sidebar onSignOut={() => supabase.auth.signOut()} />
          
          <div className="flex-1 flex flex-col ml-[60px]">
            <AppHeader />
            
            <main className="flex-1 p-6 mt-16 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Navigate to="/elements" replace />} />
                <Route path="/elements" element={<ElementsManager />} />
                <Route path="/coe" element={<COEManager />} />
                <Route path="/core-set" element={<CoreSetManager />} />
                <Route path="/widgets" element={<WidgetManager />} />
                <Route path="/settings" element={<Settings />} />
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
