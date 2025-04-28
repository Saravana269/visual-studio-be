
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { CoreSet } from "@/hooks/useCoreSetData";

interface CoreSetDetailsDialogProps {
  coreSet: CoreSet | null;
  open: boolean;
  onClose: () => void;
}

const CoreSetDetailsDialog = ({ coreSet, open, onClose }: CoreSetDetailsDialogProps) => {
  if (!coreSet) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{coreSet.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Description */}
          <div>
            <h3 className="text-sm font-medium mb-1">Description</h3>
            <p className="text-sm text-muted-foreground">
              {coreSet.description || "No description available"}
            </p>
          </div>

          {/* Tags */}
          {coreSet.tags && coreSet.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-1">Tags</h3>
              <div className="flex flex-wrap gap-1">
                {coreSet.tags.map((tag, idx) => (
                  <Badge key={`tag-${idx}`} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <p className="text-muted-foreground text-sm">
              Note: To manage COE assignments for this Core Set, please use the COE assignment functionality.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoreSetDetailsDialog;
