
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScreenConnection } from "@/types/connection";

/**
 * Hook for querying connections associated with a screen
 */
export function useScreenConnectionQueries(screenId?: string, enabled = true) {
  return useQuery({
    queryKey: ['screen-connections', screenId],
    queryFn: async () => {
      if (!screenId) return [];
      
      try {
        // Get connections where this screen is the source
        const { data: sourceConnections, error: sourceError } = await supabase
          .from('connect_screens')
          .select('*, next_screen:nextScreen_Ref(id, name, description)')
          .eq('screen_ref', screenId);
          
        if (sourceError) throw sourceError;
        
        // Get connections where this screen is the destination
        const { data: destinationConnections, error: destError } = await supabase
          .from('connect_screens')
          .select('*, source_screen:screen_ref(id, name, description)')
          .eq('nextScreen_Ref', screenId);
          
        if (destError) throw destError;
        
        // Transform source connections to include next screen info
        const transformedSourceConnections = sourceConnections.map((conn: any) => ({
          ...conn,
          nextScreen_Name: conn.next_screen?.name,
          nextScreen_Description: conn.next_screen?.description
        }));
        
        // Transform destination connections
        const transformedDestConnections = destinationConnections.map((conn: any) => ({
          ...conn,
          screen_name: conn.source_screen?.name,
          screen_description: conn.source_screen?.description
        }));
        
        // Combine both connection types
        return [...transformedSourceConnections, ...transformedDestConnections] as ScreenConnection[];
      } catch (error) {
        console.error("Error fetching screen connections:", error);
        return [];
      }
    },
    enabled: !!screenId && enabled
  });
}
