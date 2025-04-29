
import { useWidgetState } from "./widgets/useWidgetState";
import { useWidgetFetching } from "./widgets/useWidgetFetching";
import { useWidgetActions } from "./widgets/useWidgetActions";
import { useWidgetTagFiltering } from "./widgets/useWidgetTagFiltering";
import { Widget } from "@/types/widget";

export function useWidgetManager() {
  // Get all the state variables
  const {
    searchQuery,
    setSearchQuery,
    selectedTagIds,
    setSelectedTagIds,
    viewMode,
    setViewMode,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    selectedWidget,
    setSelectedWidget,
    widgetFormData,
    setWidgetFormData
  } = useWidgetState();

  // Get widget data
  const { widgets, isLoading, refetch, tagDetails } = useWidgetFetching({
    searchQuery,
    selectedTagIds
  });

  // Get widget actions
  const { createWidget, updateWidget } = useWidgetActions({ refetch });

  // Get tag filtering functions
  const { handleTagSelect: filterTagSelect, handleTagRemove: filterTagRemove, handleTagClear } = useWidgetTagFiltering();

  // Handle creating a new widget
  const handleCreateWidget = async () => {
    const success = await createWidget(widgetFormData);
    if (success) {
      setWidgetFormData({ name: "", description: "", tags: [] });
      setIsCreateDialogOpen(false);
    }
  };

  // Handle updating a widget
  const handleUpdateWidget = async () => {
    if (!selectedWidget?.id) return;
    
    const success = await updateWidget(selectedWidget.id, widgetFormData);
    if (success) {
      setIsEditDialogOpen(false);
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

  // Tag filtering handlers
  const handleTagSelect = (tagId: string) => {
    setSelectedTagIds(filterTagSelect(selectedTagIds, tagId));
  };

  const handleTagRemove = (tagId: string) => {
    setSelectedTagIds(filterTagRemove(selectedTagIds, tagId));
  };

  return {
    // State
    widgets,
    isLoading,
    searchQuery,
    selectedTagIds,
    viewMode,
    selectedWidget,
    isCreateDialogOpen,
    isEditDialogOpen,
    widgetFormData,
    tagDetails,
    
    // Setters
    setSearchQuery,
    setViewMode,
    setIsCreateDialogOpen,
    setIsEditDialogOpen,
    setWidgetFormData,
    
    // Handlers
    handleCreateWidget,
    handleUpdateWidget,
    handleEditClick,
    handleTagSelect,
    handleTagRemove,
    handleTagClear
  };
}
