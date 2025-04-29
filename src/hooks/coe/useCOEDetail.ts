
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { COE } from "@/hooks/useCOEData";

export const useCOEDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  
  const { data: coe, isLoading: isCOELoading } = useQuery({
    queryKey: ["coe", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("class_of_elements")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        toast({
          title: "Error fetching COE",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }

      return data as COE;
    },
  });

  const { data: tagDetail } = useQuery({
    queryKey: ["coe-tag-detail", coe?.primary_tag_id],
    queryFn: async () => {
      if (!coe?.primary_tag_id) return null;
      
      const { data, error } = await supabase
        .from("tags")
        .select("id, label")
        .eq("id", coe.primary_tag_id)
        .single();
      
      if (error || !data) return null;
      
      return data;
    },
    enabled: !!coe?.primary_tag_id
  });

  const { data: assignedElements = [], refetch: refetchElements } = useQuery({
    queryKey: ["coe-elements", id],
    queryFn: async () => {
      if (!id) return [];
      
      const { data, error } = await supabase
        .from("elements")
        .select("*")
        .contains("coe_ids", [id]);
      
      if (error) {
        console.error("Error fetching assigned elements:", error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!id
  });

  return {
    id,
    coe,
    tagDetail,
    assignedElements,
    isCOELoading,
    refetchElements
  };
};
