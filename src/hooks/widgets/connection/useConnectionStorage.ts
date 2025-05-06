
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CreateScreenConnectionParams, ScreenConnection } from "@/types/connection";

/**
 * Hook to handle storing connection data between screens and elements
 */
export const useConnectionStorage = () => {
  const { toast } = useToast();
  const [isStoring, setIsStoring] = useState(false);

  // Store connection in Supabase
  const storeConnection = async (connectionData: CreateScreenConnectionParams): Promise<boolean> => {
    setIsStoring(true);
    try {
      const { data, error } = await supabase
        .from('connect_screens')
        .insert(connectionData)
        .select()
        .single();
      
      if (error) {
        console.error("Error storing connection data:", error);
        toast({
          title: "Connection Error",
          description: "Failed to store connection data",
          variant: "destructive",
        });
        return false;
      }
      
      console.log("🔗 Connection stored successfully:", data);
      return true;
    } catch (e) {
      console.error("Error storing connection data:", e);
      return false;
    } finally {
      setIsStoring(false);
    }
  };
  
  // Store element connection to screen
  const storeElementScreenConnection = async (elementId: string, screenId: string): Promise<boolean> => {
    const connectionData: CreateScreenConnectionParams = {
      element_ref: elementId,
      screen_ref: screenId,
      widget_ref: null,
      framework_type: null,
      framework_type_ref: null,
      is_screen_terminated: false,
      previous_connected_screen_ref: null,
      next_connected_screen_ref: null,
      coe_ref: null,
      connection_context: `element_connection_${elementId}`,
      source_value: elementId
    };
    
    const success = await storeConnection(connectionData);
    
    if (success) {
      toast({
        title: "Connection Established",
        description: `Connected element to screen "${screenId}"`,
      });
    }
    
    return success;
  };
  
  // Store framework connection to screen
  const storeFrameworkScreenConnection = async (
    frameworkType: string, 
    value: any, 
    screenId: string
  ): Promise<boolean> => {
    const connectionData: CreateScreenConnectionParams = {
      framework_type: frameworkType,
      screen_ref: screenId,
      widget_ref: null,
      framework_type_ref: null,
      is_screen_terminated: false,
      previous_connected_screen_ref: null,
      next_connected_screen_ref: null,
      coe_ref: null,
      element_ref: null,
      connection_context: `framework_connection_${frameworkType}`,
      source_value: String(value)
    };
    
    const success = await storeConnection(connectionData);
    
    if (success) {
      toast({
        title: "Connection Established",
        description: `Connected ${frameworkType} to screen "${screenId}"`,
      });
    }
    
    return success;
  };
  
  // Store connection info for new screen
  const storeNewScreenConnectionInfo = async (
    screenId: string, 
    connectionData: string, 
    widgetId?: string
  ): Promise<boolean> => {
    const data: CreateScreenConnectionParams = {
      screen_ref: screenId,
      widget_ref: widgetId || null,
      framework_type: null,
      framework_type_ref: null,
      is_screen_terminated: false,
      previous_connected_screen_ref: null,
      next_connected_screen_ref: null,
      coe_ref: null,
      element_ref: null,
      connection_context: "new_screen_connection",
      source_value: connectionData
    };
    
    return await storeConnection(data);
  };
  
  // Store framework info for new screen
  const storeFrameworkConnectionInfo = async (
    screenId: string, 
    frameworkType: string, 
    widgetId?: string
  ): Promise<boolean> => {
    const data: CreateScreenConnectionParams = {
      screen_ref: screenId,
      widget_ref: widgetId || null,
      framework_type: frameworkType,
      framework_type_ref: null,
      is_screen_terminated: false,
      previous_connected_screen_ref: null,
      next_connected_screen_ref: null,
      coe_ref: null,
      element_ref: null,
      connection_context: "framework_connection",
      source_value: frameworkType
    };
    
    return await storeConnection(data);
  };
  
  // Get connections for a screen
  const getConnectionsForScreen = async (screenId: string): Promise<ScreenConnection[]> => {
    try {
      const { data, error } = await supabase
        .from('connect_screens')
        .select('*')
        .eq('screen_ref', screenId);
        
      if (error) {
        console.error("Error fetching connections:", error);
        return [];
      }
      
      return data as ScreenConnection[];
    } catch (e) {
      console.error("Error fetching connections:", e);
      return [];
    }
  };
  
  // Get connections for an element
  const getConnectionsForElement = async (elementId: string): Promise<ScreenConnection[]> => {
    try {
      const { data, error } = await supabase
        .from('connect_screens')
        .select('*')
        .eq('element_ref', elementId);
        
      if (error) {
        console.error("Error fetching element connections:", error);
        return [];
      }
      
      return data as ScreenConnection[];
    } catch (e) {
      console.error("Error fetching element connections:", e);
      return [];
    }
  };
  
  // Store selected element for screen (for demo purposes - legacy)
  const storeSelectedElement = (elementId: string) => {
    try {
      localStorage.setItem("selected_element_for_screen", elementId);
      return true;
    } catch (e) {
      console.error("Error storing selected element:", e);
      return false;
    }
  };
  
  // Store selected COE for screen (for demo purposes - legacy)
  const storeSelectedCOE = (coeId: string) => {
    try {
      localStorage.setItem("selected_coe_for_screen", coeId);
      return true;
    } catch (e) {
      console.error("Error storing selected COE:", e);
      return false;
    }
  };

  return {
    storeElementScreenConnection,
    storeFrameworkScreenConnection,
    storeNewScreenConnectionInfo,
    storeFrameworkConnectionInfo,
    getConnectionsForScreen,
    getConnectionsForElement,
    storeSelectedElement,
    storeSelectedCOE,
    isStoring
  };
};
