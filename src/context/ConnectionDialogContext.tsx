
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Screen } from "@/types/screen";
import { useWidgetList } from "@/hooks/widgets/useWidgetList";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CreateScreenConnectionParams } from "@/types/connection";

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
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  
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
      // In a real implementation, fetch the screen data from Supabase
      supabase
        .from('screens')
        .select('*')
        .eq('id', currentScreenId)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error("Error fetching screen:", error);
            return;
          }
          
          if (data) {
            setCurrentScreen(data as Screen);
          }
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
  const handleExistingScreenConnect = async (selectedScreenId: string) => {
    if (!connectionValueContext) {
      console.warn("⚠️ No connection value context when trying to connect to screen");
      closeExistingScreenDialog();
      return;
    }
    
    if (!currentScreen) {
      console.warn("⚠️ No current screen data available when trying to connect");
      toast({
        title: "Connection Error",
        description: "No current screen data available. Please try again.",
        variant: "destructive"
      });
      closeExistingScreenDialog();
      return;
    }
    
    setIsConnecting(true);
    
    try {
      console.log("🔗 Global: Connecting to screen:", { 
        selectedScreenId,
        currentScreen,
        value: connectionValueContext.value,
        context: connectionValueContext.context,
        frameType: connectionValueContext.frameType
      });
      
      // Extract element ID if this is an element connection
      let elementRef = null;
      if (connectionValueContext.context?.startsWith('element_id_')) {
        elementRef = connectionValueContext.context.replace('element_id_', '');
      }
      
      // Get current screen's framework type values if available
      let propertyValues = null;
      if (currentScreen?.framework_id) {
        try {
          const { data: frameworkData } = await supabase
            .from('framework_types')
            .select('property_values')
            .eq('id', currentScreen.framework_id)
            .maybeSingle();
          
          if (frameworkData) {
            propertyValues = frameworkData.property_values;
          }
        } catch (e) {
          console.error("Error fetching framework data:", e);
        }
      }
      
      // Create connection record in database with the updated field mappings
      const connectionData: CreateScreenConnectionParams = {
        // The current screen is the source
        screen_ref: currentScreen.id,
        // The selected screen is the target/next screen
        nextScreen_Ref: selectedScreenId,
        // Current screen's properties
        widget_ref: currentScreen.widget_id || null,
        framework_type: currentScreen.framework_type || null,
        framework_type_ref: currentScreen.framework_id || null,
        is_screen_terminated: false,
        element_ref: elementRef,
        connection_context: connectionValueContext.context || null,
        source_value: String(connectionValueContext.value),
        screen_name: currentScreen.name,
        screen_description: currentScreen.description || null,
        property_values: propertyValues
      };
      
      console.log("💾 Storing connection data:", connectionData);
      
      const { data, error } = await supabase
        .from('connect_screens')
        .insert(connectionData)
        .select();
      
      if (error) {
        console.error("Error creating connection:", error);
        toast({
          title: "Connection Failed",
          description: "Failed to store connection in database",
          variant: "destructive"
        });
        return;
      }
      
      console.log("💾 Global: Stored connection in database:", data);
      
      toast({
        title: "Connection Established",
        description: `Connected "${currentScreen.name}" to "${selectedScreenId}"`,
      });
    } catch (error) {
      console.error("Error connecting to screen:", error);
      toast({
        title: "Connection Error",
        description: "Failed to establish connection",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
      // Close the dialog after successful connection
      closeExistingScreenDialog();
    }
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
