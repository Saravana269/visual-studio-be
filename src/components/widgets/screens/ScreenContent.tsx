
import { ScreenReviewPanel } from "./ScreenReviewPanel";
import { ScreenDefinePanel } from "./ScreenDefinePanel";
import { ScreenCarouselNav } from "./ScreenCarouselNav";
import { Screen, ScreenFormData } from "@/types/screen";
import { useEffect, useState } from "react";
import { ChooseScreenPanel } from "./choose/ChooseScreenPanel";
import { useConnectionDialogs } from "@/context/ConnectionDialogContext";

interface ScreenContentProps {
  screens: Screen[];
  activeScreen: Screen | null;
  activeScreenIndex: number;
  formData: ScreenFormData;
  setFormData: React.Dispatch<React.SetStateAction<ScreenFormData>>;
  onScreenSelect: (screenId: string) => void;
  onAddScreen: () => void;
  onUpdateScreen: (data: ScreenFormData) => void;
  onStepSave: (step: number, data: Partial<ScreenFormData>, createFramework?: boolean) => Promise<boolean>;
  isActionLoading: boolean;
}

export function ScreenContent({
  screens,
  activeScreen,
  activeScreenIndex,
  formData,
  setFormData,
  onScreenSelect,
  onAddScreen,
  onUpdateScreen,
  onStepSave,
  isActionLoading
}: ScreenContentProps) {
  // State to control whether the choose screen panel is visible
  const [isChooseScreenVisible, setIsChooseScreenVisible] = useState(false);
  
  // Get the connection dialogs context
  const { handleExistingScreenConnect, closeExistingScreenDialog } = useConnectionDialogs();
  
  // Store the current screen ID for connection dialogs
  useEffect(() => {
    if (activeScreen?.id) {
      console.log("💾 Storing current screen ID in localStorage:", activeScreen.id);
      try {
        localStorage.setItem('current_screen_id', activeScreen.id);
      } catch (e) {
        console.error("Error storing current screen ID:", e);
      }
    }
    
    // Listen for connection dialog events to show the choose screen panel
    const handleConnectionDialogOpen = () => setIsChooseScreenVisible(true);
    
    // Custom event for opening the connection panel
    window.addEventListener('openConnectionPanel', handleConnectionDialogOpen);
    
    return () => {
      window.removeEventListener('openConnectionPanel', handleConnectionDialogOpen);
    };
  }, [activeScreen?.id]);
  
  // Handle connecting to a screen
  const handleConnectToScreen = (screenId: string) => {
    handleExistingScreenConnect(screenId);
    setIsChooseScreenVisible(false);
  };
  
  // Handle closing the choose screen panel
  const handleCloseChooseScreen = () => {
    setIsChooseScreenVisible(false);
    closeExistingScreenDialog();
  };
  
  console.log("⚡ ScreenContent render state:", { 
    activeScreenId: activeScreen?.id,
    widgetId: activeScreen?.widget_id,
    isChooseScreenVisible
  });
  
  // Determine the panel layout based on whether choose screen is visible
  const panelLayout = isChooseScreenVisible ? "three-panel" : "two-panel";
  
  return (
    <div className="flex flex-col h-full">
      {/* Main content area with fixed height */}
      <div className="flex-1 flex overflow-x-auto">
        {/* Left panel - Review Panel - width depends on layout */}
        <div className={`${panelLayout === "two-panel" ? "w-1/2 min-w-[50%]" : "w-1/3 min-w-[33.3%]"} h-full overflow-hidden p-3`}>
          <ScreenReviewPanel screen={activeScreen} />
        </div>
        
        {/* Middle panel - Define Panel - width depends on layout */}
        <div className={`${panelLayout === "two-panel" ? "w-1/2 min-w-[50%]" : "w-1/3 min-w-[33.3%]"} h-full overflow-hidden p-3`}>
          <ScreenDefinePanel
            totalSteps={4}
            currentStep={activeScreenIndex}
            formData={formData}
            setFormData={setFormData}
            onSave={onUpdateScreen}
            onStepSave={onStepSave}
            isEditing={!!activeScreen}
            isLoading={isActionLoading}
            autosave={false}
          />
        </div>
        
        {/* Right panel - Choose Screen - only visible when needed */}
        {isChooseScreenVisible && (
          <div className="w-1/3 min-w-[33.3%] h-full overflow-hidden p-3">
            <ChooseScreenPanel
              currentScreen={activeScreen}
              widgetId={activeScreen?.widget_id}
              onScreenSelect={handleConnectToScreen}
              onClose={handleCloseChooseScreen}
            />
          </div>
        )}
      </div>

      {/* Bottom navigation - fixed at the bottom */}
      {screens.length > 0 && (
        <div className="mt-6 border-t border-gray-800 pt-4">
          <ScreenCarouselNav
            screens={screens}
            activeScreenId={activeScreen?.id || null}
            onScreenSelect={onScreenSelect}
            onAddScreen={onAddScreen}
          />
        </div>
      )}
    </div>
  );
}
