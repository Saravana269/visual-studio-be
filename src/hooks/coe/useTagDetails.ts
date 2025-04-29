
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTagDetails = () => {
  // Fetch tag details
  const { data: tagDetails = {}, refetch: refetchTags } = useQuery({
    queryKey: ["coe-tag-details"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from("tags").select("id, label").eq("entity_type", "COE");
        if (error) {
          console.error("Error fetching tag details:", error);
          return {};
        }
        return data.reduce((acc: Record<string, string>, tag) => {
          acc[tag.id] = tag.label;
          return acc;
        }, {});
      } catch (error) {
        console.error("Error fetching tag details:", error);
        return {};
      }
    }
  });

  return {
    tagDetails,
    refetchTags
  };
};
