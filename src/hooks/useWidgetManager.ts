
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Widget, WidgetFormData } from "@/types/widget";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export function useWidgetManager() {
  const { toast } = useToast();
  const { session } = useAuth();
  const userId = session?.user?.id;
  
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [widgetFormData, setWidgetFormData] = useState<WidgetFormData>({
    name: "",
    description: "",
    tags: []
  });

  // Fetch widgets
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

  // Fetch tag details to display tag names instead of IDs
  const { data: tagDetails = {} } = useQuery({
    queryKey: ["tag-details", userId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("tags")
          .select("id, label")
          .eq("entity_type", "widget");

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

  // Handle viewing widget details
  const handleViewDetails = (widget: Widget) => {
    setSelectedWidget(widget);
    setIsDetailDialogOpen(true);
  };

  // Handle creating a new widget
  const handleCreateWidget = async () => {
    try {
      if (!widgetFormData.name) {
        toast({
          title: "Error",
          description: "Widget name is required",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase
        .from("widgets")
        .insert({
          name: widgetFormData.name,
          description: widgetFormData.description,
          tags: widgetFormData.tags.length > 0 ? widgetFormData.tags : null
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Widget created successfully"
      });

      // Reset form and close dialog
      setWidgetFormData({ name: "", description: "", tags: [] });
      setIsCreateDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast({
        title: "Error creating widget",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Handle updating a widget
  const handleUpdateWidget = async () => {
    try {
      if (!selectedWidget?.id || !widgetFormData.name) {
        toast({
          title: "Error",
          description: "Widget ID and name are required",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase
        .from("widgets")
        .update({
          name: widgetFormData.name,
          description: widgetFormData.description,
          tags: widgetFormData.tags.length > 0 ? widgetFormData.tags : null,
          updated_at: new Date().toISOString()
        })
        .eq("id", selectedWidget.id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Widget updated successfully"
      });

      // Reset form and close dialog
      setIsEditDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast({
        title: "Error updating widget",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Handle editing a widget
  const handleEditClick = (widget: Widget) => {
    setSelectedWidget(widget);
    setWidgetFormData({
      name: widget.name,
      description: widget.description || "",
      tags: widget.tags || []
    });
    setIsEditDialogOpen(true);
  };

  // Handle tag selection for filtering
  const handleTagSelect = (tagId: string) => {
    if (!selectedTagIds.includes(tagId)) {
      setSelectedTagIds([...selectedTagIds, tagId]);
    }
  };

  // Handle tag removal for filtering
  const handleTagRemove = (tagId: string) => {
    setSelectedTagIds(selectedTagIds.filter(id => id !== tagId));
  };

  // Handle clearing all selected tags
  const handleTagClear = () => {
    setSelectedTagIds([]);
  };

  return {
    // State
    widgets,
    isLoading,
    searchQuery,
    selectedTagIds,
    viewMode,
    selectedWidget,
    isDetailDialogOpen,
    isCreateDialogOpen,
    isEditDialogOpen,
    widgetFormData,
    tagDetails,
    
    // Setters
    setSearchQuery,
    setViewMode,
    setIsDetailDialogOpen,
    setIsCreateDialogOpen,
    setIsEditDialogOpen, // Make sure this is exported
    setWidgetFormData,
    
    // Handlers
    handleViewDetails,
    handleCreateWidget,
    handleUpdateWidget,
    handleEditClick,
    handleTagSelect,
    handleTagRemove,
    handleTagClear
  };
}
