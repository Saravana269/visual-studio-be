
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
      
      // Extract property values if passed in the value object
      let propertyValues = {};
      let sourceValue = connectionCtx.value;
      
      // Check if the value is an object containing value and propertyValues
      if (typeof connectionCtx.value === 'object' && connectionCtx.value !== null) {
        if (connectionCtx.value.value !== undefined) {
          sourceValue = connectionCtx.value.value;
          
          // Extract property values if present
          if (connectionCtx.value.propertyValues) {
            propertyValues = connectionCtx.value.propertyValues;
          }
        }
      }
      
      // If propertyValues exists directly in the connectionCtx, use that too
      if (connectionCtx.propertyValues) {
        propertyValues = {
          ...propertyValues,
          ...connectionCtx.propertyValues
        };
      }
      
      // Check for selected combination or individual option in localStorage
      const contextType = (propertyValues as any)?.contextType || connectionCtx.context;
      const selectedCombination = localStorage.getItem('selected_combination_value');
      const selectedOption = localStorage.getItem('selected_option_value');
      
      if (selectedCombination && contextType === "Multiple Options") {
        // Add the selected combination to source value and property values
        sourceValue = selectedCombination;
        propertyValues = {
          ...propertyValues,
          selectedOptions: selectedCombination.split(', '),
          combinationString: selectedCombination
        };
      }
      
      if (selectedOption && contextType === "Multiple Options - Individual") {
        // Handle individual options
        sourceValue = selectedOption;
        propertyValues = {
          ...propertyValues,
          selectedOption: selectedOption
        };
      }
      
      console.log("📦 Connection property values to insert:", propertyValues);
      
      // Prepare connection data - ONLY include the propertyValues, not merging with framework data
      const connectionData = {
        nextScreen_Ref: selectedScreenId,
        framework_type: contextType === "Multiple Options - Individual" 
          ? "Multiple Options - Individual" 
          : currentScreen.framework_type,
        widget_ref: currentScreen.widget_id,
        screen_ref: currentScreen.id,
        screen_name: currentScreen.name,
        screen_description: currentScreen.description,
        property_values: propertyValues, // Only include the selected values
        framework_type_ref: currentScreen.framework_id,
        source_value: sourceValue ? String(sourceValue) : null,
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
      
      // Clean up localStorage
      if (selectedCombination) {
        localStorage.removeItem('selected_combination_value');
      }
      
      if (selectedOption) {
        localStorage.removeItem('selected_option_value');
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
