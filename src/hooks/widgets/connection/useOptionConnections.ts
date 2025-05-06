
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScreenConnection } from "@/types/connection";

interface UseOptionConnectionsProps {
  screenId?: string;
  frameworkType?: string;
}

/**
 * Hook to fetch and manage connections for options (radio buttons, multiple options, etc.)
 */
export function useOptionConnections(screenId?: string, frameworkType?: string) {
  // Fetch all connections for this screen
  const { data: connections = [], isLoading } = useQuery({
    queryKey: ["screen-connections", screenId],
    queryFn: async () => {
      if (!screenId) return [];
      
      try {
        console.log(`🔍 Fetching connections for screen: ${screenId} and framework: ${frameworkType}`);
        const { data, error } = await supabase
          .from('connect_screens')
          .select('*')
          .eq('screen_ref', screenId);
          
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
    enabled: !!screenId
  });
  
  // Process connections to create a map of option -> connection
  const getConnectionMap = () => {
    const connectionMap = new Map<string, ScreenConnection>();
    
    connections.forEach(connection => {
      if (connection.source_value) {
        // Handle array values that may be stored as strings
        try {
          if (connection.source_value.startsWith('[') && connection.source_value.endsWith(']')) {
            const parsed = JSON.parse(connection.source_value);
            if (Array.isArray(parsed)) {
              parsed.forEach(value => {
                connectionMap.set(String(value), connection);
              });
            }
          } else {
            connectionMap.set(connection.source_value, connection);
          }
        } catch (e) {
          // If parsing fails, just use the raw value
          connectionMap.set(connection.source_value, connection);
        }
      }
    });
    
    return connectionMap;
  };
  
  // Check if an option is connected
  const isOptionConnected = (option: string): boolean => {
    const connectionMap = getConnectionMap();
    return connectionMap.has(option);
  };
  
  // Get connection for an option
  const getConnectionForOption = (option: string): ScreenConnection | null => {
    const connectionMap = getConnectionMap();
    return connectionMap.get(option) || null;
  };

  return {
    connections,
    isLoading,
    isOptionConnected,
    getConnectionForOption
  };
}
