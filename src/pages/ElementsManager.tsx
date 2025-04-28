
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
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

// Define Element type
export interface Element {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  properties?: any;
  tags?: string[];
  coe_ids?: string[];
}

const ITEMS_PER_PAGE = 4;

const ElementsManager = () => {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [tagDialogMode, setTagDialogMode] = useState<'add' | 'remove'>('add');
  const [tagSelections, setTagSelections] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to access this page",
          variant: "destructive",
        });
        navigate("/auth");
      }
    };
    
    checkAuth();
  }, [navigate, toast]);

  // Fetch elements data with error handling
  const { data: elements = [], isLoading, error, refetch } = useQuery({
    queryKey: ["elements"],
    queryFn: async () => {
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
    },
  });

  // Fetch tags
  const { data: availableTags } = useQuery({
    queryKey: ["element-tags"],
    queryFn: async () => {
      const { data, error } = await supabase.from("elements").select("tags");
      if (error || !data) return [];
      const allTags = data.flatMap((item) => item.tags || []);
      return [...new Set(allTags)];
    },
  });

  const filteredElements = elements?.filter((element) => {
    const matchesSearch = element.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 ||
      (element.tags && selectedTags.every((tag) => element.tags.includes(tag)));
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

  const handleManageTags = (element: Element, action: 'add' | 'remove') => {
    setSelectedElement(element);
    setTagDialogMode(action);
    
    // Initialize tag selections
    const selections: Record<string, boolean> = {};
    
    if (action === 'add') {
      // For adding, show all available tags not currently on the element
      (availableTags || []).forEach(tag => {
        selections[tag] = false;
      });
    } else {
      // For removing, show only the element's current tags
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
    } catch (error) {
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Element Manager</h1>
          <Button onClick={() => handleOpenForm()} className="flex items-center gap-2 bg-[#00B86B] hover:bg-[#00A25F]">
            <Plus size={16} /> Add Element
          </Button>
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search elements..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {availableTags && availableTags.length > 0 && (
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-sm text-muted-foreground">Filter by tags:</span>
                {selectedTags.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAllTags}
                    className="h-7 px-2 text-xs"
                  >
                    Clear all
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer flex items-center gap-1"
                    onClick={() => handleTagSelect(tag)}
                  >
                    {tag}
                    {selectedTags.includes(tag) && (
                      <X
                        size={12}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClearTag(tag);
                        }}
                      />
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

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
        
        {/* Tags Management Dialog */}
        <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {tagDialogMode === 'add' ? 'Add Tags' : 'Remove Tags'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4 max-h-[300px] overflow-y-auto">
              {Object.keys(tagSelections).length === 0 ? (
                <div className="text-center text-muted-foreground">
                  {tagDialogMode === 'add' ? 'No tags available to add.' : 'No tags to remove.'}
                </div>
              ) : (
                Object.entries(tagSelections).map(([tag, isSelected]) => (
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
                ))
              )}
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
                disabled={Object.values(tagSelections).every(v => !v)}
              >
                {tagDialogMode === 'add' ? 'Add' : 'Remove'} Selected
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ElementsManager;
