
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCOEData, type COE } from "@/hooks/useCOEData"; // Import the COE type here
import { useCOEManager } from "@/hooks/useCOEManager";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import COEModal from "@/components/coe/COEModal";
import COEEmptyState from "@/components/coe/COEEmptyState";
import COEList from "@/components/coe/COEList";
import COEHeader from "@/components/coe/COEHeader";
import TagDialog from "@/components/coe/TagDialog";
import AssignTagDialog from "@/components/coe/AssignTagDialog";
import { CreateTagDialog } from "@/components/elements/CreateTagDialog";
import { ElementPagination } from "@/components/elements/ElementPagination";

const COEManager = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { session, isChecking } = useAuth();
  
  // Use our custom hook to manage state and functions
  const {
    isCreateModalOpen,
    setIsCreateModalOpen,
    selectedCOE,
    setSelectedCOE,
    searchQuery,
    setSearchQuery,
    selectedTags,
    isTagDialogOpen,
    setIsTagDialogOpen,
    tagDialogMode,
    tagSelections,
    isAssignTagDialogOpen,
    setIsAssignTagDialogOpen,
    selectedTagInDialog,
    setSelectedTagInDialog,
    isSubmittingTag,
    isCreateTagDialogOpen,
    setIsCreateTagDialogOpen,
    currentPage,
    setCurrentPage,
    tagDetails,
    handleManageTags,
    handleTagSelectionChange,
    handleSaveTags,
    handleAssignTag,
    handleSaveTag,
    handleTagSelect,
    handleTagRemove,
    handleTagClear,
    handleTagCreated
  } = useCOEManager();
  
  // Fetch COE data
  const { data: coes = [], isLoading, error, refetch } = useCOEData();
  
  // Handle closing the modal
  const handleCloseModal = (shouldRefetch = false) => {
    setIsCreateModalOpen(false);
    setSelectedCOE(null);
    if (shouldRefetch) {
      refetch();
    }
  };
  
  // Filter COEs based on search query and tags
  const filteredCOEs = Array.isArray(coes) ? coes.filter(coe => {
    const matchesSearch = coe.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (coe.description && coe.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesAdditionalTags = selectedTags.length === 0 || 
                                 (coe.tags && selectedTags.every(tag => coe.tags.includes(tag)));
    
    return matchesSearch && matchesAdditionalTags;
  }) : [];
  
  // Extract all tags from COEs
  const allAdditionalTags = Array.isArray(coes) ? Array.from(new Set(coes.flatMap(coe => coe.tags || []))) : [];
  
  // COE CRUD operations
  const handleCreateCOE = () => {
    setSelectedCOE(null);
    setIsCreateModalOpen(true);
  };
  
  const handleEditCOE = (coe: COE) => {
    setSelectedCOE(coe);
    setIsCreateModalOpen(true);
  };
  
  const handleAddTag = () => {
    setIsCreateTagDialogOpen(true);
  };
  
  const handleManageTagsClick = () => {
    toast({
      title: "Feature coming soon",
      description: "Tag management will be available in a future update."
    });
  };
  
  // Pagination
  const ITEMS_PER_PAGE = 12;
  const totalPages = Math.max(1, Math.ceil(filteredCOEs.length / ITEMS_PER_PAGE));
  const paginatedCOEs = filteredCOEs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (error) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-500 mb-4">Error Loading Data</h2>
        <p className="mb-4">There was a problem loading the COE data.</p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with search and filtering */}
      <COEHeader 
        onCreateCOE={handleCreateCOE} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        selectedTags={selectedTags} 
        tagDetails={tagDetails} 
        onTagSelect={handleTagSelect} 
        onTagRemove={handleTagRemove} 
        onTagClear={handleTagClear} 
        onTagSearch={setSearchQuery} 
        onAddTagClick={handleAddTag} 
        onSettingsClick={handleManageTagsClick} 
      />
      
      {/* Main content */}
      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00B86B]" />
        </div>
      ) : Array.isArray(coes) && coes.length === 0 ? (
        <COEEmptyState onCreateFirst={() => setIsCreateModalOpen(true)} />
      ) : (
        <>
          <COEList coes={paginatedCOEs} onEdit={handleEditCOE} onAssignTag={handleAssignTag} />
          
          {/* Pagination */}
          <ElementPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
      
      {/* COE Modal */}
      {isCreateModalOpen && (
        <COEModal 
          isOpen={isCreateModalOpen} 
          onClose={handleCloseModal} 
          coe={selectedCOE} 
          onSave={async coe => {
            try {
              if (selectedCOE) {
                const { error } = await supabase.from("class_of_elements").update({
                  name: coe.name,
                  description: coe.description,
                  tags: coe.tags,
                  image_url: coe.image_url,
                  primary_tag_id: coe.primary_tag_id
                }).eq("id", selectedCOE.id);
                
                if (error) throw error;
                
                toast({
                  title: "COE updated",
                  description: `${coe.name} has been updated successfully.`
                });
              } else {
                const { error } = await supabase.from("class_of_elements").insert([{
                  name: coe.name,
                  description: coe.description,
                  tags: coe.tags,
                  image_url: coe.image_url,
                  primary_tag_id: coe.primary_tag_id
                }]);
                
                if (error) throw error;
                
                toast({
                  title: "COE created",
                  description: `${coe.name} has been created successfully.`
                });
              }
              
              handleCloseModal(true);
            } catch (error) {
              toast({
                title: "Error",
                description: error instanceof Error ? error.message : "An unknown error occurred",
                variant: "destructive"
              });
            }
          }} 
        />
      )}
      
      {/* Tag Dialog */}
      <TagDialog
        isOpen={isTagDialogOpen}
        onClose={() => setIsTagDialogOpen(false)}
        coe={selectedCOE}
        mode={tagDialogMode}
        tagSelections={tagSelections}
        onTagSelectionChange={handleTagSelectionChange}
        onSave={() => handleSaveTags().then(() => {})} // Fix Promise<boolean> to Promise<void> conversion
      />

      {/* Assign Tag Dialog */}
      <AssignTagDialog
        isOpen={isAssignTagDialogOpen}
        onClose={() => setIsAssignTagDialogOpen(false)}
        coe={selectedCOE}
        selectedTag={selectedTagInDialog}
        onTagChange={setSelectedTagInDialog}
        onSave={() => handleSaveTag().then(() => {})} // Fix Promise<boolean> to Promise<void> conversion
        isSubmitting={isSubmittingTag}
      />

      {/* Create Tag Dialog */}
      <CreateTagDialog 
        open={isCreateTagDialogOpen} 
        onClose={() => setIsCreateTagDialogOpen(false)} 
        onTagCreated={handleTagCreated} 
        entityType="COE" 
      />
    </div>
  );
};

export default COEManager;
