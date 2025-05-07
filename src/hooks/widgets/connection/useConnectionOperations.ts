
import { supabase } from "@/integrations/supabase/client";
import { useConnectionCore } from "./useConnectionCore";
import { useConnectionStorage } from "./useConnectionStorage";
import { useConnectionHandlers } from "./useConnectionHandlers";
import { ConnectionValueContext } from "@/types/connection";

/**
 * Hook that provides operations for connecting elements and frameworks
 */
export function useConnectionOperations(widgetId?: string) {
  // Get core state and utilities
  const { 
    setIsConnecting, 
    setIsExistingScreenDialogOpen, 
    setConnectionContext,
    toast 
  } = useConnectionCore(widgetId);
  
  // Get connection storage utilities
  const {
    storeElementScreenConnection,
    storeFrameworkScreenConnection,
    storeSelectedElement,
    storeSelectedCOE,
    isStoring
  } = useConnectionStorage();
  
  // Get option-specific handlers
  const {
    handleNewScreenForElement,
    handleExistingScreenForElement,
    handleConnectWidgetForElement,
    handleTerminateForElement,
    handleNewScreenForFramework,
    handleExistingScreenForFramework,
    handleConnectWidgetForFramework,
    handleTerminateForFramework
  } = useConnectionHandlers(widgetId);
  
  // Handle connection to existing screen
  const handleExistingScreenConnect = async (selectedScreenId: string) => {
    console.log("🔄 Existing screen selected for connection", { selectedScreenId });
    setIsConnecting(true);
    
    try {
      const connectionCtx = await fetchConnectionContext();
      
      if (!connectionCtx) {
        console.warn("⚠️ No connection context available when trying to connect to existing screen");
        return;
      }
      
      // Get current screen information from localStorage
      const currentScreenId = localStorage.getItem('current_screen_id');
      if (!currentScreenId) {
        throw new Error("Current screen ID not found in localStorage");
      }
      
      // Fetch current screen details
      const { data: currentScreen, error: screenError } = await supabase
        .from('screens')
        .select('*')
        .eq('id', currentScreenId)
        .single();
      
      if (screenError || !currentScreen) {
        throw new Error("Failed to fetch current screen details");
      }
      
      // Extract property values and source value
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
      
      // Check for selected combination in localStorage for Multiple Options
      const selectedCombination = localStorage.getItem('selected_combination_value');
      if (selectedCombination && 
          (connectionCtx.context === "Multiple Options" || 
           (propertyValues as any)?.contextType === "Multiple Options")) {
        
        // Add the selected combination to source value and property values
        sourceValue = selectedCombination;
        propertyValues = {
          ...propertyValues,
          selectedOptions: selectedCombination.split(', '),
          combinationString: selectedCombination
        };
      }
      
      if (connectionCtx.context?.startsWith('element_id_')) {
        const elementId = connectionCtx.context.replace('element_id_', '');
        
        // Create connection record in connect_screens table
        const connectionData = {
          nextScreen_Ref: selectedScreenId,
          framework_type: currentScreen.framework_type,
          widget_ref: currentScreen.widget_id,
          screen_ref: currentScreen.id,
          screen_name: currentScreen.name,
          screen_description: currentScreen.description,
          property_values: propertyValues, // Store only the selected value
          framework_type_ref: currentScreen.framework_id,
          element_ref: elementId,
          source_value: "element_connection",
          connection_context: connectionCtx.context
        };
        
        const { error } = await supabase
          .from('connect_screens')
          .insert(connectionData);
          
        if (error) {
          throw new Error(`Failed to create element connection: ${error.message}`);
        }
      } else {
        // For framework-level connections
        // Create connection record in connect_screens table
        const connectionData = {
          nextScreen_Ref: selectedScreenId,
          framework_type: connectionCtx.frameType || currentScreen.framework_type,
          widget_ref: currentScreen.widget_id,
          screen_ref: currentScreen.id,
          screen_name: currentScreen.name,
          screen_description: currentScreen.description,
          property_values: propertyValues, // Store only the selected value
          framework_type_ref: currentScreen.framework_id,
          source_value: sourceValue ? String(sourceValue) : null,
          connection_context: connectionCtx.context || null,
        };
        
        const { error } = await supabase
          .from('connect_screens')
          .insert(connectionData);
          
        if (error) {
          throw new Error(`Failed to create framework connection: ${error.message}`);
        }
      }
      
      // Clear state
      setConnectionContext(null);
      
      // Close dialog after connection
      setIsExistingScreenDialogOpen(false);
      
      toast({
        title: "Screen Connected",
        description: "Successfully connected to the selected screen",
      });
    } catch (error) {
      console.error("Error connecting to screen:", error);
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : "Failed to connect to selected screen",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };
  
  // Helper to fetch connection context (in a real app, this might fetch from state or API)
  const fetchConnectionContext = async (): Promise<ConnectionValueContext | null> => {
    // For this example, we're just returning the state directly
    // but in a real app you might need to fetch this from an API or other source
    return new Promise((resolve) => {
      const ctx = window.sessionStorage.getItem('connectionContext');
      
      if (ctx) {
        try {
          resolve(JSON.parse(ctx));
        } catch (e) {
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  };

  return {
    handleExistingScreenConnect,
    isConnecting: isStoring,
    handleNewScreenForElement,
    handleExistingScreenForElement,
    handleConnectWidgetForElement,
    handleTerminateForElement,
    handleNewScreenForFramework,
    handleExistingScreenForFramework,
    handleConnectWidgetForFramework,
    handleTerminateForFramework
  };
}
