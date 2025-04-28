
import { useState } from "react";
import { useCOEData } from "@/hooks/useCOEData";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import COEModal from "@/components/coe/COEModal";
import COESidebar from "@/components/coe/COESidebar";
import COEEmptyState from "@/components/coe/COEEmptyState";
import COEList from "@/components/coe/COEList";
import COEHeader from "@/components/coe/COEHeader";
import { TagManagementRow } from "@/components/elements/TagManagementRow";
import COETagSearch from "@/components/coe/COETagSearch";
import type { COE } from "@/hooks/useCOEData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

const COEManager = () => {
  const { toast } = useToast();
  useAuth();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCOE, setSelectedCOE] = useState<COE | null>(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [tagDialogMode, setTagDialogMode] = useState<'add' | 'remove'>('add');
  const [tagSelections, setTagSelections] = useState<Record<string, boolean>>({});
  const [tagSearchQuery, setTagSearchQuery] = useState("");

  const { data: coes = [], isLoading, error, refetch } = useCOEData();

  const filteredCOEs = Array.isArray(coes) ? coes.filter((coe) => {
    const matchesSearch = coe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (coe.description && coe.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTags =
      selectedTags.length === 0 ||
      (coe.tags && selectedTags.every((tag) => coe.tags.includes(tag)));
    return matchesSearch && matchesTags;
  }) : [];

  const allTags = Array.isArray(coes) ? 
    Array.from(new Set(coes.flatMap((coe) => coe.tags || []))) : [];

  const handleCreateCOE = () => {
    setSelectedCOE(null);
    setIsCreateModalOpen(true);
  };

  const handleEditCOE = (coe: COE) => {
    setSelectedCOE(coe);
    setIsCreateModalOpen(true);
  };

  const handleViewCOE = (coe: COE) => {
    setSelectedCOE(coe);
    setSidePanelOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidePanelOpen(false);
    setSelectedCOE(null);
  };

  const handleCloseModal = (shouldRefresh: boolean = false) => {
    setIsCreateModalOpen(false);
    setSelectedCOE(null);
    if (shouldRefresh) {
      refetch();
    }
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleClearTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleManageTags = (coe: COE, action: 'add' | 'remove') => {
    setSelectedCOE(coe);
    setTagDialogMode(action);
    
    const selections: Record<string, boolean> = {};
    
    if (action === 'add') {
      (allTags || []).forEach(tag => {
        selections[tag] = false;
      });
    } else {
      (coe.tags || []).forEach(tag => {
        selections[tag] = false;
      });
    }
    
    setTagSelections(selections);
    setIsTagDialogOpen(true);
  };

  const handleTagSelectionChange = (tag: string, checked: boolean) => {
    setTagSelections(prev => ({
      ...prev,
      [tag]: checked
    }));
  };

  const handleSaveTags = async () => {
    if (!selectedCOE) return;
    
    try {
      const selectedTagsList = Object.entries(tagSelections)
        .filter(([_, selected]) => selected)
        .map(([tag]) => tag);
      
      let updatedTags: string[] = [...(selectedCOE.tags || [])];
      
      if (tagDialogMode === 'add') {
        updatedTags = [...new Set([...updatedTags, ...selectedTagsList])];
      } else {
        updatedTags = updatedTags.filter(tag => !selectedTagsList.includes(tag));
      }
      
      const { error } = await supabase
        .from("class_of_elements")
        .update({ tags: updatedTags })
        .eq("id", selectedCOE.id);
        
      if (error) throw error;
      
      toast({
        title: "Tags updated",
        description: tagDialogMode === 'add' ? "Tags have been added." : "Tags have been removed.",
      });
      
      refetch();
      setIsTagDialogOpen(false);
    } catch (error) {
      console.error("Error updating tags:", error);
      toast({
        title: "Error updating tags",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

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
      <COEHeader onCreateCOE={() => setIsCreateModalOpen(true)} />
      
      <div className="mb-6">
        <TagManagementRow
          selectedTags={selectedTags}
          onTagSearch={setTagSearchQuery}
          onTagRemove={handleClearTag}
          onAddTagClick={() => selectedCOE && handleManageTags(selectedCOE, 'add')}
          onManageTagsClick={() => {/* Implement tag management */}}
        />
      </div>

      <COETagSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedTags={selectedTags}
        allTags={allTags}
        onTagSelect={handleTagSelect}
      />
      
      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00B86B]" />
        </div>
      ) : Array.isArray(coes) && coes.length === 0 ? (
        <COEEmptyState onCreateFirst={() => setIsCreateModalOpen(true)} />
      ) : (
        <COEList
          coes={filteredCOEs}
          onEdit={handleEditCOE}
          onView={handleViewCOE}
        />
      )}
      
      {isCreateModalOpen && (
        <COEModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseModal}
          coe={selectedCOE}
          onSave={async (coe) => {
            try {
              if (selectedCOE) {
                const { error } = await supabase
                  .from("class_of_elements")
                  .update({
                    name: coe.name,
                    description: coe.description,
                    tags: coe.tags,
                    image_url: coe.image_url,
                  })
                  .eq("id", selectedCOE.id);
                
                if (error) throw error;
                
                toast({
                  title: "COE updated",
                  description: `${coe.name} has been updated successfully.`,
                });
              } else {
                const { error } = await supabase
                  .from("class_of_elements")
                  .insert([{
                    name: coe.name,
                    description: coe.description,
                    tags: coe.tags,
                    image_url: coe.image_url,
                  }]);
                
                if (error) throw error;
                
                toast({
                  title: "COE created",
                  description: `${coe.name} has been created successfully.`,
                });
              }
              
              handleCloseModal(true);
            } catch (error) {
              toast({
                title: "Error",
                description: error instanceof Error ? error.message : "An unknown error occurred",
                variant: "destructive",
              });
            }
          }}
        />
      )}
      
      {selectedCOE && (
        <COESidebar
          isOpen={sidePanelOpen}
          onClose={handleCloseSidebar}
          coe={selectedCOE}
          onUpdate={refetch}
          onSave={async (updatedCOE) => {
            try {
              const { error } = await supabase
                .from("class_of_elements")
                .update({
                  name: updatedCOE.name,
                  description: updatedCOE.description,
                  tags: updatedCOE.tags,
                  image_url: updatedCOE.image_url,
                })
                .eq("id", updatedCOE.id);
              
              if (error) throw error;
              
              toast({
                title: "COE updated",
                description: `${updatedCOE.name} has been updated successfully.`,
              });
              
              refetch();
            } catch (error) {
              toast({
                title: "Error",
                description: error instanceof Error ? error.message : "An unknown error occurred",
                variant: "destructive",
              });
            }
          }}
        />
      )}
      
      <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {tagDialogMode === 'add' ? 'Add Tags to' : 'Remove Tags from'} {selectedCOE?.name}
            </DialogTitle>
            <DialogDescription>
              Please select the tags you would like to {tagDialogMode === 'add' ? 'add' : 'remove'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Input
              placeholder="Search available tags..."
              className="mb-4"
              onChange={(e) => {
                setTagSearchQuery(e.target.value);
              }}
            />
            
            <div className="space-y-4 max-h-[300px] overflow-y-auto">
              {Object.entries(tagSelections)
                .filter(([tag]) => 
                  tag.toLowerCase().includes(tagSearchQuery.toLowerCase())
                )
                .map(([tag, isSelected]) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`tag-${tag}`} 
                      checked={isSelected}
                      onCheckedChange={(checked) => 
                        handleTagSelectionChange(tag, checked === true)
                      } 
                    />
                    <label 
                      htmlFor={`tag-${tag}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {tag}
                    </label>
                  </div>
                ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsTagDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveTags}
              className="bg-[#00B86B] hover:bg-[#00A25F]"
              disabled={Object.values(tagSelections).every(v => !v)}
            >
              {tagDialogMode === 'add' ? 'Add' : 'Remove'} Selected Tags
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default COEManager;
