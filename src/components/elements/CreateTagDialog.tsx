
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface CreateTagDialogProps {
  open: boolean;
  onClose: () => void;
  onTagCreated: (tag: string) => void;
}

export function CreateTagDialog({ open, onClose, onTagCreated }: CreateTagDialogProps) {
  const [label, setLabel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth(); // Get the current session to access user ID

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    setIsLoading(true);
    try {
      // Get the user ID from the session
      const userId = session?.user?.id;

      if (!userId) {
        console.error("User not authenticated");
        toast({
          title: "Authentication required",
          description: "You need to be logged in to create tags.",
          variant: "destructive",
        });
        onClose();
        return;
      }

      // First, check what valid entity_type values are available
      const { data: typeData, error: typeError } = await supabase
        .rpc('get_entity_type_enum_values');
        
      if (typeError) {
        console.error("Error fetching valid entity types:", typeError);
        // Fallback to using 'element' instead of 'elements'
        const { data, error } = await supabase
          .from("tags")
          .insert({
            label: label.trim(),
            entity_type: "element", // Try using 'element' (singular) instead of 'elements'
            created_by: userId,
            entity_id: "00000000-0000-0000-0000-000000000000" // Placeholder value as required
          })
          .select()
          .single();

        if (error) throw error;

        toast({
          title: "Success",
          description: "Tag created successfully",
        });

        onTagCreated(label.trim());
        setLabel("");
        onClose();
        return;
      }

      // If we can get valid entity types, use the first one
      if (typeData && Array.isArray(typeData) && typeData.length > 0) {
        console.log("Valid entity types:", typeData);
        const validEntityType = typeData[0].value;
        
        const { data, error } = await supabase
          .from("tags")
          .insert({
            label: label.trim(),
            entity_type: validEntityType,
            created_by: userId,
            entity_id: "00000000-0000-0000-0000-000000000000" // Placeholder value as required
          })
          .select()
          .single();

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Tag created successfully",
        });

        onTagCreated(label.trim());
        setLabel("");
        onClose();
      } else {
        throw new Error("Could not determine valid entity types");
      }
    } catch (error) {
      console.error("Error creating tag:", error);
      toast({
        title: "Error",
        description: "Failed to create tag. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Tag</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="tag-label">Tag Label</Label>
              <Input
                id="tag-label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Enter tag label"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !label.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Tag"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
