
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { AppHeader } from "./components/layout/AppHeader";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";

// Import pages
import ElementsManager from "./pages/ElementsManager";
import COEManager from "./pages/COEManager";
import CoreSetManager from "./pages/CoreSetManager";
import WidgetManager from "./pages/WidgetManager";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import "./App.css";

function handleSignOut() {
  // Implement your sign out logic here
  window.location.href = "/auth";
}

export default function App() {
  return (
    <Router>
      <TooltipProvider>
        <div className="flex h-screen bg-black text-white">
          <Sidebar onSignOut={handleSignOut} />
          
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
                <Route path="/auth" element={<Auth />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
          
          <Toaster />
        </div>
      </TooltipProvider>
    </Router>
  );
}
