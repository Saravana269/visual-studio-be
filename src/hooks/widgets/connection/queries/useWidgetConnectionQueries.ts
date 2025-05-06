
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScreenConnection } from "@/types/connection";

/**
 * Hook for querying connections associated with a widget
 */
export function useWidgetConnectionQueries(widgetId?: string, enabled = true) {
  return useQuery({
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
}
