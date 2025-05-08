
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScreenConnection } from "@/types/connection";
import { useEffect } from "react";

/**
 * Hook to fetch and manage connections for options (radio buttons, multiple options, etc.)
 */
export function useOptionConnections(screenId?: string, frameworkType?: string) {
  // Fetch all connections for this screen
  const { data: connections = [], isLoading } = useQuery({
    queryKey: ["screen-connections", screenId, frameworkType],
    queryFn: async () => {
      if (!screenId) return [];
      
      try {
        console.log(`🔍 Fetching connections for screen: ${screenId} and framework: ${frameworkType}`);
        
        const query = supabase
          .from('connect_screens')
          .select('*')
          .eq('screen_ref', screenId)
          .eq('is_screen_terminated', false);
          
        // Add framework type filter if provided
        if (frameworkType) {
          // Use a like query to match both "Multiple Options" and "Multiple Options - Individual"
          if (frameworkType === "Multiple Options") {
            query.like('framework_type', `${frameworkType}%`);
          } else {
            query.eq('framework_type', frameworkType);
          }
        }
        
        const { data, error } = await query;
          
        if (error) {
          console.error("Error fetching connections:", error);
          throw error;
        }
        
        console.log(`🔍 Found ${data?.length || 0} connections for screen: ${screenId}`);
        return data as ScreenConnection[];
      } catch (error) {
        console.error("Error in useOptionConnections:", error);
        return [];
      }
    },
    enabled: !!screenId,
    staleTime: 30000 // Cache results for 30 seconds
  });
  
  // Clear any selected options when the component unmounts or when screenId changes
  useEffect(() => {
    return () => {
      // Clear selections on component unmount or screenId change
      localStorage.removeItem('selected_option_value');
      localStorage.removeItem('selected_combination_value');
    };
  }, [screenId]);
  
  // Process connections to create a map of option -> connection
  const getConnectionMap = () => {
    const connectionMap = new Map<string, ScreenConnection>();
    
    connections.forEach(connection => {
      if (connection.source_value) {
        connectionMap.set(connection.source_value, connection);
      }
    });
    
    return connectionMap;
  };
  
  // Check if an option is connected
  const isOptionConnected = (option: string): boolean => {
    const connectionMap = getConnectionMap();
    return connectionMap.has(option);
  };
  
  // Check if a framework is connected
  const isFrameworkConnected = (frameworkType: string): boolean => {
    return connections.some(conn => 
      conn.framework_type === frameworkType && 
      !conn.is_screen_terminated
    );
  };
  
  // Get connection for an option
  const getConnectionForOption = (option: string): ScreenConnection | null => {
    const connectionMap = getConnectionMap();
    return connectionMap.get(option) || null;
  };

  // Clear selected values
  const clearSelectedValues = () => {
    localStorage.removeItem('selected_option_value');
    localStorage.removeItem('selected_combination_value');
  };

  return {
    connections,
    isLoading,
    isOptionConnected,
    isFrameworkConnected,
    getConnectionForOption,
    clearSelectedValues
  };
}
