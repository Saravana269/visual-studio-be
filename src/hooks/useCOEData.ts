
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface COE {
  id: string;
  name: string;
  description: string | null;
  image_url?: string | null;
  tags: string[] | null;
  primary_tag_id: string | null;
  element_count?: number;
  coreSet_id?: string[] | null;
}

export const useCOEData = () => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ["coes"],
    queryFn: async () => {
      try {
        const { data: coesData, error: coesError } = await supabase
          .from("class_of_elements")
          .select("*");
        
        if (coesError) {
          toast({
            title: "Error fetching COEs",
            description: coesError.message,
            variant: "destructive",
          });
          return [];
        }
        
        if (!coesData || !Array.isArray(coesData)) {
          console.error("COEs data is not an array:", coesData);
          return [];
        }
        
        const coesWithCounts = await Promise.all(
          coesData.map(async (coe) => {
            try {
              const { count } = await supabase
                .from("elements")
                .select("*", { count: 'exact' })
                .contains('coe_ids', [coe.id]);
              
              return {
                ...coe,
                element_count: count || 0
              };
            } catch (error) {
              console.error(`Error getting element count for COE ${coe.id}:`, error);
              return {
                ...coe,
                element_count: 0
              };
            }
          })
        );
        
        return coesWithCounts;
      } catch (error) {
        console.error("Unexpected error in COE query:", error);
        return [];
      }
    },
  });
};
