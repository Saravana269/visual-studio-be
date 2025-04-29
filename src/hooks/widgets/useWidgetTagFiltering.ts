
export function useWidgetTagFiltering() {
  // Handle tag selection for filtering
  const handleTagSelect = (selectedTagIds: string[], tagId: string) => {
    if (!selectedTagIds.includes(tagId)) {
      return [...selectedTagIds, tagId];
    }
    return selectedTagIds;
  };

  // Handle tag removal for filtering
  const handleTagRemove = (selectedTagIds: string[], tagId: string) => {
    return selectedTagIds.filter(id => id !== tagId);
  };

  // Handle clearing all selected tags
  const handleTagClear = () => {
    return [];
  };

  return {
    handleTagSelect,
    handleTagRemove,
    handleTagClear
  };
}
