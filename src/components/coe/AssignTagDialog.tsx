
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { COE } from "@/hooks/useCOEData";

interface AssignTagDialogProps {
  isOpen: boolean;
  onClose: () => void;
  coe: COE | null;
  selectedTag: string | null;
  onTagChange: (tag: string) => void;
  onSave: () => Promise<void>;
  isSubmitting: boolean;
}

const AssignTagDialog = ({
  isOpen,
  onClose,
  coe,
  selectedTag,
  onTagChange,
  onSave,
  isSubmitting
}: AssignTagDialogProps) => {
  const [filterQuery, setFilterQuery] = useState("");
  
  const { data: availableTags = [] } = useQuery({
    queryKey: ["coe-tags"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from("tags").select("*").eq("entity_type", "COE");
        if (error) {
          console.error("Error fetching tags:", error);
          return [];
        }
        return data;
      } catch (error: any) {
        console.error("Error fetching tags:", error);
        return [];
      }
    }
  });
  
  const filteredTags = filterQuery
    ? availableTags.filter(tag => 
        tag.label.toLowerCase().includes(filterQuery.toLowerCase()))
    : availableTags;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Assign Tag to {coe?.name || ''}
          </DialogTitle>
          <DialogDescription>
            Select a tag to assign to this COE. Only one tag can be assigned as the primary tag.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Input 
            placeholder="Filter tags..." 
            className="mb-4" 
            value={filterQuery}
            onChange={e => setFilterQuery(e.target.value)} 
          />
          
          <RadioGroup 
            value={selectedTag || ''} 
            onValueChange={onTagChange} 
            className="space-y-3 max-h-[300px] overflow-y-auto"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem id="tag-none" value="" />
              <Label htmlFor="tag-none">No tag (clear assignment)</Label>
            </div>
            
            {filteredTags.map(tag => (
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
            onClick={onSave} 
            className="bg-[#00B86B] hover:bg-[#00A25F]" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Assign Tag"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignTagDialog;
