
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScreenConnection } from "@/types/connection";

/**
 * Hook for querying connections associated with an element
 */
export function useElementConnectionQueries(elementId?: string, enabled = true) {
  return useQuery({
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
}
