
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface CoreSet {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  tags: string[] | null;
  source_coe_id: string | null;
  source_element_id: string | null;
  destination_coe_id: string | null;
  destination_element_ids: string[] | null;
}

export const useCoreSetData = () => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ["core-sets"],
    queryFn: async () => {
      try {
        const { data: coreSets, error } = await supabase
          .from("core_sets")
          .select("*");
        
        if (error) {
          toast({
            title: "Error fetching Core Sets",
            description: error.message,
            variant: "destructive",
          });
          return [];
        }
        
        return coreSets || [];
      } catch (error: any) {
        console.error("Unexpected error in Core Sets query:", error);
        return [];
      }
    },
  });
};
