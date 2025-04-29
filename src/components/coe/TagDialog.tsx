
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { COE } from "@/hooks/useCOEData";

interface TagDialogProps {
  isOpen: boolean;
  onClose: () => void;
  coe: COE | null;
  mode: 'add' | 'remove';
  tagSelections: Record<string, boolean>;
  onTagSelectionChange: (tag: string, checked: boolean) => void;
  onSave: () => Promise<void>;
}

const TagDialog = ({
  isOpen,
  onClose,
  coe,
  mode,
  tagSelections,
  onTagSelectionChange,
  onSave
}: TagDialogProps) => {
  const [tagSearchQuery, setTagSearchQuery] = useState("");
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Add Tags to' : 'Remove Tags from'} {coe?.name}
          </DialogTitle>
          <DialogDescription>
            Please select the tags you would like to {mode === 'add' ? 'add' : 'remove'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Input 
            placeholder="Search available tags..." 
            className="mb-4" 
            value={tagSearchQuery}
            onChange={e => setTagSearchQuery(e.target.value)} 
          />
          
          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {Object.entries(tagSelections)
              .filter(([tag]) => tag.toLowerCase().includes(tagSearchQuery.toLowerCase()))
              .map(([tag, isSelected]) => (
                <div key={tag} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`tag-${tag}`} 
                    checked={isSelected} 
                    onCheckedChange={checked => onTagSelectionChange(tag, checked === true)} 
                  />
                  <label 
                    htmlFor={`tag-${tag}`} 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {tag}
                  </label>
                </div>
              ))
            }
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            onClick={onSave} 
            className="bg-[#00B86B] hover:bg-[#00A25F]" 
            disabled={Object.values(tagSelections).every(v => !v)}
          >
            {mode === 'add' ? 'Add' : 'Remove'} Selected Tags
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TagDialog;
