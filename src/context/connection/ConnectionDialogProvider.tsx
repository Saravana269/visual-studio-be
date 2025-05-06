
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
  const { toast } = useToast();

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
      window.sessionStorage.setItem('connectionContext', JSON.stringify({ value, context, frameType: currentScreen?.framework_type }));
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
    
    if (!currentScreen) {
      toast({
        title: "Connection Error",
        description: "Current screen information not available",
        variant: "destructive"
      });
      return;
    }
    
    try {
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
      };
      
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
    }
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
