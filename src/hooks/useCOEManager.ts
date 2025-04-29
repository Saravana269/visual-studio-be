
import { useTagDetails } from "@/hooks/coe/useTagDetails";
import { useTagFiltering } from "@/hooks/coe/useTagFiltering";
import { useCOETagManagement } from "@/hooks/coe/useCOETagManagement";
import { useCOEPrimaryTag } from "@/hooks/coe/useCOEPrimaryTag";
import { useCOECreate } from "@/hooks/coe/useCOECreate";

export const useCOEManager = () => {
  // Fetch tag details
  const { tagDetails, refetchTags } = useTagDetails();
  
  // Filtering and search
  const {
    searchQuery,
    setSearchQuery,
    selectedTags,
    setSelectedTags,
    currentPage,
    setCurrentPage,
    handleTagSelect,
    handleTagRemove,
    handleTagClear,
    handleTagCreated
  } = useTagFiltering();
  
  // COE Tag management
  const {
    selectedCOE: tagManagementCOE,
    setSelectedCOE: setTagManagementCOE,
    isTagDialogOpen,
    setIsTagDialogOpen,
    tagDialogMode,
    tagSelections,
    handleManageTags,
    handleTagSelectionChange,
    handleSaveTags
  } = useCOETagManagement();
  
  // COE Primary Tag
  const {
    isAssignTagDialogOpen,
    setIsAssignTagDialogOpen,
    selectedTagInDialog,
    setSelectedTagInDialog,
    isSubmittingTag,
    selectedCOE: primaryTagCOE,
    setSelectedCOE: setPrimaryTagCOE,
    handleAssignTag,
    handleSaveTag
  } = useCOEPrimaryTag();
  
  // COE Create
  const {
    isCreateModalOpen,
    setIsCreateModalOpen,
    selectedCOE: createCOE,
    setSelectedCOE: setCreateCOE,
    isCreateTagDialogOpen,
    setIsCreateTagDialogOpen
  } = useCOECreate();
  
  // Selected COE is shared across components, need to synchronize them
  const setSelectedCOE = (coe: any) => {
    setTagManagementCOE(coe);
    setPrimaryTagCOE(coe);
    setCreateCOE(coe);
  };
  
  // Get the current selected COE from any of the hooks
  const selectedCOE = tagManagementCOE || primaryTagCOE || createCOE;
  
  return {
    // State
    isCreateModalOpen,
    setIsCreateModalOpen,
    selectedCOE,
    setSelectedCOE,
    searchQuery,
    setSearchQuery,
    selectedTags,
    setSelectedTags,
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
    
    // Functions
    handleManageTags,
    handleTagSelectionChange,
    handleSaveTags,
    handleAssignTag,
    handleSaveTag,
    handleTagSelect,
    handleTagRemove,
    handleTagClear,
    handleTagCreated,
    refetchTags
  };
};
