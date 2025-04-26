import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
// Import your pages
import ElementsManager from "./pages/ElementsManager";
import COEManager from "./pages/COEManager";
import CoreSetManager from "./pages/CoreSetManager";
import WidgetManager from "./pages/WidgetManager";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

function handleSignOut() {
  // Implement your sign out logic here
  window.location.href = "/auth";
}

export default function App() {
  return (
    <Router>
      <div className="flex h-screen">
        <Sidebar onSignOut={handleSignOut} />
        <main className="flex-1 ml-16 bg-gray-950 p-6 overflow-y-auto">
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
    </Router>
  );
}
