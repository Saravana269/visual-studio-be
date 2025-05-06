
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

/**
 * Hook to fetch and track option connections for a specific screen
 */
export function useOptionConnections(screenId?: string, frameworkType?: string | null) {
  // Connection state tracking
  const [connectedOptions, setConnectedOptions] = useState<Record<string, any>>({});

  // Fetch connections for this screen
  const { data: connections, isLoading } = useQuery({
    queryKey: ['option-connections', screenId, frameworkType],
    queryFn: async () => {
      if (!screenId) return [];
      
      try {
        const { data, error } = await supabase
          .from('connect_screens')
          .select('*')
          .eq('screen_ref', screenId)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        return data || [];
      } catch (error) {
        console.error("Error fetching option connections:", error);
        return [];
      }
    },
    enabled: !!screenId
  });

  // Process connections to map them by option value
  useEffect(() => {
    if (connections && connections.length > 0) {
      const optionsMap: Record<string, any> = {};
      
      connections.forEach(connection => {
        if (connection.source_value) {
          try {
            // Try to parse the source_value if it's a JSON string
            const sourceValue = 
              typeof connection.source_value === 'string' && 
              (connection.source_value.startsWith('[') || connection.source_value.startsWith('{'))
                ? JSON.parse(connection.source_value)
                : connection.source_value;
                
            // For single values
            if (typeof sourceValue === 'string') {
              optionsMap[sourceValue] = connection;
            } 
            // For array values (like combination selections)
            else if (Array.isArray(sourceValue)) {
              const combinationKey = sourceValue.join(',');
              optionsMap[combinationKey] = connection;
            }
          } catch (e) {
            // If parsing fails, just use the raw value
            optionsMap[connection.source_value] = connection;
          }
        }
      });
      
      setConnectedOptions(optionsMap);
    } else {
      setConnectedOptions({});
    }
  }, [connections]);

  // Check if a specific option is connected
  const isOptionConnected = (option: string | string[]): boolean => {
    if (Array.isArray(option)) {
      // For combination options
      return !!connectedOptions[option.join(',')];
    }
    // For single options
    return !!connectedOptions[option];
  };

  // Get connection details for a specific option
  const getConnectionForOption = (option: string | string[]): any => {
    if (Array.isArray(option)) {
      // For combination options
      return connectedOptions[option.join(',')] || null;
    }
    // For single options
    return connectedOptions[option] || null;
  };

  return {
    connectedOptions,
    isOptionConnected,
    getConnectionForOption,
    isLoading
  };
}
