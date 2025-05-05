
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Widget } from "@/types/widget";
import { useToast } from "@/hooks/use-toast";

export function useWidgetList() {
  const { toast } = useToast();

  const { data: widgets = [], isLoading } = useQuery({
    queryKey: ["widgets-list-global"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("widgets")
          .select("id, name")
          .order("created_at", { ascending: false });
        
        if (error) {
          throw error;
        }
        
        return data as Widget[];
      } catch (error: any) {
        console.error("Error loading widgets:", error);
        toast({
          title: "Error loading widgets",
          description: "Failed to load the list of widgets",
          variant: "destructive"
        });
        return [];
      }
    }
  });
  
  return {
    widgets,
    isLoading
  };
}
