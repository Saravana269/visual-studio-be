
import { TagManagementRow } from "@/components/elements/TagManagementRow";
import { WidgetGrid } from "@/components/widgets/WidgetGrid";
import { WidgetList } from "@/components/widgets/WidgetList";
import { WidgetDetailDialog } from "@/components/widgets/WidgetDetailDialog";
import { WidgetFormDialog } from "@/components/widgets/WidgetFormDialog";
import { SearchFilterBar } from "@/components/widgets/search/SearchFilterBar";
import { WidgetHeaderActions } from "@/components/widgets/header/WidgetHeaderActions";
import { useWidgetManager } from "@/hooks/useWidgetManager";

const WidgetManager = () => {
  const {
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
    
    setSearchQuery,
    setViewMode,
    setIsDetailDialogOpen,
    setIsCreateDialogOpen,
    setIsEditDialogOpen,
    setWidgetFormData,
    
    handleViewDetails,
    handleCreateWidget,
    handleUpdateWidget,
    handleEditClick,
    handleTagSelect,
    handleTagRemove,
    handleTagClear
  } = useWidgetManager();

  // Handler for opening the create widget dialog
  const handleOpenCreateDialog = () => {
    setWidgetFormData({ name: "", description: "", tags: [] });
    setIsCreateDialogOpen(true);
  };

  return (
    <div className="p-8">
      <WidgetHeaderActions onCreateClick={handleOpenCreateDialog} />

      {/* Search and filter options */}
      <div className="mb-6">
        <SearchFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
        
        {/* Tag management row */}
        <TagManagementRow
          selectedTags={selectedTagIds}
          tagDetails={tagDetails}
          onTagSearch={setSearchQuery}
          onTagSelect={handleTagSelect}
          onTagRemove={handleTagRemove}
          onTagClear={handleTagClear}
          onAddTagClick={() => {}}
          entityType="Widget"
        />
      </div>

      {/* Widgets display - either grid or list */}
      {viewMode === "grid" ? (
        <WidgetGrid 
          widgets={widgets}
          isLoading={isLoading}
          tagDetails={tagDetails}
          onEditClick={handleEditClick}
          onViewDetails={handleViewDetails}
          onCreateClick={handleOpenCreateDialog}
        />
      ) : (
        <WidgetList
          widgets={widgets}
          tagDetails={tagDetails}
          onEditClick={handleEditClick}
          onViewDetails={handleViewDetails}
        />
      )}

      {/* Create/Edit Widget Dialogs */}
      <WidgetFormDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        formData={widgetFormData}
        setFormData={setWidgetFormData}
        onSave={handleCreateWidget}
        mode="create"
      />

      <WidgetFormDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        formData={widgetFormData}
        setFormData={setWidgetFormData}
        onSave={handleUpdateWidget}
        mode="edit"
      />

      {/* Widget Detail Dialog */}
      <WidgetDetailDialog
        isOpen={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        selectedWidget={selectedWidget}
        onEditClick={handleEditClick}
        tagDetails={tagDetails}
      />
    </div>
  );
};

export default WidgetManager;
