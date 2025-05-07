
import { useState } from "react";
import { Screen } from "@/types/screen";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ConnectionValueContext } from "@/types/connection";

export const useScreenConnectionOperations = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen | null>(null);
  const { toast } = useToast();

  // Fetch the current screen using its ID
  const fetchCurrentScreen = async (currentScreenId: string): Promise<Screen | null> => {
    console.log("🔍 Fetching current screen with ID:", currentScreenId);
    
    if (!currentScreenId) {
      console.warn("⚠️ No current screen ID provided");
      return null;
    }
    
    try {
      // Fetch the current screen using the ID
      const { data: screenData, error } = await supabase
        .from('screens')
        .select('*')
        .eq('id', currentScreenId)
        .single();
      
      if (error || !screenData) {
        throw new Error("Failed to fetch current screen data");
      }
      
      console.log("✅ Loaded current screen:", screenData);
      return screenData as Screen;
    } catch (error) {
      console.error("Error fetching current screen:", error);
      return null;
    }
  };

  // Handle connecting to an existing screen
  const handleExistingScreenConnect = async (
    selectedScreenId: string, 
    currentScreen: Screen | null, 
    connectionContext: ConnectionValueContext | null,
    onCloseDialog: () => void
  ) => {
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
      let connectionCtx: ConnectionValueContext | null = connectionContext;
      try {
        if (!connectionCtx) {
          const storedContext = window.sessionStorage.getItem('connectionContext');
          if (storedContext) {
            connectionCtx = JSON.parse(storedContext);
            console.log("📱 Retrieved connection context from session:", connectionCtx);
          }
        }
      } catch (e) {
        console.error("Error retrieving connection context:", e);
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
      onCloseDialog();
      
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

  return {
    isConnecting,
    currentScreen,
    setCurrentScreen,
    fetchCurrentScreen,
    handleExistingScreenConnect
  };
};
