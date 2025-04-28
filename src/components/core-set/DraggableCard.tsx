import React, { useState, useCallback, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { COE } from "@/hooks/useCOEData";

export interface DraggableCardProps {
  coe: COE;
  isSelected?: boolean;
  isDragging?: boolean;
  onRemove?: () => Promise<void> | void;
  onClick?: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onSelect?: (checked: boolean) => void;
  draggable?: boolean;
}

export const DraggableCard = ({
  coe,
  isSelected,
  isDragging,
  onRemove,
  onClick,
  onDragStart,
  onDragEnd,
  onSelect,
  draggable = true,
}: DraggableCardProps) => {
  const [isBeingDragged, setIsBeingDragged] = useState(false);
  const [isDraggable, setIsDraggable] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout>();
  const touchStartPosition = useRef<{ x: number; y: number } | null>(null);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartPosition.current = { x: touch.clientX, y: touch.clientY };
    
    longPressTimer.current = setTimeout(() => {
      setIsDraggable(true);
    }, 500); // 500ms for long press
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartPosition.current) return;
    
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartPosition.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartPosition.current.y);
    
    // If moved more than 10px, cancel long press
    if (deltaX > 10 || deltaY > 10) {
      clearTimeout(longPressTimer.current);
      touchStartPosition.current = null;
    }
  };
  
  const handleTouchEnd = () => {
    clearTimeout(longPressTimer.current);
    touchStartPosition.current = null;
    // Keep draggable state for a short while to allow for the drag to start
    setTimeout(() => setIsDraggable(false), 100);
  };
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (!draggable || !isDraggable) {
      e.preventDefault();
      return;
    }
    
    e.dataTransfer.setData("text/plain", coe.id);
    e.dataTransfer.effectAllowed = "move";
    
    if (coe.image_url) {
      const img = new Image();
      img.src = coe.image_url;
      e.dataTransfer.setDragImage(img, 20, 20);
    }
    
    setIsBeingDragged(true);
    if (onDragStart) onDragStart();
  };
  
  const handleDragEnd = () => {
    setIsBeingDragged(false);
    setIsDraggable(false);
    if (onDragEnd) onDragEnd();
  };

  return (
    <Card
      className={cn(
        "relative transition-all duration-200 group p-2",
        isDraggable && "cursor-move",
        !isDraggable && "cursor-default",
        isSelected && "border-primary bg-primary/10",
        isBeingDragged && "opacity-40 scale-95",
        !isBeingDragged && "hover:shadow-md hover:-translate-y-0.5 hover:border-primary/50",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        "animate-in fade-in-0 zoom-in-95"
      )}
      draggable={isDraggable}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Checkbox 
            checked={isSelected}
            onCheckedChange={(checked) => onSelect?.(checked === true)}
            onClick={(e) => e.stopPropagation()}
            className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
          
          <div className={cn(
            "text-muted-foreground p-1 rounded-md",
            isDraggable ? "bg-primary/10 text-primary" : "group-hover:bg-primary/10 group-hover:text-primary"
          )}>
            <GripVertical className="h-4 w-4" />
          </div>
        </div>
        
        {coe.image_url && (
          <div className="w-10 h-10 bg-muted rounded-md flex-shrink-0 overflow-hidden">
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
            className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0 transition-opacity" 
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
