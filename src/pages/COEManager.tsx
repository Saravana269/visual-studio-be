
import { useState } from "react";
import { useCOEData } from "@/hooks/useCOEData";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import COEModal from "@/components/coe/COEModal";
import COESidebar from "@/components/coe/COESidebar";
import COEEmptyState from "@/components/coe/COEEmptyState";
import COEList from "@/components/coe/COEList";
import COEHeader from "@/components/coe/COEHeader";
import COESearch from "@/components/coe/COESearch";
import type { COE } from "@/hooks/useCOEData";

const COEManager = () => {
  const { toast } = useToast();
  useAuth();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCOE, setSelectedCOE] = useState<COE | null>(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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
      <COEHeader onCreateCOE={handleCreateCOE} />
      
      <COESearch
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
        <COEEmptyState onCreateFirst={handleCreateCOE} />
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
          coe={selectedCOE}
        />
      )}
      
      {selectedCOE && (
        <COESidebar
          isOpen={sidePanelOpen}
          onClose={handleCloseSidebar}
          coe={selectedCOE}
          onUpdate={refetch}
        />
      )}
    </div>
  );
};

export default COEManager;
