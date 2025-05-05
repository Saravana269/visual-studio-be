
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Screen } from "@/types/screen";
import { CurrentScreenInfo } from "./components/CurrentScreenInfo";
import { ScreenSelectionList } from "./components/ScreenSelectionList";
import { ScreenPreviewSection } from "./components/ScreenPreviewSection";
import { useExistingScreensQuery } from "@/hooks/widgets/useExistingScreensQuery";
import { useSelectedScreenQuery } from "@/hooks/widgets/useSelectedScreenQuery";

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

  // Use custom hooks for data fetching
  const { screens, isLoading } = useExistingScreensQuery({ 
    widgetId, 
    currentScreenId: currentScreen?.id || null,
    enabled: isOpen
  });
  
  const { selectedScreen, isLoading: isLoadingSelectedScreen } = useSelectedScreenQuery({
    screenId: selectedScreenId
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
