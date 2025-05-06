
import { ScreenReviewPanel } from "./ScreenReviewPanel";
import { ScreenDefinePanel } from "./ScreenDefinePanel";
import { ScreenCarouselNav } from "./ScreenCarouselNav";
import { Screen, ScreenFormData } from "@/types/screen";
import { useEffect, useState } from "react";
import { ChooseScreenPanel } from "./choose/ChooseScreenPanel";
import { useConnectionDialogs } from "@/context/ConnectionDialogContext";
import { ConnectionsPanel } from "./connections/ConnectionsPanel";

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
  // New state to track if we're in existing screen connection mode
  const [inConnectionMode, setInConnectionMode] = useState(false);
  // State to control whether the connections panel is visible
  const [isConnectionsPanelVisible, setIsConnectionsPanelVisible] = useState(false);
  
  // Get the connection dialogs context
  const { handleExistingScreenConnect, closeExistingScreenDialog } = useConnectionDialogs();
  
  // Store the current screen ID for connection dialogs
  useEffect(() => {
    if (activeScreen?.id) {
      console.log("💾 Storing current screen ID in localStorage:", activeScreen.id);
      try {
        localStorage.setItem('current_screen_id', activeScreen.id);
        // Also store widget_id to ensure we have both pieces of information available
        if (activeScreen.widget_id) {
          localStorage.setItem('current_widget_id', activeScreen.widget_id);
        }
      } catch (e) {
        console.error("Error storing current screen ID:", e);
      }
    }
    
    // Listen for connection dialog events to show the choose screen panel
    const handleConnectionDialogOpen = (event: CustomEvent) => {
      setIsChooseScreenVisible(true);
      // Check if we should enter connection mode
      if (event.detail?.connectionMode === "existingScreen") {
        setInConnectionMode(true);
      }
    };
    
    // Listen for connections panel events
    const handleConnectionsPanelOpen = () => {
      setIsConnectionsPanelVisible(true);
    };
    
    // Custom event for opening the connection panel
    window.addEventListener('openConnectionPanel', handleConnectionDialogOpen as EventListener);
    window.addEventListener('openConnectionsPanel', handleConnectionsPanelOpen);
    
    return () => {
      window.removeEventListener('openConnectionPanel', handleConnectionDialogOpen as EventListener);
      window.removeEventListener('openConnectionsPanel', handleConnectionsPanelOpen);
    };
  }, [activeScreen?.id, activeScreen?.widget_id]);
  
  // Handle connecting to a screen
  const handleConnectToScreen = (screenId: string) => {
    handleExistingScreenConnect(screenId);
    setIsChooseScreenVisible(false);
    setInConnectionMode(false);
  };
  
  // Handle closing the choose screen panel
  const handleCloseChooseScreen = () => {
    setIsChooseScreenVisible(false);
    setInConnectionMode(false);
    closeExistingScreenDialog();
  };
  
  // Handle closing the connections panel
  const handleCloseConnectionsPanel = () => {
    setIsConnectionsPanelVisible(false);
  };
  
  console.log("⚡ ScreenContent render state:", { 
    activeScreenId: activeScreen?.id,
    widgetId: activeScreen?.widget_id,
    isChooseScreenVisible,
    inConnectionMode,
    isConnectionsPanelVisible
  });
  
  // Determine the panel layout based on various conditions
  let panelLayout = "two-panel"; // default layout
  
  if (isChooseScreenVisible || isConnectionsPanelVisible) {
    if (inConnectionMode) {
      panelLayout = "connection-mode"; // Only Define Panel + Choose Screen/Connections
    } else {
      panelLayout = "three-panel"; // All three panels
    }
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Main content area with fixed height */}
      <div className="flex-1 flex overflow-x-auto">
        {/* Left panel - Review Panel - hidden in connection mode */}
        {panelLayout !== "connection-mode" && (
          <div className={`${panelLayout === "two-panel" ? "w-1/2 min-w-[50%]" : "w-1/3 min-w-[33.3%]"} h-full overflow-hidden p-3`}>
            <ScreenReviewPanel 
              screen={activeScreen}
              onShowConnections={() => setIsConnectionsPanelVisible(true)} 
            />
          </div>
        )}
        
        {/* Middle panel - Define Panel - width depends on layout */}
        <div className={`${
          panelLayout === "connection-mode" ? "w-1/2 min-w-[50%]" : 
          panelLayout === "two-panel" ? "w-1/2 min-w-[50%]" : 
          "w-1/3 min-w-[33.3%]"
        } h-full overflow-hidden p-3`}>
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
            screenId={activeScreen?.id}
          />
        </div>
        
        {/* Right panel - Choose Screen/Connections - only visible when needed */}
        {isChooseScreenVisible && (
          <div className={`${
            panelLayout === "connection-mode" ? "w-1/2 min-w-[50%]" : "w-1/3 min-w-[33.3%]"
          } h-full overflow-hidden p-3`}>
            <ChooseScreenPanel
              currentScreen={activeScreen}
              widgetId={activeScreen?.widget_id}
              onScreenSelect={handleConnectToScreen}
              onClose={handleCloseChooseScreen}
              isConnectionMode={inConnectionMode}
            />
          </div>
        )}
        
        {/* Right panel - Connections Panel - only visible when requested */}
        {isConnectionsPanelVisible && !isChooseScreenVisible && (
          <div className={`${
            panelLayout === "connection-mode" ? "w-1/2 min-w-[50%]" : "w-1/3 min-w-[33.3%]"
          } h-full overflow-hidden p-3`}>
            <ConnectionsPanel
              currentScreen={activeScreen}
              widgetId={activeScreen?.widget_id}
              onClose={handleCloseConnectionsPanel}
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
