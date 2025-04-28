
import { useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { MoveHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { CoreSet } from "@/hooks/useCoreSetData";
import { useCOEAssignment } from "@/hooks/useCOEAssignment";
import { COESearchControls } from "./COESearchControls";
import { COEDropZoneList } from "./COEDropZoneList";
import { useNavigate } from "react-router-dom";

interface CoreSetCOEAssignmentProps {
  coreSet: CoreSet | null;
  open: boolean;
  onClose: () => void;
}

export const CoreSetCOEAssignment = ({ coreSet, open, onClose }: CoreSetCOEAssignmentProps) => {
  const navigate = useNavigate();
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
    // If the component is opened and we have a valid coreSet, redirect to the full page view
    if (open && coreSet?.id) {
      navigate(`/core-set/${coreSet.id}/assignment`);
      onClose();
    }

    if (!open) {
      clearSelection();
      setSearchQuery("");
    }
  }, [open, coreSet?.id, navigate, onClose, clearSelection, setSearchQuery]);
  
  if (!coreSet) {
    return null;
  }
  
  // This component now exists primarily for backward compatibility
  // The actual UI is now rendered in the CoreSetAssignment page
  return (
    <Sheet open={false} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <p>This UI has been moved to a full page view.</p>
      </SheetContent>
    </Sheet>
  );
};
