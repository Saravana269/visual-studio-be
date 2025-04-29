
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TagSelector } from "@/components/elements/TagSelector";
import { COETagSelector } from "@/components/coe/COETagSelector";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import type { COE } from "@/hooks/useCOEData";

interface COEModalProps {
  isOpen: boolean;
  onClose: (refetch?: boolean) => void;
  coe: COE | null;
  onSave: (coe: Partial<COE>) => Promise<void>;
}

const COEModal = ({ isOpen, onClose, coe, onSave }: COEModalProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<COE>>({
    name: "",
    description: "",
    tags: [],
    primary_tag_id: null,
  });

  // Reset form when modal opens/closes or COE changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: coe?.name || "",
        description: coe?.description || "",
        tags: coe?.tags || [],
        primary_tag_id: coe?.primary_tag_id || null,
      });
    }
  }, [isOpen, coe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || formData.name.trim() === "") {
      toast({
        title: "Validation Error",
        description: "COE name is required",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSave({
        ...formData,
        name: formData.name.trim(),
      });
    } catch (error) {
      console.error("Error saving COE:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{coe ? "Edit" : "Add"} Class of Elements</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter COE name"
              />
            </div>
            
            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description"
              />
            </div>
            
            {/* Primary Tag */}
            <div className="grid gap-2">
              <Label htmlFor="primary-tag">Primary Tag</Label>
              <COETagSelector
                value={formData.primary_tag_id}
                onChange={(tagId) => setFormData({ ...formData, primary_tag_id: tagId })}
              />
            </div>
            
            {/* Additional Tags */}
            <div className="grid gap-2">
              <Label htmlFor="tags">Additional Tags</Label>
              <TagSelector
                value={formData.tags}
                onChange={(tags) => setFormData({ ...formData, tags })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onClose()} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#00B86B] hover:bg-[#00A25F]" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default COEModal;
