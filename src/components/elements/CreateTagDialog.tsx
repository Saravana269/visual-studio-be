
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";

// Define the allowed entity types
type EntityType = "Element" | "COE";

interface CreateTagDialogProps {
  open: boolean;
  onClose: () => void;
  onTagCreated: (tag: string) => void;
  entityType?: EntityType;
}

// Create a schema for tag validation
const tagSchema = z.object({
  label: z.string().min(1, "Tag name cannot be empty")
});

export function CreateTagDialog({ open, onClose, onTagCreated, entityType = "Element" }: CreateTagDialogProps) {
  const [label, setLabel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const { session } = useAuth(); // Get the current session to access user ID

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      // Validate the tag
      const validatedData = tagSchema.parse({ label });
      
      setIsLoading(true);
      
      // Get the user ID from the session
      const userId = session?.user?.id;

      if (!userId) {
        setError("You need to be logged in to create tags");
        toast({
          title: "Authentication required",
          description: "You need to be logged in to create tags",
          variant: "destructive",
        });
        onClose();
        return;
      }

      // Insert the tag with specified entity type
      const { data, error: insertError } = await supabase
        .from("tags")
        .insert({
          label: validatedData.label.trim(),
          entity_type: entityType, // Use the specified entity type
          created_by: userId,
          entity_id: "00000000-0000-0000-0000-000000000000" // Placeholder value as required
        })
        .select()
        .single();

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: `${entityType} tag created successfully`,
      });

      onTagCreated(validatedData.label.trim());
      setLabel("");
      onClose();
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
        toast({
          title: "Validation error",
          description: err.errors[0].message,
          variant: "destructive",
        });
      } else {
        console.error(`Error creating ${entityType} tag:`, err);
        setError(`Failed to create ${entityType} tag`);
        toast({
          title: "Error",
          description: `Failed to create ${entityType} tag. Please try again.`,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New {entityType} Tag</DialogTitle>
          <DialogDescription>Enter a name for your new tag</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="tag-label" className={error ? "text-destructive" : ""}>
                Tag Name
              </Label>
              <Input
                id="tag-label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Enter tag label"
                className={error ? "border-destructive" : ""}
              />
              {error && <p className="text-xs text-destructive">{error}</p>}
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
                `Create ${entityType} Tag`
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
