import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TagManagerProps {
  initialTags: string[];
  onChange: (tags: string[]) => void;
  entityType?: string; // Make this prop optional
}

const TagManager: React.FC<TagManagerProps> = ({ initialTags = [], onChange, entityType = 'element' }) => {
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

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-white">Tag Manager</h2>
      
      <div className="flex gap-2">
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add new tag"
          className="bg-[#121212] border-[#222222] text-white"
        />
        <Button 
          onClick={addTag} 
          variant="outline" 
          size="icon"
          className="bg-[#121212] border-[#222222] hover:bg-[#00B86B] hover:text-white transition-colors"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge 
            key={tag}
            className="bg-[#222222] hover:bg-[#333333] text-white py-1 px-3 flex items-center gap-1"
          >
            {tag}
            <button 
              onClick={() => removeTag(tag)} 
              className="ml-1 rounded-full hover:bg-[#333] p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        {tags.length === 0 && (
          <p className="text-gray-500 text-sm">No tags added yet</p>
        )}
      </div>
    </div>
  );
};

export default TagManager;
