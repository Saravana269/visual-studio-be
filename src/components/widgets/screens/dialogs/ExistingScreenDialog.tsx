
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Screen } from "@/types/screen";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CurrentScreenInfo } from "./components/CurrentScreenInfo";
import { ScreenSelectionList } from "./components/ScreenSelectionList";
import { ScreenPreviewSection } from "./components/ScreenPreviewSection";

interface ExistingScreenDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (screenId: string) => void;
  currentScreen: Screen | null;
  widgetId: string;
}

export function ExistingScreenDialog({
  isOpen,
  onClose,
  onConnect,
  currentScreen,
  widgetId
}: ExistingScreenDialogProps) {
  const [selectedScreenId, setSelectedScreenId] = useState<string | null>(null);

  // Fetch all screens for this widget
  const { data: screens = [], isLoading } = useQuery({
    queryKey: ["widget-screens-for-connection", widgetId],
    queryFn: async () => {
      if (!widgetId) return [];
      
      try {
        const { data, error } = await supabase
          .from("screens")
          .select("*")
          .eq("widget_id", widgetId)
          .order("created_at", { ascending: true });
        
        if (error) throw error;
        
        // Filter out the current screen
        return (data as Screen[]).filter(screen => 
          screen.id !== currentScreen?.id
        );
      } catch (error) {
        console.error("Error fetching screens:", error);
        return [];
      }
    },
    enabled: !!widgetId && isOpen
  });
  
  // Get details of the selected screen
  const { data: selectedScreen, isLoading: isLoadingSelectedScreen } = useQuery({
    queryKey: ["selected-screen-details", selectedScreenId],
    queryFn: async () => {
      if (!selectedScreenId) return null;
      
      try {
        const { data, error } = await supabase
          .from("screens")
          .select("*")
          .eq("id", selectedScreenId)
          .single();
        
        if (error) throw error;
        
        return data as Screen;
      } catch (error) {
        console.error("Error fetching selected screen:", error);
        return null;
      }
    },
    enabled: !!selectedScreenId
  });
  
  // Reset selection when dialog opens
  useEffect(() => {
    if (isOpen) {
      setSelectedScreenId(null);
    }
  }, [isOpen]);

  // Handle connection
  const handleConnect = () => {
    if (selectedScreenId) {
      onConnect(selectedScreenId);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] bg-black border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-lg">Connect to Existing Screen</DialogTitle>
        </DialogHeader>
        
        {/* Current Screen Info */}
        <CurrentScreenInfo currentScreen={currentScreen} />
        
        {/* Screen Selection */}
        <div className="border border-gray-800 rounded-md p-4 mb-4 bg-black/30">
          <h3 className="text-sm font-medium text-gray-200 mb-3">Select a Screen to Connect:</h3>
          
          <ScreenSelectionList 
            screens={screens}
            isLoading={isLoading}
            selectedScreenId={selectedScreenId}
            onSelectScreen={setSelectedScreenId}
          />
        </div>
        
        {/* Preview Section */}
        <ScreenPreviewSection 
          selectedScreenId={selectedScreenId}
          selectedScreen={selectedScreen}
          isLoading={isLoadingSelectedScreen}
        />
        
        <DialogFooter className="mt-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-gray-700"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConnect}
            disabled={!selectedScreenId}
            className="bg-[#00FF00] text-black hover:bg-[#00DD00]"
          >
            Connect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
