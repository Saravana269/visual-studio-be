
import { useState, useEffect, ReactNode } from "react";
import { ConnectionDialogContext, ConnectionDialogContextType } from "./ConnectionDialogContext";
import { ExistingScreenDialog } from "@/components/widgets/screens/dialogs/ExistingScreenDialog";
import { Screen } from "@/types/screen";
import { useScreenConnection } from "@/hooks/widgets/connection/useScreenConnection";
import { ConnectionValueContext } from "@/types/connection";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ConnectionDialogProviderProps {
  children: ReactNode;
}

export function ConnectionDialogProvider({ children }: ConnectionDialogProviderProps) {
  // Dialog state
  const [isExistingScreenDialogOpen, setIsExistingScreenDialogOpen] = useState(false);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | undefined>(undefined);
  const [connectionValueContext, setConnectionValueContext] = useState<ConnectionValueContext | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  // Get screen connection utilities
  const { fetchCurrentScreen } = useScreenConnection(selectedWidgetId);

  // Handle opening the existing screen dialog
  const openExistingScreenDialog = async (value: any, context?: string, widgetId?: string) => {
    console.log("🖼️ Opening existing screen dialog with context:", { value, context, widgetId });
    
    // Store connection context information
    setConnectionValueContext({ value, context, widgetId });
    setSelectedWidgetId(widgetId);
    
    // Try to fetch the current screen information
    const currentScreenId = localStorage.getItem('current_screen_id');
    console.log("🔍 Fetching current screen with ID:", currentScreenId);
    
    if (currentScreenId) {
      try {
        const screen = await fetchCurrentScreen(currentScreenId);
        if (screen) {
          console.log("✅ Loaded current screen:", screen);
          setCurrentScreen(screen);
        } else {
          console.warn("⚠️ No screen data returned for ID:", currentScreenId);
          toast({
            title: "Warning",
            description: "Could not load current screen information",
            variant: "destructive"  // Changed from "warning" to "destructive"
          });
        }
      } catch (error) {
        console.error("Error fetching current screen:", error);
      }
    } else {
      console.warn("⚠️ No current screen ID available in localStorage");
      toast({
        title: "Warning",
        description: "Current screen information not available",
        variant: "destructive"  // Changed from "warning" to "destructive"
      });
      return; // Don't open dialog if we don't have the current screen
    }
    
    // Store context in session storage for component communication
    try {
      window.sessionStorage.setItem('connectionContext', JSON.stringify({ 
        value, 
        context, 
        frameType: currentScreen?.framework_type,
        widgetId
      }));
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

  // Handle connecting to an existing screen
  const handleExistingScreenConnect = async (selectedScreenId: string) => {
    console.log("🔗 Connecting to existing screen:", selectedScreenId);
    setIsConnecting(true);
    
    if (!currentScreen) {
      // Get current screen information if not already loaded
      const currentScreenId = localStorage.getItem('current_screen_id');
      if (!currentScreenId) {
        toast({
          title: "Connection Error",
          description: "Current screen information not available",
          variant: "destructive"
        });
        setIsConnecting(false);
        return;
      }
      
      try {
        const { data: screenData, error } = await supabase
          .from('screens')
          .select('*')
          .eq('id', currentScreenId)
          .single();
          
        if (error || !screenData) {
          throw new Error("Failed to fetch current screen details");
        }
        
        setCurrentScreen(screenData);
      } catch (error) {
        console.error("Error loading current screen:", error);
        toast({
          title: "Connection Error",
          description: "Could not load current screen information",
          variant: "destructive"
        });
        setIsConnecting(false);
        return;
      }
    }
    
    try {
      // Make sure we have current screen
      if (!currentScreen) {
        throw new Error("Current screen information not available");
      }
      
      // Get the framework type data to retrieve property values
      const { data: frameworkData } = await supabase
        .from('framework_types')
        .select('property_values, framework_Type')
        .eq('screen_id', currentScreen.id)
        .single();
      
      // Prepare connection data
      const connectionData = {
        nextScreen_Ref: selectedScreenId,
        framework_type: currentScreen.framework_type,
        widget_ref: currentScreen.widget_id,
        screen_ref: currentScreen.id,
        screen_name: currentScreen.name,
        screen_description: currentScreen.description,
        property_values: frameworkData?.property_values || {},
        framework_type_ref: currentScreen.framework_id,
        source_value: connectionValueContext?.value ? String(connectionValueContext.value) : null,
        connection_context: connectionValueContext?.context || null,
        element_ref: connectionValueContext?.context?.startsWith('element_id_') ? 
          connectionValueContext.context.replace('element_id_', '') : null
      };
      
      console.log("📦 Connection data to insert:", connectionData);
      
      // Insert the connection data into connect_screens table
      const { error } = await supabase
        .from('connect_screens')
        .insert(connectionData);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Connection created",
        description: "Screen connection has been successfully created",
      });
      
      // Close the dialog after success
      closeExistingScreenDialog();
      
    } catch (error: any) {
      console.error("Error creating connection:", error);
      toast({
        title: "Connection Error",
        description: error.message || "Failed to create connection",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // Context value
  const contextValue: ConnectionDialogContextType = {
    isExistingScreenDialogOpen,
    openExistingScreenDialog,
    closeExistingScreenDialog,
    handleExistingScreenConnect,
    isConnecting
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

  useEffect(() => {
    // Log when current screen changes for debugging
    if (currentScreen) {
      console.log("Current screen updated:", currentScreen);
    }
  }, [currentScreen]);

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
          isConnecting={isConnecting}
        />
      )}
    </ConnectionDialogContext.Provider>
  );
}
