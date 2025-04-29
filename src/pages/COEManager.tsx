import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCOEData } from "@/hooks/useCOEData";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import COEModal from "@/components/coe/COEModal";
import COEEmptyState from "@/components/coe/COEEmptyState";
import COEList from "@/components/coe/COEList";
import COEHeader from "@/components/coe/COEHeader";
import { TagManagementRow } from "@/components/elements/TagManagementRow";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tag } from "lucide-react";
import type { COE } from "@/hooks/useCOEData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreateTagDialog } from "@/components/elements/CreateTagDialog";

// Fixed PrimaryTagFilter component - now returns JSX
const PrimaryTagFilter = () => {
  // This is a placeholder component that will be implemented later
  return <div></div>; // Return an empty div for now
};

const COEManager = () => {
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const {
    session,
    isChecking
  } = useAuth();
  const userId = session?.user?.id;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCOE, setSelectedCOE] = useState<COE | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [tagDialogMode, setTagDialogMode] = useState<'add' | 'remove'>('add');
  const [tagSelections, setTagSelections] = useState<Record<string, boolean>>({});
  const [tagSearchQuery, setTagSearchQuery] = useState("");
  const [isAssignTagDialogOpen, setIsAssignTagDialogOpen] = useState(false);
  const [selectedTagInDialog, setSelectedTagInDialog] = useState<string | null>(null);
  const [isSubmittingTag, setIsSubmittingTag] = useState(false);
  const [isCreateTagDialogOpen, setIsCreateTagDialogOpen] = useState(false);
  const [selectedPrimaryTagId, setSelectedPrimaryTagId] = useState<string | null>(null);
  const {
    data: coes = [],
    isLoading,
    error,
    refetch
  } = useCOEData();
  const {
    data: availableTags = [],
    refetch: refetchTags
  } = useQuery({
    queryKey: ["coe-tags", userId],
    queryFn: async () => {
      try {
        const {
          data,
          error
        } = await supabase.from("tags").select("*").eq("entity_type", "COE");
        if (error) {
          toast({
            title: "Error fetching tags",
            description: error.message,
            variant: "destructive"
          });
          return [];
        }
        return data;
      } catch (error: any) {
        console.error("Error fetching tags:", error);
        return [];
      }
    },
    enabled: !isChecking
  });
  const {
    data: tagDetails = {}
  } = useQuery({
    queryKey: ["coe-tag-details"],
    queryFn: async () => {
      try {
        const {
          data,
          error
        } = await supabase.from("tags").select("id, label").eq("entity_type", "COE");
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
  const handleCloseModal = (shouldRefetch = false) => {
    setIsCreateModalOpen(false);
    setSelectedCOE(null);
    if (shouldRefetch) {
      refetch();
    }
  };
  const filteredCOEs = Array.isArray(coes) ? coes.filter(coe => {
    const matchesSearch = coe.name.toLowerCase().includes(searchQuery.toLowerCase()) || coe.description && coe.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAdditionalTags = selectedTags.length === 0 || coe.tags && selectedTags.every(tag => coe.tags.includes(tag));
    const matchesPrimaryTag = !selectedPrimaryTagId || coe.primary_tag_id === selectedPrimaryTagId;
    return matchesSearch && matchesAdditionalTags && matchesPrimaryTag;
  }) : [];
  const allAdditionalTags = Array.isArray(coes) ? Array.from(new Set(coes.flatMap(coe => coe.tags || []))) : [];
  const handleCreateCOE = () => {
    setSelectedCOE(null);
    setIsCreateModalOpen(true);
  };
  const handleEditCOE = (coe: COE) => {
    setSelectedCOE(coe);
    setIsCreateModalOpen(true);
  };
  const handleTagSelect = (tagId: string) => {
    if (tagId) {
      setSelectedTags(prev => prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]);
      setCurrentPage(1);
    }
  };
  const handleTagRemove = (tagId: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tagId));
    setCurrentPage(1);
  };
  const handleTagClear = () => {
    setSelectedTags([]);
    setCurrentPage(1);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const handlePrimaryTagSelect = (tagId: string) => {
    setSelectedPrimaryTagId(selectedPrimaryTagId === tagId ? null : tagId);
    setCurrentPage(1);
  };
  const handleTagSearch = (query: string) => {
    setSearchQuery(query);
  };
  const handleManageTags = (coe: COE, action: 'add' | 'remove') => {
    setSelectedCOE(coe);
    setTagDialogMode(action);
    const selections: Record<string, boolean> = {};
    if (action === 'add') {
      (allAdditionalTags || []).forEach(tag => {
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
  const handleAssignTag = (coe: COE) => {
    setSelectedCOE(coe);
    setSelectedTagInDialog(coe.primary_tag_id || "");
    setIsAssignTagDialogOpen(true);
  };
  const handleSaveTag = async () => {
    if (!selectedCOE) return;
    setIsSubmittingTag(true);
    try {
      const tagValue = selectedTagInDialog === "" ? null : selectedTagInDialog;
      const {
        error
      } = await supabase.from("class_of_elements").update({
        primary_tag_id: tagValue
      }).eq("id", selectedCOE.id);
      if (error) {
        console.error("Database error when updating tag:", error);
        throw error;
      }
      toast({
        title: "Tag updated",
        description: selectedTagInDialog ? "Tag has been assigned to the COE." : "Tag has been removed from the COE."
      });
      refetch();
      setIsAssignTagDialogOpen(false);
    } catch (error: any) {
      console.error("Error updating tag:", error);
      toast({
        title: "Error updating tag",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingTag(false);
    }
  };
  const handleSaveTags = async () => {
    if (!selectedCOE) return;
    try {
      const selectedTagsList = Object.entries(tagSelections).filter(([_, selected]) => selected).map(([tag]) => tag);
      let updatedTags: string[] = [...(selectedCOE.tags || [])];
      if (tagDialogMode === 'add') {
        updatedTags = [...new Set([...updatedTags, ...selectedTagsList])];
      } else {
        updatedTags = updatedTags.filter(tag => !selectedTagsList.includes(tag));
      }
      const {
        error
      } = await supabase.from("class_of_elements").update({
        tags: updatedTags
      }).eq("id", selectedCOE.id);
      if (error) throw error;
      toast({
        title: "Tags updated",
        description: tagDialogMode === 'add' ? "Tags have been added." : "Tags have been removed."
      });
      refetch();
      setIsTagDialogOpen(false);
    } catch (error) {
      console.error("Error updating tags:", error);
      toast({
        title: "Error updating tags",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  };
  const handleAddTag = () => {
    setIsCreateTagDialogOpen(true);
  };
  const handleTagCreated = (newTag: string) => {
    refetchTags();
    toast({
      title: "Tag created",
      description: `Tag "${newTag}" has been created successfully.`
    });
  };
  const handleManageTagsClick = () => {
    // This would open a tag management dialog or navigate to a tag management page
    toast({
      title: "Feature coming soon",
      description: "Tag management will be available in a future update."
    });
  };
  if (error) {
    return <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-500 mb-4">Error Loading Data</h2>
        <p className="mb-4">There was a problem loading the COE data.</p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>;
  }

  // Filter by Primary Tag section
  return <div className="space-y-6">
      {/* Updated header with integrated tag management row */}
      <COEHeader 
        onCreateCOE={handleCreateCOE} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        selectedTags={selectedTags} 
        tagDetails={tagDetails} 
        onTagSelect={handleTagSelect} 
        onTagRemove={handleTagRemove} 
        onTagClear={handleTagClear} 
        onTagSearch={handleTagSearch} 
        onAddTagClick={handleAddTag} 
        onSettingsClick={handleManageTagsClick} 
      />
      
      {/* Filter by Primary Tag section */}
      <PrimaryTagFilter 
        selectedTagId={selectedPrimaryTagId}
        onTagSelect={handlePrimaryTagSelect}
      />
      
      {isLoading ? <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00B86B]" />
        </div> : Array.isArray(coes) && coes.length === 0 ? <COEEmptyState onCreateFirst={() => setIsCreateModalOpen(true)} /> : <COEList coes={filteredCOEs} onEdit={handleEditCOE} onAssignTag={handleAssignTag} />}
      
      {isCreateModalOpen && <COEModal isOpen={isCreateModalOpen} onClose={handleCloseModal} coe={selectedCOE} onSave={async coe => {
      try {
        if (selectedCOE) {
          const {
            error
          } = await supabase.from("class_of_elements").update({
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
          const {
            error
          } = await supabase.from("class_of_elements").insert([{
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
    }} />}
      
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
            <Input placeholder="Search available tags..." className="mb-4" onChange={e => {
            setTagSearchQuery(e.target.value);
          }} />
            
            <div className="space-y-4 max-h-[300px] overflow-y-auto">
              {Object.entries(tagSelections).filter(([tag]) => tag.toLowerCase().includes(tagSearchQuery.toLowerCase())).map(([tag, isSelected]) => <div key={tag} className="flex items-center space-x-2">
                    <Checkbox id={`tag-${tag}`} checked={isSelected} onCheckedChange={checked => handleTagSelectionChange(tag, checked === true)} />
                    <label htmlFor={`tag-${tag}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {tag}
                    </label>
                  </div>)}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTagDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTags} className="bg-[#00B86B] hover:bg-[#00A25F]" disabled={Object.values(tagSelections).every(v => !v)}>
              {tagDialogMode === 'add' ? 'Add' : 'Remove'} Selected Tags
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAssignTagDialogOpen} onOpenChange={setIsAssignTagDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              Assign Tag to {selectedCOE?.name || ''}
            </DialogTitle>
            <DialogDescription>
              Select a tag to assign to this COE. Only one tag can be assigned as the primary tag.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Input placeholder="Filter tags..." className="mb-4" onChange={e => {
            // Filter tags functionality if needed
          }} />
            
            <RadioGroup value={selectedTagInDialog || ''} onValueChange={val => setSelectedTagInDialog(val)} className="space-y-3 max-h-[300px] overflow-y-auto">
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="tag-none" value="" />
                <Label htmlFor="tag-none">No tag (clear assignment)</Label>
              </div>
              
              {availableTags.map(tag => <div key={tag.id} className="flex items-center space-x-2">
                  <RadioGroupItem id={`tag-${tag.id}`} value={tag.id} />
                  <Label htmlFor={`tag-${tag.id}`}>{tag.label}</Label>
                </div>)}
            </RadioGroup>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignTagDialogOpen(false)} disabled={isSubmittingTag}>
              Cancel
            </Button>
            <Button onClick={handleSaveTag} className="bg-[#00B86B] hover:bg-[#00A25F]" disabled={isSubmittingTag}>
              {isSubmittingTag ? "Saving..." : "Assign Tag"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CreateTagDialog open={isCreateTagDialogOpen} onClose={() => setIsCreateTagDialogOpen(false)} onTagCreated={handleTagCreated} entityType="COE" />
    </div>;
};
export default COEManager;
