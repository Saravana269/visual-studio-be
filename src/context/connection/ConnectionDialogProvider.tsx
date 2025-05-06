
import { useState, useEffect, ReactNode } from "react";
import { ConnectionDialogContext, ConnectionDialogContextType } from "./ConnectionDialogContext";
import { ExistingScreenDialog } from "@/components/widgets/screens/dialogs/ExistingScreenDialog";
import { Screen } from "@/types/screen";
import { useScreenConnection } from "@/hooks/widgets/connection/useScreenConnection";
import { ConnectionValueContext } from "@/types/connection";

interface ConnectionDialogProviderProps {
  children: ReactNode;
}

export function ConnectionDialogProvider({ children }: ConnectionDialogProviderProps) {
  // Dialog state
  const [isExistingScreenDialogOpen, setIsExistingScreenDialogOpen] = useState(false);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | undefined>(undefined);
  const [connectionValueContext, setConnectionValueContext] = useState<ConnectionValueContext | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen | null>(null);

  // Get screen connection utilities
  const { fetchCurrentScreen } = useScreenConnection(selectedWidgetId);

  // Handle opening the existing screen dialog
  const openExistingScreenDialog = (value: any, context?: string, widgetId?: string) => {
    console.log("🖼️ Opening existing screen dialog with context:", { value, context, widgetId });
    
    // Store connection context information
    setConnectionValueContext({ value, context, widgetId });
    setSelectedWidgetId(widgetId);
    
    // Try to fetch the current screen information
    const currentScreenId = localStorage.getItem('current_screen_id');
    if (currentScreenId) {
      fetchCurrentScreen(currentScreenId).then(screen => {
        if (screen) {
          setCurrentScreen(screen);
        }
      });
    }
    
    // Store context in session storage for component communication
    try {
      window.sessionStorage.setItem('connectionContext', JSON.stringify({ value, context }));
    } catch (e) {
      console.error("Error storing connection context in session storage:", e);
    }
    
    // Open the dialog
    setIsExistingScreenDialogOpen(true);
  };

  // Handle closing the dialog
  const closeExistingScreenDialog = () => {
    setIsExistingScreenDialogOpen(false);
    setConnectionValueContext(null);
  };

  // This function will be implementation in the consumer that uses this context
  const handleExistingScreenConnect = (selectedScreenId: string) => {
    // This is a placeholder - the actual implementation will be provided by the consumer
    console.log("Selected screen:", selectedScreenId);
    closeExistingScreenDialog();
  };

  // Context value
  const contextValue: ConnectionDialogContextType = {
    isExistingScreenDialogOpen,
    openExistingScreenDialog,
    closeExistingScreenDialog,
    handleExistingScreenConnect
  };

  // Clean up any session storage on unmount
  useEffect(() => {
    return () => {
      try {
        window.sessionStorage.removeItem('connectionContext');
      } catch (e) {
        console.error("Error removing connection context from session storage:", e);
      }
    };
  }, []);

  return (
    <ConnectionDialogContext.Provider value={contextValue}>
      {children}
      
      {/* Render the dialog */}
      {isExistingScreenDialogOpen && selectedWidgetId && (
        <ExistingScreenDialog
          isOpen={isExistingScreenDialogOpen}
          onClose={closeExistingScreenDialog}
          onConnect={handleExistingScreenConnect}
          currentScreen={currentScreen}
          widgetId={selectedWidgetId}
        />
      )}
    </ConnectionDialogContext.Provider>
  );
}
