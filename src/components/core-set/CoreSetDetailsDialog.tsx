
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

          {/* Primary Element */}
          <div>
            <h3 className="text-sm font-medium mb-1">Primary Element</h3>
            <div className="bg-muted rounded-md p-3">
              {coreSet.source_element_id ? (
                <div className="text-sm">{typeof coreSet.source_element_id === 'string' ? coreSet.source_element_id : 'Invalid element ID'}</div>
              ) : (
                <div className="text-sm text-muted-foreground">No primary element assigned</div>
              )}
            </div>
          </div>

          {/* Secondary Elements */}
          <div>
            <h3 className="text-sm font-medium mb-1">Secondary Elements</h3>
            <div className="bg-muted rounded-md p-3">
              {coreSet.destination_element_ids && coreSet.destination_element_ids.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {coreSet.destination_element_ids.map((elementId, index) => (
                    <div key={`${elementId}-${index}`} className="text-sm bg-background rounded p-2">
                      {typeof elementId === 'string' ? elementId : 'Invalid element ID'}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">No secondary elements assigned</div>
              )}
            </div>
          </div>

          {/* Tags */}
          {coreSet.tags && coreSet.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-1">Tags</h3>
              <div className="flex flex-wrap gap-1">
                {coreSet.tags.map((tag, idx) => (
                  <Badge key={`${tag}-${idx}`} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoreSetDetailsDialog;
