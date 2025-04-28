
import { useEffect } from "react";
import { MoveHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { CoreSet } from "@/hooks/useCoreSetData";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useCOEAssignment } from "@/hooks/useCOEAssignment";
import { COESearchControls } from "./COESearchControls";
import { COEDropZoneList } from "./COEDropZoneList";

interface CoreSetCOEAssignmentProps {
  coreSet: CoreSet | null;
  open: boolean;
  onClose: () => void;
}

export const CoreSetCOEAssignment = ({ coreSet, open, onClose }: CoreSetCOEAssignmentProps) => {
  const {
    searchQuery,
    setSearchQuery,
    draggedCOE,
    dragOverZone,
    isDragging,
    selectedCOEs,
    isLoading,
    assignedCOEs,
    filteredUnassigned,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    toggleCOESelection,
    selectAllVisible,
    clearSelection,
    refetch
  } = useCOEAssignment(coreSet);
  
  useEffect(() => {
    if (!open) {
      clearSelection();
      setSearchQuery("");
    }
  }, [open, coreSet?.id, clearSelection, setSearchQuery]);
  
  if (!coreSet) {
    return null;
  }
  
  return (
    <Sheet open={open && !!coreSet} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>{coreSet.name}</SheetTitle>
          <SheetDescription>
            Manage which Class of Elements (COEs) belong to this Core Set
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-1">Description</h3>
            <p className="text-sm text-muted-foreground">
              {coreSet.description || "No description available"}
            </p>
          </div>

          <Separator />

          <COESearchControls
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCount={selectedCOEs.size}
            onSelectAll={selectAllVisible}
            onClearSelection={clearSelection}
          />
          
          {isDragging && (
            <div className="flex items-center justify-center p-3 mb-2 bg-primary/10 rounded-md animate-pulse border border-primary/30">
              <MoveHorizontal className="mr-2 h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Drag to {dragOverZone || ""}</span>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            {isLoading ? (
              <>
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </>
            ) : (
              <>
                <COEDropZoneList
                  zone="unassign"
                  title={`Available COEs (${filteredUnassigned.length})`}
                  coes={filteredUnassigned}
                  isOver={dragOverZone === "unassign"}
                  selectedCOEs={selectedCOEs}
                  onDragOver={(e) => {
                    e.preventDefault();
                    handleDragOver("unassign")(e);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleDrop("unassign");
                  }}
                  onSelect={toggleCOESelection}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  refetch={refetch}
                />
                
                <COEDropZoneList
                  zone="assign"
                  title={`Assigned to Core Set (${assignedCOEs.length})`}
                  coes={assignedCOEs}
                  isOver={dragOverZone === "assign"}
                  selectedCOEs={selectedCOEs}
                  onDragOver={(e) => {
                    e.preventDefault();
                    handleDragOver("assign")(e);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleDrop("assign");
                  }}
                  coreSet={coreSet}
                  refetch={refetch}
                />
              </>
            )}
          </div>
          
          {selectedCOEs.size > 0 && !isDragging && (
            <div className="flex justify-end">
              <Button 
                size="sm"
                className="animate-in fade-in slide-in-from-bottom-2"
                onClick={() => handleDrop("assign")}
              >
                Assign {selectedCOEs.size} Selected
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
