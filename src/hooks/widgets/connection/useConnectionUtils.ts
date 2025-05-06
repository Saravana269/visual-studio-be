
import { supabase } from "@/integrations/supabase/client";
import { Screen } from "@/types/screen";

/**
 * Utility functions for connection operations
 */
export function useConnectionUtils() {
  // Get current screen data from Supabase
  const getCurrentScreenData = async (): Promise<Screen | null> => {
    const currentScreenId = localStorage.getItem('current_screen_id');
    
    if (!currentScreenId) {
      console.warn("No current screen ID found in localStorage");
      return null;
    }
    
    try {
      console.log("📊 Fetching current screen data for ID:", currentScreenId);
      const { data, error } = await supabase
        .from('screens')
        .select('*')
        .eq('id', currentScreenId)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching current screen:", error.message);
        throw error;
      }
      
      if (!data) {
        console.warn("No screen found with ID:", currentScreenId);
        return null;
      }
      
      console.log("📊 Current screen data:", data);
      return data;
    } catch (error) {
      console.error("Error in getCurrentScreenData:", error);
      return null;
    }
  };

  // Get property values for a framework
  const getPropertyValues = async (frameworkId: string | null | undefined) => {
    if (!frameworkId) {
      return null;
    }
    
    try {
      console.log("📊 Fetching property values for framework ID:", frameworkId);
      const { data, error } = await supabase
        .from('framework_types')
        .select('property_values')
        .eq('id', frameworkId)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching framework property values:", error.message);
        return null;
      }
      
      return data?.property_values || null;
    } catch (error) {
      console.error("Error in getPropertyValues:", error);
      return null;
    }
  };

  // Get screen by ID
  const getScreenById = async (screenId: string): Promise<Screen | null> => {
    try {
      const { data, error } = await supabase
        .from('screens')
        .select('*')
        .eq('id', screenId)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching screen:", error.message);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error("Error in getScreenById:", error);
      return null;
    }
  };

  return {
    getCurrentScreenData,
    getPropertyValues,
    getScreenById
  };
}
