
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
}
