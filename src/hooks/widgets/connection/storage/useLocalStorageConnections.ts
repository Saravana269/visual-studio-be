
import { supabase } from "@/integrations/supabase/client";
import { CreateScreenConnectionParams } from "@/types/connection";

/**
 * Hook for storing connections in local storage
 */
export function useLocalStorageConnections() {
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
              element_ref: elementId,
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
    storeSelectedElement,
    storeSelectedCOE
  };
}
