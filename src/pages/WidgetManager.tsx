
import { Plus, ListFilter, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TagManagementRow } from "@/components/elements/TagManagementRow";
import { WidgetGrid } from "@/components/widgets/WidgetGrid";
import { WidgetList } from "@/components/widgets/WidgetList";
import { WidgetDetailDialog } from "@/components/widgets/WidgetDetailDialog";
import { WidgetFormDialog } from "@/components/widgets/WidgetFormDialog";
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
    setWidgetFormData,
    
    handleViewDetails,
    handleCreateWidget,
    handleUpdateWidget,
    handleEditClick,
    handleTagSelect,
    handleTagRemove,
    handleTagClear
  } = useWidgetManager();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Widget Manager</h1>
        <Button 
          onClick={() => {
            setWidgetFormData({ name: "", description: "", tags: [] });
            setIsCreateDialogOpen(true);
          }}
          className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
        >
          <Plus size={16} className="mr-2" /> New Widget
        </Button>
      </div>

      {/* Search and filter options */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search widgets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
            <ListFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="flex-shrink-0"
          >
            {viewMode === "grid" ? <LayoutGrid size={16} /> : <ListFilter size={16} />}
          </Button>
        </div>
        
        {/* Tag management row */}
        <TagManagementRow
          selectedTags={selectedTagIds}
          tagDetails={tagDetails}
          onTagSearch={setSearchQuery}
          onTagSelect={handleTagSelect}
          onTagRemove={handleTagRemove}
          onTagClear={handleTagClear}
          onAddTagClick={() => {}}
          entityType="widget"
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
