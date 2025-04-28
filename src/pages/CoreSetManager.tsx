import { useState } from "react";
import CoreSetHeader from "@/components/core-set/CoreSetHeader";
import CoreSetList from "@/components/core-set/CoreSetList";
import { CoreSetModal } from "@/components/core-set/CoreSetModal";
import { TagManagementRow } from "@/components/elements/TagManagementRow";
import COETagSearch from "@/components/coe/COETagSearch";
import { useCoreSetData } from "@/hooks/useCoreSetData";
import type { CoreSet } from "@/hooks/useCoreSetData";
import { CoreSetCOEAssignment } from "@/components/core-set/CoreSetCOEAssignment";
import { useAuth } from "@/hooks/useAuth";

const CoreSetManager = () => {
  useAuth();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCoreSet, setSelectedCoreSet] = useState<CoreSet | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const { data: coreSets = [], isLoading } = useCoreSetData();
  
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
  
  const handleView = (coreSet: CoreSet) => {
    setSelectedCoreSet(coreSet);
    setIsDetailsOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setSelectedCoreSet(null);
  };
  
  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedCoreSet(null);
  };
  
  const filteredCoreSets = coreSets.filter(coreSet => {
    const matchesSearch = coreSet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (coreSet.description || '').toLowerCase().includes(searchQuery.toLowerCase());
                         
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
        onView={handleView}
        onMapping={() => {}}
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
