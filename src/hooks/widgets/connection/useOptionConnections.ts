
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useScreenConnections } from "./useScreenConnections";
import { doesValueMatchConnection } from "./utils/connectionUtils";

interface UseOptionConnectionsProps {
  widgetId?: string;
  screenId?: string;
  contextType?: string;
}

/**
 * Hook to fetch and manage connections for options (radio buttons, multiple options, etc.)
 */
export function useOptionConnections(props?: UseOptionConnectionsProps | string) {
  // Handle both old string parameter and new object parameter for backward compatibility
  const screenId = typeof props === 'string' ? props : props?.screenId;
  const frameworkType = typeof props === 'object' ? props?.contextType : undefined;
  const widgetId = typeof props === 'object' ? props?.widgetId : undefined;

  // Local state for selected values
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

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

  // Create connection IDs map
  const connectionIds = filteredConnections.reduce((acc, conn) => {
    if (conn.source_value) {
      acc[conn.source_value] = conn.id;
    }
    return acc;
  }, {} as Record<string, string>);

  // Select value function
  const selectValue = (value: string) => {
    setSelectedValue(value);
    // Store in localStorage for persistence
    localStorage.setItem('selected_option_value', value);
  };

  // Get connection details
  const getConnectionDetails = (connectionId: string) => {
    return filteredConnections.find(conn => conn.id === connectionId);
  };

  // View connection function
  const viewConnection = (connectionId: string) => {
    const connection = getConnectionDetails(connectionId);
    if (connection) {
      // Navigate to the connected screen or show connection details
      console.log('Viewing connection:', connection);
      // You can implement navigation logic here
    }
  };

  // Clear selected values
  const clearSelectedValues = () => {
    localStorage.removeItem('selected_option_value');
    localStorage.removeItem('selected_combination_value');
    setSelectedValue(null);
  };

  // Clear selected values when the component unmounts or when screenId changes
  useEffect(() => {
    return () => {
      // Clear selections on component unmount or screenId change
      clearSelectedValues();
    };
  }, [screenId]);

  // Load selected value from localStorage on mount
  useEffect(() => {
    const storedValue = localStorage.getItem('selected_option_value');
    if (storedValue) {
      setSelectedValue(storedValue);
    }
  }, []);

  return {
    connections: filteredConnections,
    isLoading,
    isOptionConnected,
    isFrameworkConnected,
    getConnectionForOption,
    getConnectionMap,
    clearSelectedValues,
    selectedValue,
    selectValue,
    connectionIds,
    getConnectionDetails,
    viewConnection
  };
}
