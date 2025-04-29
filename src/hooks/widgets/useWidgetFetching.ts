
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Widget } from "@/types/widget";
import { useAuth } from "@/hooks/useAuth";

interface UseWidgetFetchingProps {
  searchQuery: string;
  selectedTagIds: string[];
}

export function useWidgetFetching({ searchQuery, selectedTagIds }: UseWidgetFetchingProps) {
  const { toast } = useToast();
  const { session } = useAuth();
  const userId = session?.user?.id;

  // Fetch widgets with filtering
  const { data: widgets = [], isLoading, refetch } = useQuery({
    queryKey: ["widgets", userId, searchQuery, selectedTagIds],
    queryFn: async () => {
      try {
        let query = supabase
          .from("widgets")
          .select("*");

        // Filter by search query if provided
        if (searchQuery) {
          query = query.ilike("name", `%${searchQuery}%`);
        }

        // Filter by tags if selected
        if (selectedTagIds.length > 0) {
          query = query.contains("tags", selectedTagIds);
        }

        const { data, error } = await query.order("created_at", { ascending: false });

        if (error) {
          toast({
            title: "Error fetching widgets",
            description: error.message,
            variant: "destructive"
          });
          return [];
        }

        return data as Widget[];
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to fetch widgets",
          variant: "destructive"
        });
        return [];
      }
    },
    enabled: !!userId
  });

  // Fetch tag details
  const { data: tagDetails = {} } = useQuery({
    queryKey: ["tag-details", userId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("tags")
          .select("id, label")
          .eq("entity_type", "Widget");

        if (error) throw error;

        // Convert to dictionary for easy lookup
        const tagDict: Record<string, string> = {};
        data?.forEach(tag => {
          tagDict[tag.id] = tag.label;
        });

        return tagDict;
      } catch (error: any) {
        console.error("Error fetching tag details:", error);
        return {};
      }
    },
    enabled: !!userId
  });

  return {
    widgets,
    isLoading,
    refetch,
    tagDetails
  };
}
