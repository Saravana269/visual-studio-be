
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Element } from "@/types/element";

export function useCOEElements(coeId: string | null | undefined) {
  return useQuery({
    queryKey: ["coe-elements", coeId],
    queryFn: async () => {
      if (!coeId) return [];
      
      const { data, error } = await supabase
        .from("elements")
        .select("*")
        .contains('coe_ids', [coeId]);
        
      if (error) {
        console.error("Error fetching COE elements:", error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!coeId,
  });
}
