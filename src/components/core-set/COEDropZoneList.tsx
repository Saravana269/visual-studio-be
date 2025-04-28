
import { DraggableCard } from "./DraggableCard";
import { DropZone } from "./DropZone";
import { Badge } from "@/components/ui/badge";
import type { COE } from "@/hooks/useCOEData";
import type { CoreSet } from "@/hooks/useCoreSetData";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface COEDropZoneListProps {
  zone: "unassign" | "assign";
  title: string;
  coes: COE[];
  isOver: boolean;
  selectedCOEs: Set<string>;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onSelect?: (coeId: string) => void;
  onDragStart?: (coe: COE) => void;
  onDragEnd?: () => void;
  onRemove?: (coe: COE) => Promise<void>;
  coreSet?: CoreSet;
  refetch: () => void;
}

export const COEDropZoneList = ({
  zone,
  title,
  coes,
  isOver,
  selectedCOEs,
  onDragOver,
  onDrop,
  onSelect,
  onDragStart,
  onDragEnd,
  onRemove,
  coreSet,
  refetch
}: COEDropZoneListProps) => {
  const { toast } = useToast();
  
  const handleRemove = async (coe: COE) => {
    if (!coreSet) return;
    try {
      const updatedCoreSetIds = (coe.coreSet_id || []).filter(id => id !== coreSet.id);
      await supabase
        .from("class_of_elements")
        .update({ coreSet_id: updatedCoreSetIds })
        .eq("id", coe.id);
      
      refetch();
      
      toast({
        title: "COE removed",
        description: `${coe.name} has been removed from this Core Set`
      });
    } catch (error: any) {
      console.error("Error removing COE:", error);
      toast({
        title: "Error",
        description: `Failed to remove COE: ${error.message || "Unknown error"}`,
        variant: "destructive"
      });
    }
  };

  return (
    <DropZone
      isOver={isOver}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={zone === "assign" ? "border-dashed border-primary/50" : ""}
    >
      <div className="text-xs font-medium text-muted-foreground mb-2 p-1 sticky top-0 bg-card z-10">
        {title}
        {selectedCOEs.size > 0 && zone === "assign" && (
          <Badge className="ml-2 bg-primary">
            Drag {selectedCOEs.size} COEs here
          </Badge>
        )}
      </div>
      
      <div className="space-y-2">
        {coes.map((coe) => (
          <DraggableCard
            key={coe.id}
            coe={coe}
            isSelected={selectedCOEs.has(coe.id)}
            onClick={() => onSelect?.(coe.id)}
            onDragStart={() => onDragStart?.(coe)}
            onDragEnd={onDragEnd}
            onRemove={zone === "assign" ? () => handleRemove(coe) : undefined}
          />
        ))}
        
        {coes.length === 0 && (
          <div className={`text-center p-4 text-sm text-muted-foreground ${
            zone === "assign" ? "flex flex-col items-center justify-center p-8 border-2 border-dashed border-muted rounded-lg" : ""
          }`}>
            {zone === "assign" ? "Drop COEs here to assign them" : "No COEs available"}
          </div>
        )}
      </div>
    </DropZone>
  );
};
