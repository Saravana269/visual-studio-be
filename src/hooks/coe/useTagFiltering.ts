
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const useTagFiltering = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Handle tag selection/filtering
  const handleTagSelect = (tagId: string) => {
    if (tagId) {
      setSelectedTags(prev => prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]);
      setCurrentPage(1);
    }
  };
  
  const handleTagRemove = (tagId: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tagId));
    setCurrentPage(1);
  };
  
  const handleTagClear = () => {
    setSelectedTags([]);
    setCurrentPage(1);
  };
  
  const handleTagCreated = (newTag: string) => {
    toast({
      title: "Tag created",
      description: `Tag "${newTag}" has been created successfully.`
    });
  };
  
  return {
    searchQuery,
    setSearchQuery,
    selectedTags,
    setSelectedTags,
    currentPage,
    setCurrentPage,
    handleTagSelect,
    handleTagRemove,
    handleTagClear,
    handleTagCreated,
  };
};
