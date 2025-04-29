
import { DraggableCard } from "./DraggableCard";
import { DropZone } from "./DropZone";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GroupedCOEDisplay } from "./GroupedCOEDisplay";
import type { COE } from "@/hooks/useCOEData";
import type { CoreSet } from "@/hooks/useCoreSetData";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MoveHorizontal } from "lucide-react";

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
  // Group related props
  groups?: any[];
  groupedCOEs?: Record<string, COE[]>;
  onDragOverGroup?: (groupId: string) => (e: React.DragEvent) => void;
  onDropToGroup?: (groupId: string) => (e: React.DragEvent) => void;
  onToggleGroupCollapse?: (groupId: string) => void;
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
  refetch,
  // Group related props
  groups,
  groupedCOEs,
  onDragOverGroup,
  onDropToGroup,
  onToggleGroupCollapse
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
      zone={zone}
      isOver={isOver}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={zone === "assign" ? "border-primary/30" : ""}
    >
      <div className="text-xs font-medium text-muted-foreground mb-2 p-2 sticky top-0 bg-card z-10 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-2">
          {title}
          {selectedCOEs.size > 0 && zone === "assign" && (
            <Badge variant="secondary" className="ml-2">
              {selectedCOEs.size} selected
            </Badge>
          )}
        </div>
      </div>
      
      {zone === "assign" && groups && groupedCOEs && onToggleGroupCollapse ? (
        <GroupedCOEDisplay
          groups={groups}
          groupedCOEs={groupedCOEs}
          selectedCOEs={selectedCOEs}
          onSelect={(coeId) => onSelect?.(coeId)}
          onDragStart={(coe) => onDragStart?.(coe)}
          onDragEnd={onDragEnd}
          onRemove={(coe) => handleRemove(coe)}
          onToggleGroupCollapse={onToggleGroupCollapse}
        />
      ) : (
        <div className="space-y-2 p-1">
          {coes.map((coe) => (
            <DraggableCard
              key={coe.id}
              coe={coe}
              isSelected={selectedCOEs.has(coe.id)}
              onSelect={(checked) => onSelect?.(coe.id)}
              onDragStart={() => onDragStart?.(coe)}
              onDragEnd={onDragEnd}
              onRemove={zone === "assign" ? () => handleRemove(coe) : undefined}
            />
          ))}
          
          {coes.length === 0 && (
            <div className={`text-center p-4 text-sm text-muted-foreground ${
              zone === "assign" ? "flex flex-col items-center justify-center p-8 border-2 border-dashed border-muted rounded-lg" : ""
            }`}>
              {zone === "assign" ? (
                <>
                  <div className="mb-2 p-2 rounded-full bg-muted/30">
                    <MoveHorizontal className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p>Drop COEs here to assign them</p>
                </>
              ) : (
                "No COEs available"
              )}
            </div>
          )}
        </div>
      )}
    </DropZone>
  );
};
