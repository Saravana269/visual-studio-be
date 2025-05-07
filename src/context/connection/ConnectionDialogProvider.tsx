
import { useState, useEffect, ReactNode } from "react";
import { ConnectionDialogContext } from "./ConnectionDialogContext";
import { ConnectionValueContext } from "@/types/connection";
import { useToast } from "@/hooks/use-toast";
import { useScreenConnectionOperations } from "./hooks/useScreenConnectionOperations";
import { useConnectionStorage } from "./hooks/useConnectionStorage";
import { ConnectionDialogContent } from "./components/ConnectionDialogContent";

interface ConnectionDialogProviderProps {
  children: ReactNode;
}

export function ConnectionDialogProvider({ children }: ConnectionDialogProviderProps) {
  // Dialog state
  const [isExistingScreenDialogOpen, setIsExistingScreenDialogOpen] = useState(false);
  const [selectedScreenId, setSelectedScreenId] = useState<string | null>(null);
  const [connectionValueContext, setConnectionValueContext] = useState<ConnectionValueContext | null>(null);

  // Custom hooks
  const { toast } = useToast();
  const { 
    isConnecting, 
    currentScreen, 
    setCurrentScreen, 
    fetchCurrentScreen, 
    handleExistingScreenConnect 
  } = useScreenConnectionOperations();
  
  const { 
    storeConnectionContext, 
    clearConnectionContext 
  } = useConnectionStorage();

  // Handle opening the existing screen dialog
  const openExistingScreenDialog = async (connectionContext: ConnectionValueContext) => {
    console.log("🖼️ Opening existing screen dialog with context:", connectionContext);
    
    // Store connection context information
    setConnectionValueContext(connectionContext);
    setSelectedScreenId(connectionContext.widgetId);
    
    // Store context in session storage for component communication
    storeConnectionContext(connectionContext);
    
    // Try to fetch the current screen information - first from passed screenId, then from localStorage
    const currentScreenId = connectionContext.screenId || localStorage.getItem('current_screen_id');
    console.log("🔍 Fetching current screen with ID:", currentScreenId);
    
    if (!currentScreenId) {
      console.warn("⚠️ No current screen ID available from params or localStorage");
      toast({
        title: "Warning",
        description: "Current screen information not available",
        variant: "destructive"
      });
      return; // Don't open dialog if we don't have the current screen
    }
    
    try {
      // Fetch the current screen using the ID
      const screen = await fetchCurrentScreen(currentScreenId);
      
      if (screen) {
        console.log("✅ Loaded current screen:", screen);
        setCurrentScreen(screen);
        
        // Open the dialog
        setIsExistingScreenDialogOpen(true);
      } else {
        console.warn("⚠️ No screen data returned for ID:", currentScreenId);
        toast({
          title: "Warning",
          description: "Could not load current screen information",
          variant: "destructive"
        });
        return; // Don't open dialog if we couldn't fetch the screen
      }
    } catch (error) {
      console.error("Error fetching current screen:", error);
      toast({
        title: "Error",
        description: "Failed to load screen information",
        variant: "destructive"
      });
    }
  };

  // Handle closing the dialog
  const closeExistingScreenDialog = () => {
    setIsExistingScreenDialogOpen(false);
    setConnectionValueContext(null);
    
    // Also clean up session storage
    clearConnectionContext();
  };

  // Handle connecting to selected screen
  const connectToExistingScreen = (selectedScreenId: string) => {
    handleExistingScreenConnect(
      selectedScreenId, 
      currentScreen, 
      connectionValueContext, 
      closeExistingScreenDialog
    );
  };

  // Context value
  const contextValue = {
    isExistingScreenDialogOpen,
    setIsExistingScreenDialogOpen,
    selectedScreenId,
    setSelectedScreenId,
    connectionContext: connectionValueContext,
    setConnectionContext: setConnectionValueContext
  };

  // Clean up any session storage on unmount
  useEffect(() => {
    return () => {
      clearConnectionContext();
    };
  }, []);

  return (
    <ConnectionDialogContext.Provider value={contextValue}>
      {children}
      
      {/* Render the dialog using our new component */}
      <ConnectionDialogContent
        isOpen={isExistingScreenDialogOpen}
        onClose={closeExistingScreenDialog}
        onConnect={connectToExistingScreen}
        currentScreen={currentScreen}
        widgetId={selectedScreenId}
        isConnecting={isConnecting}
      />
    </ConnectionDialogContext.Provider>
  );
}
