
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Screen } from "@/types/screen";
import { useScreenRealtime } from "./useScreenRealtime";

export function useScreenData(widgetId: string | undefined) {
  const { toast } = useToast();

  const {
    data: screens = [],
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["widget-screens", widgetId],
    queryFn: async () => {
      if (!widgetId) return [];
      
      try {
        const { data, error } = await supabase
          .from("screens")
          .select("*")
          .eq("widget_id", widgetId)
          .order("created_at", { ascending: true });
        
        if (error) throw error;
        
        return data as Screen[];
      } catch (error: any) {
        toast({
          title: "Error fetching screens",
          description: error.message,
          variant: "destructive"
        });
        return [];
      }
    },
    enabled: !!widgetId
  });
  
  // Set up real-time subscription
  useScreenRealtime({ widgetId, enabled: !!widgetId });
  
  // Get single screen by ID
  const getScreenById = async (screenId: string): Promise<Screen | null> => {
    if (!screenId) return null;
    
    try {
      const { data, error } = await supabase
        .from("screens")
        .select("*")
        .eq("id", screenId)
        .single();
      
      if (error) throw error;
      
      return data as Screen;
    } catch (error: any) {
      toast({
        title: "Error fetching screen details",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
  };

  return {
    screens,
    isLoading,
    refetch,
    error,
    getScreenById
  };
}
