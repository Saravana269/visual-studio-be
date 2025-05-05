
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Screen } from "@/types/screen";
import { useToast } from "@/hooks/use-toast";

interface UseSelectedScreenQueryProps {
  screenId: string | null;
  enabled?: boolean;
}

export function useSelectedScreenQuery({
  screenId,
  enabled = true
}: UseSelectedScreenQueryProps) {
  const { toast } = useToast();

  const { 
    data: selectedScreen, 
    isLoading 
  } = useQuery({
    queryKey: ["selected-screen-details", screenId],
    queryFn: async () => {
      if (!screenId) return null;
      
      try {
        const { data, error } = await supabase
          .from("screens")
          .select("*")
          .eq("id", screenId)
          .single();
        
        if (error) throw error;
        
        return data as Screen;
      } catch (error) {
        console.error("Error fetching selected screen:", error);
        toast({
          title: "Error fetching screen details",
          description: "Could not load screen preview.",
          variant: "destructive"
        });
        return null;
      }
    },
    enabled: !!screenId && enabled
  });
  
  return {
    selectedScreen,
    isLoading
  };
}
