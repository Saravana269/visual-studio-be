
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
        // Get connections for this screen
        const { data, error } = await supabase
          .from('connect_screens')
          .select('*, next_screen:nextScreen_Ref(name, description)')
          .eq('screen_ref', screenId);
          
        if (error) throw error;
        
        // Transform to include next screen info in the connection object
        return data.map((conn: any) => ({
          ...conn,
          nextScreen_Name: conn.next_screen?.name,
          nextScreen_Description: conn.next_screen?.description
        })) as ScreenConnection[];
      } catch (error) {
        console.error("Error fetching screen connections:", error);
        return [];
      }
    },
    enabled: !!screenId && enabled
  });
}
