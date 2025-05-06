
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScreenConnection } from "@/types/connection";

interface UseScreenConnectionsProps {
  screenId?: string;
  elementId?: string;
  widgetId?: string;
  enabled?: boolean;
}

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
  } = useQuery({
    queryKey: ['screen-connections', screenId],
    queryFn: async () => {
      if (!screenId) return [];
      
      try {
        const { data, error } = await supabase
          .from('connect_screens')
          .select('*')
          .eq('screen_ref', screenId);
          
        if (error) throw error;
        
        return data as ScreenConnection[];
      } catch (error) {
        console.error("Error fetching screen connections:", error);
        return [];
      }
    },
    enabled: !!screenId && enabled
  });
  
  // Query for connections based on element ID
  const {
    data: elementConnections = [],
    isLoading: isLoadingElementConnections,
    error: elementConnectionsError,
    refetch: refetchElementConnections
  } = useQuery({
    queryKey: ['element-connections', elementId],
    queryFn: async () => {
      if (!elementId) return [];
      
      try {
        const { data, error } = await supabase
          .from('connect_screens')
          .select('*')
          .eq('element_ref', elementId);
          
        if (error) throw error;
        
        return data as ScreenConnection[];
      } catch (error) {
        console.error("Error fetching element connections:", error);
        return [];
      }
    },
    enabled: !!elementId && enabled
  });
  
  // Query for connections based on widget ID
  const {
    data: widgetConnections = [],
    isLoading: isLoadingWidgetConnections,
    error: widgetConnectionsError,
    refetch: refetchWidgetConnections
  } = useQuery({
    queryKey: ['widget-connections', widgetId],
    queryFn: async () => {
      if (!widgetId) return [];
      
      try {
        const { data, error } = await supabase
          .from('connect_screens')
          .select('*')
          .eq('widget_ref', widgetId);
          
        if (error) throw error;
        
        return data as ScreenConnection[];
      } catch (error) {
        console.error("Error fetching widget connections:", error);
        return [];
      }
    },
    enabled: !!widgetId && enabled
  });

  // Determine overall loading state
  const isLoading = 
    (!!screenId && isLoadingScreenConnections) || 
    (!!elementId && isLoadingElementConnections) ||
    (!!widgetId && isLoadingWidgetConnections);
  
  // Combine all connections
  const connections = [
    ...screenConnections,
    ...elementConnections.filter(ec => 
      !screenConnections.some(sc => sc.id === ec.id)
    ),
    ...widgetConnections.filter(wc => 
      !screenConnections.some(sc => sc.id === wc.id) && 
      !elementConnections.some(ec => ec.id === wc.id)
    )
  ];

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

  return {
    connections,
    screenConnections,
    elementConnections,
    widgetConnections,
    isLoading,
    refetchConnections,
    error: screenConnectionsError || elementConnectionsError || widgetConnectionsError
  };
};
