import { ScreenReviewPanel } from "./ScreenReviewPanel";
import { ScreenDefinePanel } from "./ScreenDefinePanel";
import { ScreenCarouselNav } from "./ScreenCarouselNav";
import { Screen, ScreenFormData } from "@/types/screen";
import { ExistingScreenDialog } from "./dialogs/ExistingScreenDialog";
import { useConnectionHandler } from "@/hooks/widgets/useConnectionHandler";
import { useEffect } from "react";

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
  }, [activeScreen?.id]);

  // Get connection handler for the dialog
  const { 
    isExistingScreenDialogOpen, 
    setIsExistingScreenDialogOpen,
    currentScreen,
    handleExistingScreenConnect
  } = useConnectionHandler(activeScreen?.widget_id);
  
  console.log("⚡ ScreenContent render state:", { 
    activeScreenId: activeScreen?.id,
    widgetId: activeScreen?.widget_id,
    isDialogOpen: isExistingScreenDialogOpen,
    hasCurrentScreen: !!currentScreen
  });
  
  return (
    <div className="flex flex-col h-full">
      {/* Main content area with fixed height */}
      <div className="flex-1 flex overflow-x-auto">
        {/* Left panel - Review Panel - exactly 50% width */}
        <div className="w-1/2 min-w-[50%] h-full overflow-hidden p-3">
          <ScreenReviewPanel screen={activeScreen} />
        </div>
        
        {/* Right panel - Define Panel - exactly 50% width */}
        <div className="w-1/2 min-w-[50%] h-full overflow-hidden p-3">
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

      {/* Existing Screen Selection Dialog - Show regardless of currentScreen state for debugging */}
      {isExistingScreenDialogOpen && activeScreen && (
        <>
          {console.log("🔄 Rendering ExistingScreenDialog with:", {
            currentScreen,
            widgetId: activeScreen.widget_id
          })}
          <ExistingScreenDialog
            isOpen={isExistingScreenDialogOpen}
            onClose={() => {
              console.log("🚪 Closing ExistingScreenDialog");
              setIsExistingScreenDialogOpen(false);
            }}
            onConnect={(screenId) => {
              console.log("🔗 Connecting to screen:", screenId);
              handleExistingScreenConnect(screenId);
            }}
            currentScreen={currentScreen || activeScreen}
            widgetId={activeScreen.widget_id}
          />
        </>
      )}
    </div>
  );
}
