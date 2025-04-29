import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EntityType } from './elements/TagManagementRow';
interface TagManagerProps {
  initialTags: string[];
  onChange: (tags: string[]) => void;
  entityType?: EntityType;
}
const TagManager: React.FC<TagManagerProps> = ({
  initialTags = [],
  onChange,
  entityType = "Element"
}) => {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [newTag, setNewTag] = useState<string>('');
  const addTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      const updatedTags = [...tags, trimmedTag];
      setTags(updatedTags);
      setNewTag('');
      onChange(updatedTags);
    }
  };
  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    onChange(updatedTags);
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };
  return;
};
export default TagManager;