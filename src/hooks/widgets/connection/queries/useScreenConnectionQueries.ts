
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
          .select('*, next_screen:nextScreen_Ref(id, name, description, framework_type)')
          .eq('screen_ref', screenId);
          
        if (sourceError) throw sourceError;
        
        // Transform source connections to include next screen info
        const transformedSourceConnections = sourceConnections.map((conn: any) => ({
          ...conn,
          nextScreen_Name: conn.next_screen?.name,
          nextScreen_Description: conn.next_screen?.description,
          nextScreen_FrameworkType: conn.next_screen?.framework_type
        }));
        
        return transformedSourceConnections as ScreenConnection[];
      } catch (error) {
        console.error("Error fetching screen connections:", error);
        return [];
      }
    },
    enabled: !!screenId && enabled
  });
}
