
import { 
  useScreenConnectionQueries, 
  useElementConnectionQueries, 
  useWidgetConnectionQueries 
} from "./queries";
import { combineConnections } from "./utils/connectionUtils";

interface UseScreenConnectionsProps {
  screenId?: string;
  elementId?: string;
  widgetId?: string;
  enabled?: boolean;
}

/**
 * Hook for fetching and managing screen, element, and widget connections
 */
export const useScreenConnections = ({
  screenId,
  elementId,
  widgetId,
  enabled = true
}: UseScreenConnectionsProps = {}) => {
  // Query for connections based on screen ID
  const {
    data: screenConnections = [],
    isLoading: isLoadingScreenConnections,
    error: screenConnectionsError,
    refetch: refetchScreenConnections
  } = useScreenConnectionQueries(screenId, enabled);
  
  // Query for connections based on element ID
  const {
    data: elementConnections = [],
    isLoading: isLoadingElementConnections,
    error: elementConnectionsError,
    refetch: refetchElementConnections
  } = useElementConnectionQueries(elementId, enabled);
  
  // Query for connections based on widget ID
  const {
    data: widgetConnections = [],
    isLoading: isLoadingWidgetConnections,
    error: widgetConnectionsError,
    refetch: refetchWidgetConnections
  } = useWidgetConnectionQueries(widgetId, enabled);

  // Determine overall loading state
  const isLoading = 
    (!!screenId && isLoadingScreenConnections) || 
    (!!elementId && isLoadingElementConnections) ||
    (!!widgetId && isLoadingWidgetConnections);
  
  // Combine all connections using our utility function
  const connections = combineConnections(
    screenConnections,
    elementConnections,
    widgetConnections
  );

  // Function to refetch all active queries
  const refetchConnections = async () => {
    const promises = [];
    
    if (screenId) {
      promises.push(refetchScreenConnections());
    }
    
    if (elementId) {
      promises.push(refetchElementConnections());
    }
    
    if (widgetId) {
      promises.push(refetchWidgetConnections());
    }
    
    await Promise.all(promises);
  };

  // Determine if there was an error in any query
  const error = screenConnectionsError || elementConnectionsError || widgetConnectionsError;

  return {
    connections,
    screenConnections,
    elementConnections,
    widgetConnections,
    isLoading,
    refetchConnections,
    error
  };
};
