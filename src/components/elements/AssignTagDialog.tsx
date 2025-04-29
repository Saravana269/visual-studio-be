
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Element } from "@/pages/ElementsManager";

interface Tag {
  id: string;
  label: string;
  entity_type: string;
}

interface AssignTagDialogProps {
  open: boolean;
  onClose: () => void;
  element: Element | null;
  availableTags: Tag[];
  selectedTagId: string | null;
  onTagSelect: (tagId: string | null) => void;
  onSaveTag: () => Promise<void>;
  isSubmitting: boolean;
}

export const AssignTagDialog: React.FC<AssignTagDialogProps> = ({
  open,
  onClose,
  element,
  availableTags,
  selectedTagId,
  onTagSelect,
  onSaveTag,
  isSubmitting
}) => {
  const [filterQuery, setFilterQuery] = useState("");
  
  const filteredTags = filterQuery
    ? availableTags.filter(tag => 
        tag.label.toLowerCase().includes(filterQuery.toLowerCase()))
    : availableTags;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Assign Tag to {element?.name || ''}
          </DialogTitle>
          <DialogDescription>
            Select a tag to assign to this element. Only one tag can be assigned at a time.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Input
            placeholder="Filter tags..."
            className="mb-4"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
          />
          
          <RadioGroup
            value={selectedTagId || ''}
            onValueChange={(val) => onTagSelect(val === '' ? null : val)}
            className="space-y-3 max-h-[300px] overflow-y-auto"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem id="tag-none" value="" />
              <Label htmlFor="tag-none">No tag (clear assignment)</Label>
            </div>
            
            {filteredTags.map((tag) => (
              <div key={tag.id} className="flex items-center space-x-2">
                <RadioGroupItem id={`tag-${tag.id}`} value={tag.id} />
                <Label htmlFor={`tag-${tag.id}`}>{tag.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={onSaveTag}
            className="bg-[#00B86B] hover:bg-[#00A25F]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Assign Tag"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
