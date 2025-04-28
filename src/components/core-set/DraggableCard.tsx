
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { COE } from "@/hooks/useCOEData";

export interface DraggableCardProps {
  coe: COE;
  isSelected?: boolean;
  isDragging?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export const DraggableCard = ({
  coe,
  isSelected,
  isDragging,
  onRemove,
  onClick,
  onDragStart,
  onDragEnd,
}: DraggableCardProps) => {
  return (
    <Card
      className={cn(
        "cursor-move transition-all duration-200 group p-2",
        isSelected && "border-primary bg-primary/5",
        isDragging && "opacity-50 scale-95",
        "hover:shadow-md hover:-translate-y-0.5",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        "animate-in fade-in-0 zoom-in-95"
      )}
      onClick={onClick}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="flex items-center gap-2">
        <div className="text-muted-foreground">
          <GripVertical className="h-4 w-4" />
        </div>
        {coe.image_url && (
          <div className="w-8 h-8 bg-muted flex-shrink-0">
            <img 
              src={coe.image_url} 
              alt={coe.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{coe.name}</p>
          {coe.tags && coe.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {coe.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs py-0 px-1">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
        {onRemove && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0" 
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Card>
  );
};
