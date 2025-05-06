
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActiveConnections } from "./ActiveConnections";
import { Screen } from "@/types/screen";
import { Badge } from "@/components/ui/badge";

interface ConnectionsPanelProps {
  currentScreen: Screen | null;
  widgetId?: string;
  onClose: () => void;
}

export function ConnectionsPanel({ currentScreen, widgetId, onClose }: ConnectionsPanelProps) {
  return (
    <div className="h-full overflow-hidden border border-gray-800 rounded-lg flex flex-col">
      {/* Fixed header */}
      <div className="bg-[#00FF00] p-4 border-b border-[#00FF00]/30">
        <div className="flex justify-between items-center">
          <h2 className="text-black text-lg font-medium">Screen Connections</h2>
          <button 
            onClick={onClose}
            className="text-black hover:bg-[#00FF00]/20 rounded-full p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Scrollable content area */}
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <Card className="bg-gray-900 border-gray-800 mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Current Screen</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-lg font-bold">{currentScreen?.name || "No screen selected"}</p>
              <p className="text-sm text-gray-400">{currentScreen?.description || "No description"}</p>
              {currentScreen?.framework_type && (
                <div className="mt-2">
                  <Badge className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#00FF00]/10 text-[#00FF00]">
                    {currentScreen.framework_type}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Active Connections</h3>
            <ActiveConnections 
              screenId={currentScreen?.id} 
              widgetId={widgetId} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
