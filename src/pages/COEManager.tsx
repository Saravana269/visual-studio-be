import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Search, Plus, LayoutGrid, List, Tag, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// Components
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import COEModal from "@/components/coe/COEModal";
import COESidebar from "@/components/coe/COESidebar";
import COEEmptyState from "@/components/coe/COEEmptyState";
import COETable from "@/components/coe/COETable";

// Types
interface COE {
  id: string;
  name: string;
  description: string | null;
  tags: string[] | null;
  image_url?: string | null;
  element_count?: number;
}

const COEManager = () => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCOE, setEditingCOE] = useState<COE | null>(null);
  const [selectedCOE, setSelectedCOE] = useState<COE | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Fetch all unique tags for filtering
  const { data: allTags = [] } = useQuery({
    queryKey: ["coe-tags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("class_of_elements")
        .select("tags");
      
      if (error) {
        console.error("Error fetching tags:", error);
        return [];
      }
      
      // Extract unique tags
      const uniqueTags = new Set<string>();
      data.forEach(item => {
        if (item.tags && Array.isArray(item.tags)) {
          item.tags.forEach(tag => uniqueTags.add(tag));
        }
      });
      
      return Array.from(uniqueTags);
    }
  });
  
  // Fetch COEs and associated element counts
  const { data: coes = [], isLoading, refetch } = useQuery({
    queryKey: ["coes"],
    queryFn: async () => {
      // First fetch all COEs
      const { data: coesData, error: coesError } = await supabase
        .from("class_of_elements")
        .select("*");
      
      if (coesError) {
        console.error("Error fetching COEs:", coesError);
        return [];
      }
      
      if (!coesData) {
        return [];
      }
      
      // Then for each COE, count associated elements
      const coesWithCounts = await Promise.all(
        coesData.map(async (coe) => {
          const { count, error: countError } = await supabase
            .from("elements")
            .select("id", { count: "exact", head: true })
            .contains("coe_ids", [coe.id]);
          
          return {
            ...coe,
            element_count: count || 0
          };
        })
      );
      
      return coesWithCounts;
    }
  });
  
  // Ensure coes is always an array before filtering
  const filteredCOEs = Array.isArray(coes) ? coes.filter(coe => {
    // Filter by search query
    const matchesQuery = searchQuery === "" ||
      coe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (coe.description && coe.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
    // Filter by selected tags
    const matchesTags = selectedTags.length === 0 ||
      (coe.tags && selectedTags.every(tag => coe.tags.includes(tag)));
      
    return matchesQuery && matchesTags;
  }) : [];
  
  // Handle opening the modal for creating/editing
  const handleOpenModal = (coe?: COE) => {
    if (coe) {
      setEditingCOE(coe);
    } else {
      setEditingCOE(null);
    }
    setIsModalOpen(true);
  };
  
  // Handle saving a COE
  const handleSaveCOE = async (coe: Omit<COE, "id" | "element_count">) => {
    try {
      let result;
      
      if (editingCOE) {
        // Update existing COE
        result = await supabase
          .from("class_of_elements")
          .update({
            name: coe.name,
            description: coe.description,
            tags: coe.tags,
            image_url: coe.image_url,
          })
          .eq("id", editingCOE.id);
          
        toast({
          title: "COE Updated",
          description: `${coe.name} has been updated successfully.`
        });
      } else {
        // Create new COE
        result = await supabase
          .from("class_of_elements")
          .insert({
            name: coe.name,
            description: coe.description,
            tags: coe.tags,
            image_url: coe.image_url,
          });
          
        toast({
          title: "COE Created",
          description: `${coe.name} has been created successfully.`
        });
      }
      
      // Check for errors
      if (result.error) {
        throw result.error;
      }
      
      // Refetch data and close modal
      refetch();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving COE:", error);
      toast({
        title: "Error",
        description: "Failed to save Class of Elements.",
        variant: "destructive"
      });
    }
  };
  
  // Handle opening the sidebar for COE details
  const handleViewCOE = (coe: COE) => {
    setSelectedCOE(coe);
    setIsSidebarOpen(true);
  };
  
  // Handle tag selection for filtering
  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  // Clear all selected tags
  const clearTagFilters = () => {
    setSelectedTags([]);
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Class of Elements Manager</h1>
        
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setViewMode("grid")}>
            <LayoutGrid className={viewMode === "grid" ? "text-primary" : "text-muted-foreground"} size={18} />
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setViewMode("list")}>
            <List className={viewMode === "list" ? "text-primary" : "text-muted-foreground"} size={18} />
          </Button>
          <Button className="ml-2" onClick={() => handleOpenModal()}>
            <Plus size={18} className="mr-1" />
            Add COE
          </Button>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search COEs..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Tag filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <Tag size={16} className="text-muted-foreground mr-1" />
            {allTags.map(tag => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer transition-colors"
                onClick={() => handleTagSelect(tag)}
              >
                {tag}
              </Badge>
            ))}
            {selectedTags.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearTagFilters}>
                <X size={14} className="mr-1" />
                Clear
              </Button>
            )}
          </div>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : filteredCOEs.length === 0 ? (
        Array.isArray(coes) && coes.length === 0 ? (
          <COEEmptyState onCreateFirst={() => handleOpenModal()} />
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No COEs match the current filters</p>
            <Button variant="outline" className="mt-4" onClick={clearTagFilters}>
              Clear filters
            </Button>
          </div>
        )
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCOEs.map((coe) => (
            <Card 
              key={coe.id} 
              className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
              onClick={() => handleViewCOE(coe)}
            >
              {coe.image_url && (
                <div className="h-40 overflow-hidden">
                  <img 
                    src={coe.image_url} 
                    alt={coe.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span className="line-clamp-1">{coe.name}</span>
                  <Badge>{coe.element_count} Elements</Badge>
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {coe.description || "No description provided"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {coe.tags && coe.tags.length > 0 ? (
                    coe.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">No tags</span>
                  )}
                  {coe.tags && coe.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{coe.tags.length - 3} more
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModal(coe);
                  }}
                >
                  Edit
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <COETable 
          coes={filteredCOEs} 
          onEdit={handleOpenModal} 
          onView={handleViewCOE} 
        />
      )}
      
      {/* Create/Edit Modal */}
      <COEModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCOE}
        coe={editingCOE}
      />
      
      {/* COE Details Sidebar */}
      <COESidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        coe={selectedCOE}
        onUpdate={() => {
          if (selectedCOE) {
            handleOpenModal(selectedCOE);
          }
        }}
        onSave={(updatedCOE) => {
          if (updatedCOE) {
            handleSaveCOE(updatedCOE);
            setIsSidebarOpen(false);
          }
        }}
      />
    </div>
  );
};

export default COEManager;
