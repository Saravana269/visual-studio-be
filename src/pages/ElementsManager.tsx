
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ElementList } from "@/components/elements/ElementList";
import { ElementFormDialog } from "@/components/elements/ElementFormDialog";
import { ElementSidebar } from "@/components/elements/ElementSidebar";

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

const ElementsManager = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { toast } = useToast();

  // Fetch elements data
  const { data: elements, isLoading, refetch } = useQuery({
    queryKey: ["elements"],
    queryFn: async () => {
      const { data, error } = await supabase.from("elements").select("*");
      if (error) {
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

  return (
    <div className="flex">
      {/* Sidebar already handled separately in AppSidebar */}

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Element Manager</h1>
          <Button onClick={() => handleOpenForm()} className="flex items-center gap-2">
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
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <ElementList
            elements={filteredElements || []}
            onEdit={handleOpenForm}
            onViewDetails={handleViewDetails}
          />
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
      </div>
    </div>
  );
};

export default ElementsManager;
