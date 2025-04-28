import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import COEModal from "@/components/coe/COEModal";
import COETable from "@/components/coe/COETable";
import COESidebar from "@/components/coe/COESidebar";
import COEEmptyState from "@/components/coe/COEEmptyState";

interface COE {
  id: string;
  name: string;
  description: string | null;
  tags: string[] | null;
  element_count?: number;
}

const COEManager = () => {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCOE, setSelectedCOE] = useState<COE | null>(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
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
  
  // Fetch COEs and their element counts with proper error handling
  const { data: coes = [], isLoading, error, refetch } = useQuery({
    queryKey: ["coes"],
    queryFn: async () => {
      try {
        const { data: coesData, error: coesError } = await supabase
          .from("class_of_elements")
          .select("*");
        
        if (coesError) {
          toast({
            title: "Error fetching COEs",
            description: coesError.message,
            variant: "destructive",
          });
          return [];
        }
        
        if (!coesData || !Array.isArray(coesData)) {
          console.error("COEs data is not an array:", coesData);
          return [];
        }
        
        // Get element counts for each COE
        const coesWithCounts = await Promise.all(
          coesData.map(async (coe) => {
            try {
              const { count } = await supabase
                .from("elements")
                .select("*", { count: 'exact' })
                .contains('coe_ids', [coe.id]);
              
              return {
                ...coe,
                element_count: count || 0
              };
            } catch (error) {
              console.error(`Error getting element count for COE ${coe.id}:`, error);
              return {
                ...coe,
                element_count: 0
              };
            }
          })
        );
        
        return coesWithCounts;
      } catch (error) {
        console.error("Unexpected error in COE query:", error);
        return [];
      }
    },
  });

  // Filter COEs based on search query and selected tags
  const filteredCOEs = coes.filter((coe) => {
    const matchesSearch = coe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (coe.description && coe.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTags =
      selectedTags.length === 0 ||
      (coe.tags && selectedTags.every((tag) => coe.tags.includes(tag)));
    return matchesSearch && matchesTags;
  });

  // Get unique tags from all COEs
  const allTags = Array.from(new Set(coes.flatMap((coe) => coe.tags || [])));

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">COE Manager</h1>
        <div className="flex items-center gap-4">
          <div className="flex border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="rounded-none border-0"
            >
              <LayoutGrid size={18} />
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('table')}
              className="rounded-none border-0"
            >
              <List size={18} />
            </Button>
          </div>
          <Button onClick={handleCreateCOE} className="flex items-center gap-2 bg-[#00B86B] hover:bg-[#00A25F]">
            <Plus size={16} /> Create COE
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search COEs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleTagSelect(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00B86B]" />
        </div>
      ) : coes.length === 0 ? (
        <COEEmptyState onCreateFirst={handleCreateCOE} />
      ) : (
        <COETable
          coes={filteredCOEs}
          onEdit={handleEditCOE}
          onView={handleViewCOE}
        />
      )}
      
      {isCreateModalOpen && (
        <COEModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseModal}
          onSave={async (coe) => {
            try {
              if (selectedCOE) {
                // Update existing COE
                const { error } = await supabase
                  .from("class_of_elements")
                  .update({
                    name: coe.name,
                    description: coe.description,
                    tags: coe.tags,
                  })
                  .eq("id", selectedCOE.id);
                
                if (error) throw error;
                
                toast({
                  title: "COE updated",
                  description: `${coe.name} has been updated successfully.`,
                });
              } else {
                // Create new COE
                const { error } = await supabase
                  .from("class_of_elements")
                  .insert([{
                    name: coe.name,
                    description: coe.description,
                    tags: coe.tags,
                  }]);
                
                if (error) throw error;
                
                toast({
                  title: "COE created",
                  description: `${coe.name} has been created successfully.`,
                });
              }
              
              handleCloseModal(true);
            } catch (error: any) {
              toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
              });
            }
          }}
          coe={selectedCOE}
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
                })
                .eq("id", updatedCOE.id);
              
              if (error) throw error;
              
              toast({
                title: "COE updated",
                description: `${updatedCOE.name} has been updated successfully.`,
              });
              
              refetch();
            } catch (error: any) {
              toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
              });
            }
          }}
        />
      )}
    </div>
  );
};

export default COEManager;
