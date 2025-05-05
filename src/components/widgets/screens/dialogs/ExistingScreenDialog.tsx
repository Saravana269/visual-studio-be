
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Screen } from "@/types/screen";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
        <div className="border border-gray-800 rounded-md p-4 mb-4 bg-black/30">
          <h3 className="text-sm font-medium text-gray-200 mb-2">Current Screen</h3>
          <p className="text-sm font-bold mb-1">{currentScreen?.name || "Untitled Screen"}</p>
          <p className="text-xs text-gray-400">{currentScreen?.description || "No description"}</p>
        </div>
        
        {/* Screen Selection */}
        <div className="border border-gray-800 rounded-md p-4 mb-4 bg-black/30">
          <h3 className="text-sm font-medium text-gray-200 mb-3">Select a Screen to Connect:</h3>
          
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <p className="text-sm text-gray-400">Loading screens...</p>
            </div>
          ) : screens.length === 0 ? (
            <p className="text-sm text-gray-400 p-2">No other screens found for this widget.</p>
          ) : (
            <RadioGroup value={selectedScreenId || ""} onValueChange={setSelectedScreenId}>
              <div className="space-y-2 max-h-[180px] overflow-y-auto pr-2">
                {screens.map(screen => (
                  <div key={screen.id} className="flex items-start space-x-2 p-2 rounded hover:bg-gray-900">
                    <RadioGroupItem id={`screen-${screen.id}`} value={screen.id} />
                    <div className="flex-grow">
                      <Label htmlFor={`screen-${screen.id}`} className="font-medium text-sm">
                        {screen.name}
                      </Label>
                      <p className="text-xs text-gray-400">
                        {screen.framework_type || "No framework"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}
        </div>
        
        {/* Preview Section */}
        <div className="border border-gray-800 rounded-md p-4 bg-black/30">
          <h3 className="text-sm font-medium text-gray-200 mb-2">🔍 Preview</h3>
          
          {!selectedScreenId ? (
            <p className="text-xs text-gray-400">Select a screen to see preview</p>
          ) : isLoadingSelectedScreen ? (
            <p className="text-xs text-gray-400">Loading preview...</p>
          ) : selectedScreen ? (
            <div className="space-y-1">
              <div className="flex">
                <span className="text-xs font-medium text-gray-300 w-20">Name:</span>
                <span className="text-xs text-gray-300">{selectedScreen.name}</span>
              </div>
              <div className="flex">
                <span className="text-xs font-medium text-gray-300 w-20">Type:</span>
                <span className="text-xs text-gray-300">{selectedScreen.framework_type || "None"}</span>
              </div>
              {selectedScreen.metadata && (
                <div className="flex">
                  <span className="text-xs font-medium text-gray-300 w-20">Metadata:</span>
                  <span className="text-xs text-gray-300">
                    {renderMetadataPreview(selectedScreen.framework_type, selectedScreen.metadata)}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-400">Error loading preview</p>
          )}
        </div>
        
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

// Helper function to render metadata preview based on framework type
function renderMetadataPreview(frameworkType: string | null, metadata: Record<string, any>): string {
  if (!frameworkType || !metadata) return "No metadata";
  
  switch(frameworkType) {
    case "Multiple Options":
    case "Radio Button":
      return `Options: ${(metadata.options || []).join(", ")}`;
    case "Slider":
      return `Range: ${metadata.min || 0} to ${metadata.max || 100}`;
    case "Yes / No":
      return `Default: ${metadata.value === true ? "Yes" : "No"}`;
    case "Information":
      return metadata.text ? `Text available` : "No text";
    case "Image Upload":
      return metadata.image_url ? "Image set" : "No image";
    case "COE Manager":
      return metadata.coe_id ? `COE ID: ${metadata.coe_id}` : "No COE selected";
    default:
      return "Custom metadata";
  }
}
