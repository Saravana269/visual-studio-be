import { useState, useEffect, ReactNode } from "react";
import { ConnectionDialogContext } from "./ConnectionDialogContext";
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
  const [selectedScreenId, setSelectedScreenId] = useState<string | null>(null);
  const [connectionValueContext, setConnectionValueContext] = useState<ConnectionValueContext | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  // Get screen connection utilities
  const { fetchCurrentScreen } = useScreenConnection(selectedScreenId);

  // Handle opening the existing screen dialog
  const openExistingScreenDialog = async (connectionContext: ConnectionValueContext) => {
    console.log("🖼️ Opening existing screen dialog with context:", connectionContext);
    
    // Store connection context information
    setConnectionValueContext(connectionContext);
    setSelectedScreenId(connectionContext.widgetId);
    
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
        
        // Store context in session storage for component communication
        try {
          window.sessionStorage.setItem('connectionContext', JSON.stringify({ 
            value: connectionContext.value, 
            context: connectionContext.context, 
            frameType: screen.framework_type,
            widgetId: connectionContext.widgetId,
            screenId: currentScreenId // Store the screenId explicitly
          }));
          console.log("💾 Stored connection context in session storage with screenId:", currentScreenId);
        } catch (e) {
          console.error("Error storing connection context in session storage:", e);
        }
        
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
    try {
      window.sessionStorage.removeItem('connectionContext');
    } catch (e) {
      console.error("Error removing connection context from session storage:", e);
    }
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
        console.log("📱 Fetched current screen for connection:", screenData);
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
      
      // Get connection context from session storage
      let connectionCtx: ConnectionValueContext | null = null;
      try {
        const storedContext = window.sessionStorage.getItem('connectionContext');
        if (storedContext) {
          connectionCtx = JSON.parse(storedContext);
          console.log("📱 Retrieved connection context from session:", connectionCtx);
        } else {
          // Fallback to the state if session storage is empty
          connectionCtx = connectionValueContext;
          console.log("⚠️ Using state connection context as fallback:", connectionCtx);
        }
      } catch (e) {
        console.error("Error retrieving connection context:", e);
        connectionCtx = connectionValueContext;
      }
      
      if (!connectionCtx) {
        throw new Error("Connection context not available");
      }
      
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
        source_value: connectionCtx?.value ? String(connectionCtx.value) : null,
        connection_context: connectionCtx?.context || null,
        element_ref: connectionCtx?.context?.startsWith('element_') ? 
          connectionCtx.context.replace('element_', '') : null
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
      {isExistingScreenDialogOpen && selectedScreenId && (
        <ExistingScreenDialog
          isOpen={isExistingScreenDialogOpen}
          onClose={closeExistingScreenDialog}
          onConnect={handleExistingScreenConnect}
          currentScreen={currentScreen}
          widgetId={selectedScreenId}
          isConnecting={isConnecting}
        />
      )}
    </ConnectionDialogContext.Provider>
  );
}
