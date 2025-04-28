
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { MoveHorizontal } from "lucide-react";

interface DropZoneProps {
  children: React.ReactNode;
  isOver?: boolean;
  className?: string;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  zone: "assign" | "unassign";
}

export const DropZone = ({
  children,
  isOver,
  className,
  onDragOver,
  onDrop,
  zone,
}: DropZoneProps) => {
  const [isDragEnter, setIsDragEnter] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragEnter(true);
    console.log(`Drag entered ${zone} zone`);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragEnter(false);
    console.log(`Drag left ${zone} zone`);
  };

  return (
    <div
      className={cn(
        "relative border rounded-md p-2 min-h-[200px] max-h-[400px] overflow-y-auto transition-all duration-300",
        isOver && "border-primary shadow-lg border-dashed",
        isDragEnter && zone === "assign" && "bg-primary/10 scale-[1.02] border-primary",
        isDragEnter && zone === "unassign" && "bg-muted/50 scale-[1.02] border-muted-foreground",
        zone === "assign" && !isDragEnter && "hover:border-primary/50 hover:shadow-sm",
        "animate-in fade-in-0 zoom-in-95",
        className
      )}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(e);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragEnter(false);
        console.log(`Item dropped in ${zone} zone`);
        onDrop(e);
      }}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      {isOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-md">
          <div className="bg-primary/20 p-3 rounded-lg flex items-center border border-primary animate-pulse">
            <MoveHorizontal className="mr-2 h-5 w-5 text-primary" />
            <span className="text-sm font-medium">
              {zone === "assign" ? "Release to assign" : "Release to remove"}
            </span>
          </div>
        </div>
      )}
      {children}
    </div>
  );
};
