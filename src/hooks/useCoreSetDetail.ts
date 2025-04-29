
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { CoreSet } from "@/hooks/useCoreSetData";

export const useCoreSetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  const { data: coreSet, isLoading, error } = useQuery({
    queryKey: ["core-set", id],
    queryFn: async () => {
      if (!id) return null;
      
      try {
        const { data, error } = await supabase
          .from("core_sets")
          .select("*")
          .eq("id", id)
          .single();
        
        if (error) {
          console.error("Error fetching core set:", error);
          toast({
            title: "Error fetching core set",
            description: error.message,
            variant: "destructive",
          });
          return null;
        }
        
        return data as CoreSet;
      } catch (error: any) {
        console.error("Unexpected error in Core Set detail query:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to fetch core set details",
          variant: "destructive",
        });
        return null;
      }
    },
    enabled: !!id,
  });
  
  return {
    coreSet,
    isLoading,
    error,
  };
};
