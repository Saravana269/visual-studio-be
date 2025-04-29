
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ElementList } from "@/components/elements/ElementList";
import { ElementFormDialog } from "@/components/elements/ElementFormDialog";
import { ElementSidebar } from "@/components/elements/ElementSidebar";
import { ElementSearch } from "@/components/elements/ElementSearch";
import { ElementPagination } from "@/components/elements/ElementPagination";
import { AssignTagDialog } from "@/components/elements/AssignTagDialog";
import { CreateTagDialog } from "@/components/elements/CreateTagDialog";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export interface Element {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  properties?: Record<string, unknown>;
  primary_tag_id?: string;
  coe_ids?: string[];
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
  
  // Fetch elements data
  const { data: elements = [], isLoading, refetch } = useQuery({
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

  // Fetch tags data
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
        
        return data;
      } catch (error: any) {
        console.error("Error fetching tags:", error);
        return [];
      }
    },
    enabled: !isChecking
  });

  // Fetch tag details
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

  // Filter and paginate elements
  const filteredElements = elements?.filter((element) => {
    const matchesSearch = element.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (element.description && element.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (selectedTagId) {
      const matchesTag = element.primary_tag_id === selectedTagId;
      return matchesSearch && matchesTag;
    }
    
    return matchesSearch;
  });

  const totalPages = Math.ceil((filteredElements?.length || 0) / ITEMS_PER_PAGE);
  const paginatedElements = filteredElements?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Element form handlers
  const handleOpenForm = (element?: Element) => {
    setSelectedElement(element || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = (shouldRefresh: boolean = false) => {
    setIsFormOpen(false);
    setSelectedElement(null);
    if (shouldRefresh) {
      refetch();
    }
  };

  // Sidebar handlers
  const handleViewDetails = (element: Element) => {
    setSelectedElement(element);
    setSidePanelOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidePanelOpen(false);
    setSelectedElement(null);
  };

  // Tag handlers
  const handleTagSelect = (tagId: string) => {
    setSelectedTagId(selectedTagId === tagId ? null : tagId);
    setCurrentPage(1);
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

  const handleTagInDialogSelect = (tagId: string | null) => {
    setSelectedTagInDialog(tagId);
  };

  const handleSaveTag = async () => {
    if (!selectedElement) return;
    setIsSubmittingTag(true);
    
    try {
      const tagValue = selectedTagInDialog === null ? null : selectedTagInDialog;
      
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

  return (
    <div className="flex">
      <div className="flex-1">
        {/* Search and filter section */}
        <ElementSearch 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedTagId={selectedTagId}
          tagDetails={tagDetails}
          onAddElementClick={() => handleOpenForm()}
          onTagSelect={handleTagSelect}
          onTagClear={handleClearTagFilter}
          onTagSearch={handleTagSearch}
          onAddTagClick={handleAddTag}
        />

        {/* Elements list or loading indicator */}
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
            
            <ElementPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}

        {/* Modals and sidebars */}
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
        
        <AssignTagDialog
          open={isTagDialogOpen}
          onClose={() => setIsTagDialogOpen(false)}
          element={selectedElement}
          availableTags={availableTags}
          selectedTagId={selectedTagInDialog}
          onTagSelect={handleTagInDialogSelect}
          onSaveTag={handleSaveTag}
          isSubmitting={isSubmittingTag}
        />
        
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
