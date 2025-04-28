
import React from "react";
import { cn } from "@/lib/utils";

interface DropZoneProps {
  children: React.ReactNode;
  isOver?: boolean;
  className?: string;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export const DropZone = ({
  children,
  isOver,
  className,
  onDragOver,
  onDrop,
}: DropZoneProps) => {
  return (
    <div
      className={cn(
        "border rounded-md p-2 min-h-[200px] max-h-[400px] overflow-y-auto transition-all duration-200",
        isOver && "border-primary/50 bg-primary/5 scale-[1.02]",
        className
      )}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {children}
    </div>
  );
};
