import React, { useState } from "react";
import { GroupData } from "@/types/group";
import { DraggableCard } from "@/components/core-set/DraggableCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, MoveHorizontal } from "lucide-react";
import { isDark } from "@/lib/utils";
import type { COE } from "@/hooks/useCOEData";
interface GroupedCOEDisplayProps {
  groups: GroupData[];
  groupedCOEs: Record<string, COE[]>;
  selectedCOEs: Set<string>;
  onSelect: (coeId: string) => void;
  onDragStart: (coe: COE) => void;
  onDragEnd: () => void;
  onRemove?: (coe: COE) => Promise<void> | void;
  onToggleGroupCollapse: (groupId: string) => void;
}
export function GroupedCOEDisplay({
  groups,
  groupedCOEs,
  selectedCOEs,
  onSelect,
  onDragStart,
  onDragEnd,
  onRemove,
  onToggleGroupCollapse
}: GroupedCOEDisplayProps) {
  return <div className="space-y-4">
      {groups.map(group => {
      const coes = groupedCOEs[group.id] || [];
      const textColor = isDark(group.color) ? "text-white" : "text-gray-900";
      return <div key={group.id} className="border rounded-lg overflow-hidden transition-all duration-300">
            {/* Group Header */}
            
            
            {/* Group Content */}
            {!group.collapsed && <div className="p-2 space-y-2">
                {coes.length > 0 ? coes.map(coe => <DraggableCard key={coe.id} coe={coe} isSelected={selectedCOEs.has(coe.id)} onSelect={checked => onSelect(coe.id)} onDragStart={() => onDragStart(coe)} onDragEnd={onDragEnd} onRemove={onRemove ? () => onRemove(coe) : undefined} />) : <div className="text-center p-4 text-sm text-muted-foreground">
                    {group.id === "default" ? "No ungrouped COEs available" : <div className="flex flex-col items-center justify-center p-6">
                        <div className="mb-2 p-2 rounded-full bg-muted/30">
                          <MoveHorizontal className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <p>Drop COEs here to add to this group</p>
                      </div>}
                  </div>}
              </div>}
          </div>;
    })}
    </div>;
}