
import React, { useState, useEffect } from "react";
import { Screen } from "@/types/screen";
import { useExistingScreensQuery } from "@/hooks/widgets/useExistingScreensQuery";
import { ScreenSelectionList } from "@/components/widgets/screens/dialogs/components/ScreenSelectionList";
import { ScreenPreviewSection } from "@/components/widgets/screens/dialogs/components/ScreenPreviewSection";
import { Button } from "@/components/ui/button";
import { useSelectedScreenQuery } from "@/hooks/widgets/useSelectedScreenQuery";
import { CurrentScreenInfo } from "../dialogs/components/CurrentScreenInfo";

interface ChooseScreenPanelProps {
  currentScreen: Screen | null;
  widgetId: string | undefined;
  onScreenSelect: (screenId: string) => void;
  onClose: () => void;
  isConnectionMode?: boolean;
}

export function ChooseScreenPanel({
  currentScreen,
  widgetId,
  onScreenSelect,
  onClose,
  isConnectionMode = false
}: ChooseScreenPanelProps) {
  const [selectedScreenId, setSelectedScreenId] = useState<string | null>(null);

  // Use custom hooks for data fetching
  const { screens, isLoading } = useExistingScreensQuery({ 
    widgetId: widgetId || '', 
    currentScreenId: currentScreen?.id || null,
    enabled: !!widgetId
  });
  
  const { selectedScreen, isLoading: isLoadingSelectedScreen } = useSelectedScreenQuery({
    screenId: selectedScreenId
  });

  // Handle connect button click
  const handleConnect = () => {
    if (selectedScreenId) {
      onScreenSelect(selectedScreenId);
    }
  };

  // Clear selection when the panel opens
  useEffect(() => {
    setSelectedScreenId(null);
  }, [isConnectionMode]);

  return (
    <div className="flex flex-col h-full border border-gray-800 rounded-lg overflow-hidden">
      {/* Fixed header */}
      <div className="bg-[#00FF00] p-4 border-b border-[#00FF00]/30">
        <h2 className="text-black text-lg font-medium">
          {isConnectionMode ? "Choose Existing Screen to Connect" : "Choose Screen"}
        </h2>
      </div>
      
      {/* Scrollable content area */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-4">
          {/* Current Screen */}
          <div className="border border-gray-800 rounded-md p-4 bg-black/30">
            <h3 className="text-sm font-medium text-gray-200 mb-3">Current Screen:</h3>
            <CurrentScreenInfo currentScreen={currentScreen} />
          </div>
          
          {/* Screen Selection */}
          <div className="border border-gray-800 rounded-md p-4 bg-black/30">
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
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-800">
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
          </div>
        </div>
      </div>
    </div>
  );
}
