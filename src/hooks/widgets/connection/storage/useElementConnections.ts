
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CreateScreenConnectionParams } from "@/types/connection";
import { useConnectionUtils } from "../useConnectionUtils";

/**
 * Hook for storing element-screen connections
 */
export function useElementConnections() {
  const { toast } = useToast();
  const [isStoring, setIsStoring] = useState(false);
  const { getCurrentScreenData, getPropertyValues } = useConnectionUtils();

  // Store connection between an element and a screen
  const storeElementScreenConnection = async (elementId: string, screenId: string) => {
    setIsStoring(true);
    try {
      console.log("🔗 Storing connection between element", elementId, "and screen", screenId);
      
      // Get current screen data
      const currentScreenData = await getCurrentScreenData();
      if (!currentScreenData) {
        throw new Error('No current screen data available');
      }
      
      // Get property values for current screen
      const propertyValues = await getPropertyValues(currentScreenData.framework_id);
      
      // Create the connection
      const connectionData: CreateScreenConnectionParams = {
        element_ref: elementId,
        screen_ref: currentScreenData.id,
        nextScreen_Ref: screenId,
        widget_ref: currentScreenData.widget_id || null,
        framework_type: currentScreenData.framework_type || null,
        framework_type_ref: currentScreenData.framework_id || null,
        is_screen_terminated: false,
        connection_context: `element_id_${elementId}`,
        source_value: "element_connection",
        screen_name: currentScreenData.name,
        screen_description: currentScreenData.description,
        property_values: propertyValues
      };
      
      const { error } = await supabase
        .from('connect_screens')
        .insert(connectionData);
      
      if (error) {
        throw new Error(`Error storing connection: ${error.message}`);
      }
      
      toast({
        title: "Connection Saved",
        description: `Element connected to screen ${screenId}`,
      });
      
      return true;
    } catch (error) {
      console.error('Error storing element-screen connection:', error);
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsStoring(false);
    }
  };

  return {
    storeElementScreenConnection,
    isStoring
  };
}
