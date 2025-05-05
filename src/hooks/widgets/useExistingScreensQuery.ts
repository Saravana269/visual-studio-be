
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Screen } from "@/types/screen";
import { useToast } from "@/hooks/use-toast";

interface UseExistingScreensQueryProps {
  widgetId: string;
  currentScreenId: string | null;
  enabled?: boolean;
}

export function useExistingScreensQuery({ 
  widgetId, 
  currentScreenId,
  enabled = true 
}: UseExistingScreensQueryProps) {
  const { toast } = useToast();

  // Fetch all screens for this widget
  const { data: screens = [], isLoading } = useQuery({
    queryKey: ["widget-screens-for-connection", widgetId],
    queryFn: async () => {
      if (!widgetId) return [];
      
      try {
        const { data, error } = await supabase
          .from("screens")
          .select("*")
          .eq("widget_id", widgetId)
          .order("created_at", { ascending: true });
        
        if (error) throw error;
        
        // Filter out the current screen
        return (data as Screen[]).filter(screen => 
          screen.id !== currentScreenId
        );
      } catch (error) {
        console.error("Error fetching screens:", error);
        toast({
          title: "Error fetching screens",
          description: "Could not load available screens.",
          variant: "destructive"
        });
        return [];
      }
    },
    enabled: !!widgetId && enabled
  });
  
  return {
    screens,
    isLoading
  };
}
