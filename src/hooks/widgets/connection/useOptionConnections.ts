
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useScreenConnections } from "./useScreenConnections";
import { doesValueMatchConnection } from "./utils/connectionUtils";

/**
 * Hook to fetch and manage connections for options (radio buttons, multiple options, etc.)
 */
export function useOptionConnections(screenId?: string, frameworkType?: string) {
  // Use the refactored screen connections hook to fetch connections
  const { 
    connections, 
    isLoading 
  } = useScreenConnections({ 
    screenId, 
    enabled: !!screenId 
  });

  // Filter connections based on the framework type if provided
  const filteredConnections = frameworkType 
    ? connections.filter(conn => {
        // Use a like query to match both "Multiple Options" and "Multiple Options - Individual"
        if (frameworkType === "Multiple Options") {
          return conn.framework_type?.startsWith(frameworkType);
        }
        return conn.framework_type === frameworkType;
      })
    : connections;

  // Process connections to create a map of option -> connection
  const getConnectionMap = () => {
    const connectionMap = new Map();
    
    filteredConnections.forEach(connection => {
      if (connection.source_value) {
        connectionMap.set(connection.source_value, connection);
      }
    });
    
    return connectionMap;
  };
  
  // Check if an option is connected
  const isOptionConnected = (option: string): boolean => {
    if (!option) return false;
    
    return filteredConnections.some(conn => 
      doesValueMatchConnection(option, conn) && 
      !conn.is_screen_terminated
    );
  };
  
  // Get connection for an option
  const getConnectionForOption = (option: string) => {
    if (!option) return null;
    
    return filteredConnections.find(conn => 
      doesValueMatchConnection(option, conn) && 
      !conn.is_screen_terminated
    ) || null;
  };
  
  // Check if a framework is connected
  const isFrameworkConnected = (type: string): boolean => {
    return filteredConnections.some(conn => 
      conn.framework_type === type && 
      !conn.is_screen_terminated
    );
  };

  // Clear selected values
  const clearSelectedValues = () => {
    localStorage.removeItem('selected_option_value');
    localStorage.removeItem('selected_combination_value');
  };

  // Clear selected values when the component unmounts or when screenId changes
  useEffect(() => {
    return () => {
      // Clear selections on component unmount or screenId change
      clearSelectedValues();
    };
  }, [screenId]);

  return {
    connections: filteredConnections,
    isLoading,
    isOptionConnected,
    isFrameworkConnected,
    getConnectionForOption,
    getConnectionMap,
    clearSelectedValues
  };
}
