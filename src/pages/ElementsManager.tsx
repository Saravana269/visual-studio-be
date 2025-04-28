
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus, Search, X, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ElementList } from "@/components/elements/ElementList";
import { ElementFormDialog } from "@/components/elements/ElementFormDialog";
import { ElementSidebar } from "@/components/elements/ElementSidebar";
import { TagManagementRow } from "@/components/elements/TagManagementRow";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreateTagDialog } from "@/components/elements/CreateTagDialog";

export interface Element {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  properties?: Record<string, unknown>;
  primary_tag_id?: string;
  coe_ids?: string[];
}

interface Tag {
  id: string;
  label: string;
  entity_type: string;
}

const ITEMS_PER_PAGE = 4;

const ElementsManager = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { session, isChecking } = useAuth();
  const userId = session?.user?.id;
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [selectedTagInDialog, setSelectedTagInDialog] = useState<string | null>(null);
  const [isCreateTagDialogOpen, setIsCreateTagDialogOpen] = useState(false);
  const [isSubmittingTag, setIsSubmittingTag] = useState(false);
  
  // Fetch elements with their associated tags
  const { data: elements = [], isLoading, error, refetch } = useQuery({
    queryKey: ["elements"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("elements")
          .select("*");

        if (error) {
          console.error("Error fetching elements:", error);
          toast({
            title: "Error fetching elements",
            description: error.message,
            variant: "destructive",
          });
          return [];
        }

        return data as Element[];
      } catch (error: any) {
        console.error("Error fetching elements:", error);
        return [];
      }
    },
  });

  // Fetch all available tags
  const { data: availableTags = [], refetch: refetchTags } = useQuery({
    queryKey: ["element-tags", userId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("tags")
          .select("*")
          .eq("entity_type", "Element");
          
        if (error) {
          toast({
            title: "Error fetching tags",
            description: error.message,
            variant: "destructive",
          });
          return [];
        }
        
        return data as Tag[];
      } catch (error: any) {
        console.error("Error fetching tags:", error);
        return [];
      }
    },
    enabled: !isChecking // Only run once we've checked authentication
  });

  // Fetch tag details for element filtering
  const { data: tagDetails = {} } = useQuery({
    queryKey: ["tag-details"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("tags")
          .select("id, label");
          
        if (error) {
          console.error("Error fetching tag details:", error);
          return {};
        }
        
        // Convert to a map of id -> label for easier lookup
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

  // Filter elements based on search query and selected tag
  const filteredElements = elements?.filter((element) => {
    const matchesSearch = element.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (element.description && element.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // If a tag is selected, filter by that tag
    const matchesTag = !selectedTagId || element.primary_tag_id === selectedTagId;
    
    return matchesSearch && matchesTag;
  });

  const totalPages = Math.ceil((filteredElements?.length || 0) / ITEMS_PER_PAGE);
  const paginatedElements = filteredElements?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleOpenForm = (element?: Element) => {
    setSelectedElement(element || null);
    setIsFormOpen(true);
  };

  const handleViewDetails = (element: Element) => {
    setSelectedElement(element);
    setSidePanelOpen(true);
  };

  const handleCloseForm = (shouldRefresh: boolean = false) => {
    setIsFormOpen(false);
    setSelectedElement(null);
    if (shouldRefresh) {
      refetch();
    }
  };

  const handleCloseSidebar = () => {
    setSidePanelOpen(false);
    setSelectedElement(null);
  };

  const handleTagSelect = (tagId: string) => {
    setSelectedTagId(selectedTagId === tagId ? null : tagId);
    setCurrentPage(1); // Reset to first page when changing filters
  };

  const handleClearTagFilter = () => {
    setSelectedTagId(null);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleTagSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAssignTag = (element: Element) => {
    setSelectedElement(element);
    setSelectedTagInDialog(element.primary_tag_id || null);
    setIsTagDialogOpen(true);
  };

  const handleSaveTag = async () => {
    if (!selectedElement) return;
    setIsSubmittingTag(true);
    
    try {
      // Convert empty string to null for the primary_tag_id field
      const tagValue = selectedTagInDialog === "" ? null : selectedTagInDialog;
      
      console.log("Updating element tag with value:", tagValue);
      
      const { error } = await supabase
        .from("elements")
        .update({ primary_tag_id: tagValue })
        .eq("id", selectedElement.id);
        
      if (error) {
        console.error("Database error when updating tag:", error);
        throw error;
      }
      
      toast({
        title: "Tag updated",
        description: selectedTagInDialog 
          ? "Tag has been assigned to the element." 
          : "Tag has been removed from the element."
      });
      
      // Refresh the elements data to show the updated tag
      refetch();
      setIsTagDialogOpen(false);
    } catch (error: any) {
      console.error("Error updating tag:", error);
      toast({
        title: "Error updating tag",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingTag(false);
    }
  };

  const handleAddTag = () => {
    setIsCreateTagDialogOpen(true);
  };

  const handleTagCreated = (newTag: string) => {
    refetchTags();
    toast({
      title: "Tag created",
      description: `Tag "${newTag}" has been created successfully.`,
    });
  };
  
  // Get the label for the currently selected tag
  const selectedTagLabel = selectedTagId ? tagDetails[selectedTagId] : null;

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search elements..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => handleOpenForm()} className="flex items-center gap-2 bg-[#00B86B] hover:bg-[#00A25F]">
            <Plus size={16} /> Add Element
          </Button>
        </div>

        <div className="mb-6">
          <TagManagementRow
            selectedTag={selectedTagId}
            tagDetails={tagDetails}
            onTagSelect={handleTagSelect}
            onTagClear={handleClearTagFilter}
            onTagSearch={handleTagSearch}
            onAddTagClick={handleAddTag}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#00B86B]" />
          </div>
        ) : (
          <>
            <ElementList
              elements={paginatedElements || []}
              tagDetails={tagDetails}
              onEdit={handleOpenForm}
              onViewDetails={handleViewDetails}
              onAssignTag={handleAssignTag}
            />
            
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={16} />
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            )}
          </>
        )}

        {isFormOpen && (
          <ElementFormDialog
            element={selectedElement}
            open={isFormOpen}
            onClose={handleCloseForm}
          />
        )}

        {selectedElement && (
          <ElementSidebar
            element={selectedElement}
            open={sidePanelOpen}
            onClose={handleCloseSidebar}
            onEdit={() => handleOpenForm(selectedElement)}
          />
        )}
        
        <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                Assign Tag to {selectedElement?.name || ''}
              </DialogTitle>
              <DialogDescription>
                Select a tag to assign to this element. Only one tag can be assigned at a time.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <Input
                placeholder="Filter tags..."
                className="mb-4"
                onChange={(e) => {
                  // Filter tags in the dialog (can be implemented if needed)
                }}
              />
              
              <RadioGroup
                value={selectedTagInDialog || ''}
                onValueChange={setSelectedTagInDialog}
                className="space-y-3 max-h-[300px] overflow-y-auto"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="tag-none" value="" />
                  <Label htmlFor="tag-none">No tag (clear assignment)</Label>
                </div>
                
                {availableTags.map((tag) => (
                  <div key={tag.id} className="flex items-center space-x-2">
                    <RadioGroupItem id={`tag-${tag.id}`} value={tag.id} />
                    <Label htmlFor={`tag-${tag.id}`}>{tag.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsTagDialogOpen(false)}
                disabled={isSubmittingTag}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveTag}
                className="bg-[#00B86B] hover:bg-[#00A25F]"
                disabled={isSubmittingTag}
              >
                {isSubmittingTag ? "Saving..." : "Assign Tag"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <CreateTagDialog
          open={isCreateTagDialogOpen}
          onClose={() => setIsCreateTagDialogOpen(false)}
          onTagCreated={handleTagCreated}
        />
      </div>
    </div>
  );
};

export default ElementsManager;
