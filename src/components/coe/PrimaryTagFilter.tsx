
// This is a placeholder component that will be fully removed in a later refactoring
// Currently just resolving TypeScript errors while we transition away from this component
import React from 'react';

interface PrimaryTagFilterProps {
  selectedTagId: string | null;
  onTagSelect: (tagId: string) => void;
}

const PrimaryTagFilter: React.FC<PrimaryTagFilterProps> = () => {
  // This component is being phased out and will be removed
  return null;
};

export default PrimaryTagFilter;
