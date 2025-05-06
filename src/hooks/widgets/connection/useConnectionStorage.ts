
// This file needs updates to use the proper types
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CreateScreenConnectionParams } from "@/types/connection";

export function useConnectionStorage() {
  const { toast } = useToast();
  const [isStoring, setIsStoring] = useState(false);

  // Store connection between an element and a screen
  const storeElementScreenConnection = async (elementId: string, screenId: string) => {
    setIsStoring(true);
    try {
      console.log("🔗 Storing connection between element", elementId, "and screen", screenId);
      
      // Get current screen data
      const { data: currentScreenData, error: screenError } = await supabase
        .from('screens')
        .select('*')
        .eq('id', localStorage.getItem('current_screen_id') || '')
        .maybeSingle();
        
      if (screenError) {
        throw new Error(`Error fetching current screen: ${screenError.message}`);
      }
      
      if (!currentScreenData) {
        throw new Error('No current screen found');
      }
      
      // Get property values for current screen
      let propertyValues = null;
      if (currentScreenData.framework_id) {
        const { data: frameworkData } = await supabase
          .from('framework_types')
          .select('property_values')
          .eq('id', currentScreenData.framework_id)
          .maybeSingle();
        
        if (frameworkData) {
          propertyValues = frameworkData.property_values;
        }
      }
      
      // Create the connection
      const connectionData: CreateScreenConnectionParams = {
        element_ref: elementId,
        screen_ref: currentScreenData.id,
        nextScreen_Ref: screenId,
        widget_ref: null,
        framework_type: null,
        framework_type_ref: null,
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

  // Store connection between a framework type and a screen
  const storeFrameworkScreenConnection = async (frameworkType: string, value: any, screenId: string) => {
    setIsStoring(true);
    try {
      console.log("🔗 Storing framework connection for", frameworkType, "to screen", screenId);
      
      // Get current screen data
      const { data: currentScreenData, error: screenError } = await supabase
        .from('screens')
        .select('*')
        .eq('id', localStorage.getItem('current_screen_id') || '')
        .maybeSingle();
        
      if (screenError) {
        throw new Error(`Error fetching current screen: ${screenError.message}`);
      }
      
      if (!currentScreenData) {
        throw new Error('No current screen found');
      }
      
      // Get property values for current screen
      let propertyValues = null;
      if (currentScreenData.framework_id) {
        const { data: frameworkData } = await supabase
          .from('framework_types')
          .select('property_values')
          .eq('id', currentScreenData.framework_id)
          .maybeSingle();
        
        if (frameworkData) {
          propertyValues = frameworkData.property_values;
        }
      }
      
      // Create the connection
      const connectionData: CreateScreenConnectionParams = {
        framework_type: frameworkType,
        screen_ref: currentScreenData.id,
        nextScreen_Ref: screenId,
        widget_ref: null,
        framework_type_ref: null,
        is_screen_terminated: false,
        element_ref: null,
        connection_context: frameworkType,
        source_value: String(value),
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
        description: `${frameworkType} connected to screen ${screenId}`,
      });
      
      return true;
    } catch (error) {
      console.error('Error storing framework-screen connection:', error);
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

  // Store selected element in local storage
  const storeSelectedElement = (elementId: string) => {
    try {
      localStorage.setItem('selected_element_id', elementId);
      
      // Also update the current screen data to include this element
      const currentScreenId = localStorage.getItem('current_screen_id');
      
      if (currentScreenId) {
        // Get current screen data
        supabase
          .from('screens')
          .select('*')
          .eq('id', currentScreenId)
          .maybeSingle()
          .then(({ data, error }) => {
            if (error || !data) return;
            
            // Create the connection for demo purposes
            const connectionData: CreateScreenConnectionParams = {
              screen_ref: data.id,
              nextScreen_Ref: null,
              widget_ref: data.widget_id,
              framework_type: null,
              framework_type_ref: null,
              is_screen_terminated: false,
              element_ref: null,
              connection_context: `element_id_${elementId}`,
              source_value: "element_selected",
              screen_name: data.name,
              screen_description: data.description,
              property_values: null
            };
            
            // Store in database
            supabase.from('connect_screens').insert(connectionData);
          });
      }
      
    } catch (error) {
      console.error('Error storing selected element ID:', error);
    }
  };

  // Store selected COE in local storage
  const storeSelectedCOE = (coeId: string) => {
    try {
      localStorage.setItem('selected_coe_id', coeId);
      
      // Also update the current screen data to include this COE
      const currentScreenId = localStorage.getItem('current_screen_id');
      
      if (currentScreenId) {
        // Get current screen data
        supabase
          .from('screens')
          .select('*')
          .eq('id', currentScreenId)
          .maybeSingle()
          .then(({ data, error }) => {
            if (error || !data) return;
            
            // Create the connection for demo purposes
            const connectionData: CreateScreenConnectionParams = {
              screen_ref: data.id,
              nextScreen_Ref: null,
              widget_ref: data.widget_id,
              framework_type: null,
              framework_type_ref: null,
              is_screen_terminated: false,
              element_ref: null,
              connection_context: "coe_id",
              source_value: coeId,
              screen_name: data.name,
              screen_description: data.description,
              property_values: null
            };
            
            // Store in database
            supabase.from('connect_screens').insert(connectionData);
          });
      }
      
    } catch (error) {
      console.error('Error storing selected COE ID:', error);
    }
  };

  return {
    storeElementScreenConnection,
    storeFrameworkScreenConnection,
    storeSelectedElement,
    storeSelectedCOE,
    isStoring
  };
}
