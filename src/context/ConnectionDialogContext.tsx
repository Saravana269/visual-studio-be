
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Screen } from "@/types/screen";
import { useWidgetList } from "@/hooks/widgets/useWidgetList";

// Define the context type
interface ConnectionDialogContextType {
  isExistingScreenDialogOpen: boolean;
  openExistingScreenDialog: (value: any, context?: string, widgetId?: string) => void;
  closeExistingScreenDialog: () => void;
  handleExistingScreenConnect: (selectedScreenId: string) => void;
}

// Create the context with a default value
const ConnectionDialogContext = createContext<ConnectionDialogContextType | undefined>(undefined);

// Types for our provider props
interface ConnectionDialogProviderProps {
  children: ReactNode;
}

// Connection value context to pass between dialogs
interface ConnectionValueContext {
  value: any;
  context?: string;
  frameType?: string;
  widgetId?: string;
}

export const ConnectionDialogProvider = ({ children }: ConnectionDialogProviderProps) => {
  // Dialog state
  const [isExistingScreenDialogOpen, setIsExistingScreenDialogOpen] = useState(false);
  
  // Connection value context
  const [connectionValueContext, setConnectionValueContext] = useState<ConnectionValueContext | null>(null);
  
  // Current screen for connection
  const [currentScreen, setCurrentScreen] = useState<Screen | null>(null);
  
  // Get widget list for global context
  const { widgets, isLoading: isLoadingWidgets } = useWidgetList();
  
  // Open the screen selection dialog - updated to work with panel-based approach
  const openExistingScreenDialog = (value: any, context?: string, widgetId?: string) => {
    console.log("🔍 Global: Opening existing screen dialog with:", { value, context, widgetId });
    
    // Set frameType from context if needed
    const frameType = context || "unknown";
    
    setConnectionValueContext({ value, context, frameType, widgetId });
    
    // Try to get current screen from localStorage
    const currentScreenId = localStorage.getItem('current_screen_id');
    console.log("📋 Global: Current screen ID from localStorage:", currentScreenId);
    
    // If we have a current screen ID, try to fetch the screen data
    if (currentScreenId) {
      // This would normally fetch from the database, but for now we'll just set the ID
      // In a real implementation, you would fetch the screen data from Supabase
      setCurrentScreen({
        id: currentScreenId,
        name: "Current Screen",
        widget_id: widgetId || "unknown",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    
    // Open the panel by setting dialog open and dispatching custom event
    console.log("🚪 Global: Setting dialog open to true");
    setIsExistingScreenDialogOpen(true);
    
    // Dispatch a custom event to notify components that need to show the panel
    window.dispatchEvent(new CustomEvent('openConnectionPanel'));
  };
  
  // Close the dialog
  const closeExistingScreenDialog = () => {
    console.log("🚪 Global: Closing dialog");
    setIsExistingScreenDialogOpen(false);
    setConnectionValueContext(null);
    setCurrentScreen(null);
  };
  
  // Handle connection to an existing screen
  const handleExistingScreenConnect = (selectedScreenId: string) => {
    if (!connectionValueContext) {
      console.warn("⚠️ No connection value context when trying to connect to screen");
      closeExistingScreenDialog();
      return;
    }
    
    console.log("🔗 Global: Connecting to screen:", { 
      screenId: selectedScreenId, 
      value: connectionValueContext.value,
      context: connectionValueContext.context,
      frameType: connectionValueContext.frameType
    });
    
    // Store the connection in localStorage for demo purposes
    const connectionKey = `connection_${Date.now()}`;
    const connectionData = {
      screenId: selectedScreenId,
      value: connectionValueContext.value,
      context: connectionValueContext.context,
      frameType: connectionValueContext.frameType,
      timestamp: Date.now()
    };
    
    try {
      localStorage.setItem(connectionKey, JSON.stringify(connectionData));
      console.log("💾 Global: Stored connection with key:", connectionKey);
    } catch (e) {
      console.error("Error storing connection:", e);
    }
    
    // Close the dialog after successful connection
    closeExistingScreenDialog();
  };
  
  const contextValue: ConnectionDialogContextType = {
    isExistingScreenDialogOpen,
    openExistingScreenDialog,
    closeExistingScreenDialog,
    handleExistingScreenConnect
  };
  
  return (
    <ConnectionDialogContext.Provider value={contextValue}>
      {children}
    </ConnectionDialogContext.Provider>
  );
};

// Custom hook to use the connection dialog context
export const useConnectionDialogs = () => {
  const context = useContext(ConnectionDialogContext);
  if (context === undefined) {
    throw new Error('useConnectionDialogs must be used within a ConnectionDialogProvider');
  }
  return context;
};
