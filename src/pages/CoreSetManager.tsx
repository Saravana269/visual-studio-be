
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import CoreSetHeader from "@/components/core-set/CoreSetHeader";
import CoreSetList from "@/components/core-set/CoreSetList";
import { CoreSetModal } from "@/components/core-set/CoreSetModal";
import { TagManagementRow } from "@/components/elements/TagManagementRow";
import COETagSearch from "@/components/coe/COETagSearch";
import { useCoreSetData } from "@/hooks/useCoreSetData";
import type { CoreSet } from "@/hooks/useCoreSetData";

const CoreSetManager = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCoreSet, setSelectedCoreSet] = useState<CoreSet | null>(null);
  
  const queryClient = useQueryClient();
  const { data: coreSets = [], isLoading } = useCoreSetData();
  
  // Get unique tags from all core sets
  const allTags = Array.from(
    new Set(coreSets.flatMap(coreSet => coreSet.tags || []))
  ).sort();
  
  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  
  const handleEdit = (coreSet: CoreSet) => {
    setSelectedCoreSet(coreSet);
    setIsCreateModalOpen(true);
  };
  
  const handleCloseModal = (refreshList?: boolean) => {
    setIsCreateModalOpen(false);
    setSelectedCoreSet(null);
    if (refreshList) {
      queryClient.invalidateQueries({ queryKey: ["core-sets"] });
    }
  };
  
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["core-sets"] });
  };
  
  // Filter core sets based on search and tags
  const filteredCoreSets = coreSets.filter(coreSet => {
    const matchesSearch = coreSet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (coreSet.description?.toLowerCase() || "").includes(searchQuery.toLowerCase());
                         
    const matchesTags = selectedTags.length === 0 ||
                       selectedTags.every(tag => coreSet.tags?.includes(tag));
                       
    return matchesSearch && matchesTags;
  });
  
  if (isLoading) {
    return <div className="p-8 text-center">Loading Core Sets...</div>;
  }
  
  return (
    <div className="space-y-6">
      <CoreSetHeader 
        onCreateCoreSet={() => setIsCreateModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <div className="mb-6">
        <TagManagementRow
          selectedTags={selectedTags}
          onTagSearch={(query: string) => setSearchQuery(query)}
          onTagRemove={(tag: string) => {
            setSelectedTags((prev) => prev.filter((t) => t !== tag));
          }}
          onAddTagClick={() => {}}
          onManageTagsClick={() => {}}
        />
        
        <COETagSearch
          selectedTags={selectedTags}
          allTags={allTags}
          onTagSelect={handleTagSelect}
        />
      </div>
      
      <CoreSetList
        coreSets={filteredCoreSets}
        onEdit={handleEdit}
        onView={handleRefresh}
      />
      
      <CoreSetModal
        open={isCreateModalOpen}
        onClose={handleCloseModal}
        coreSet={selectedCoreSet}
      />
    </div>
  );
};

export default CoreSetManager;
