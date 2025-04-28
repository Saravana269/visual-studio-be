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
import { Checkbox } from "@/components/ui/checkbox";

// Define Element type
export interface Element {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  properties?: Record<string, unknown>;
  tags?: string[];
  coe_ids?: string[];
}

const ITEMS_PER_PAGE = 4;

const ElementsManager = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Use the authentication hook
  useAuth();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [tagDialogMode, setTagDialogMode] = useState<'add' | 'remove'>('add');
  const [tagSelections, setTagSelections] = useState<Record<string, boolean>>({});
  
  // Fetch elements data with error handling
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

  // Fetch tags
  const { data: availableTags = [] } = useQuery({
    queryKey: ["element-tags"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from("elements").select("tags");
        if (error || !data) return [];
        const allTags = data.flatMap((item) => item.tags || []);
        return [...new Set(allTags)];
      } catch (error) {
        console.error("Error fetching tags:", error);
        return [];
      }
    },
  });

  // Filter elements based on search query and selected tags
  const filteredElements = elements?.filter((element) => {
    const matchesSearch = element.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 ||
      (element.tags && selectedTags.every((tag) => element.tags?.includes(tag)));
    return matchesSearch && matchesTags;
  });

  // Pagination logic
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

  const handleTagSelect = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleClearTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleClearAllTags = () => {
    setSelectedTags([]);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleTagSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleManageTags = (element: Element, action: 'add' | 'remove') => {
    setSelectedElement(element);
    setTagDialogMode(action);
    
    const selections: Record<string, boolean> = {};
    
    if (action === 'add') {
      (availableTags || []).forEach(tag => {
        selections[tag] = false;
      });
    } else {
      (element.tags || []).forEach(tag => {
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
    if (!selectedElement) return;
    
    try {
      const selectedTagsList = Object.entries(tagSelections)
        .filter(([_, selected]) => selected)
        .map(([tag]) => tag);
      
      let updatedTags: string[] = [...(selectedElement.tags || [])];
      
      if (tagDialogMode === 'add') {
        // Add new tags
        updatedTags = [...new Set([...updatedTags, ...selectedTagsList])];
      } else {
        // Remove selected tags
        updatedTags = updatedTags.filter(tag => !selectedTagsList.includes(tag));
      }
      
      const { error } = await supabase
        .from("elements")
        .update({ tags: updatedTags })
        .eq("id", selectedElement.id);
        
      if (error) throw error;
      
      toast({
        title: "Tags updated",
        description: tagDialogMode === 'add' ? "Tags have been added." : "Tags have been removed.",
      });
      
      refetch();
      setIsTagDialogOpen(false);
    } catch (error: any) {
      console.error("Error updating tags:", error);
      toast({
        title: "Error updating tags",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex">
      <div className="flex-1">
        {/* Header Row */}
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

        {/* Tag Management Row */}
        <div className="mb-6">
          <TagManagementRow
            selectedTags={selectedTags}
            onTagSearch={handleTagSearch}
            onTagRemove={handleClearTag}
            onAddTagClick={() => selectedElement && handleManageTags(selectedElement, 'add')}
            onManageTagsClick={() => {/* Implement tag management */}}
          />
        </div>

        {/* Element List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#00B86B]" />
          </div>
        ) : (
          <>
            <ElementList
              elements={paginatedElements || []}
              onEdit={handleOpenForm}
              onViewDetails={handleViewDetails}
              onManageTags={handleManageTags}
            />
            
            {/* Pagination controls */}
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

        {/* Dialogs */}
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
        
        {/* Tag Management Dialog */}
        <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {tagDialogMode === 'add' ? 'Add Tags to' : 'Remove Tags from'} {selectedElement?.name || ''}
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
                  // Implement tag search within modal
                }}
              />
              
              <div className="space-y-4 max-h-[300px] overflow-y-auto">
                {Object.entries(tagSelections).map(([tag, isSelected]) => (
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
    </div>
  );
};

export default ElementsManager;
