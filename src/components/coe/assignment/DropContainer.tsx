
import { Badge } from "@/components/ui/badge";
import { ElementCard } from "./ElementCard";
import { Element } from "@/types/element";

interface DropContainerProps {
  title: string;
  elements: Element[];
  zone: "assign" | "unassign";
  selectedElements: Set<string>;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onElementSelect: (elementId: string) => void;
  onElementDragStart: (element: Element) => void;
  onElementDragEnd: () => void;
}

export const DropContainer = ({
  title,
  elements,
  zone,
  selectedElements,
  onDragOver,
  onDrop,
  onElementSelect,
  onElementDragStart,
  onElementDragEnd
}: DropContainerProps) => {
  return (
    <div
      className={`h-[320px] overflow-y-auto p-3 border rounded-md ${
        zone === "assign" 
          ? "border-primary/20 hover:border-primary/40 transition-colors" 
          : "border-dashed"
      }`}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="text-xs font-medium text-muted-foreground mb-2 p-1 sticky top-0 bg-card">
        {title} ({elements.length})
        {zone === "assign" && selectedElements.size > 0 && (
          <Badge className="ml-2 bg-primary">Drag {selectedElements.size} elements here</Badge>
        )}
      </div>
      
      {elements.length > 0 ? (
        <div className="space-y-2">
          {elements.map((element) => (
            <ElementCard
              key={element.id}
              element={element}
              isSelected={selectedElements.has(element.id)}
              onClick={() => onElementSelect(element.id)}
              onDragStart={() => onElementDragStart(element)}
              onDragEnd={onElementDragEnd}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full py-4 text-muted-foreground text-sm">
          <p>
            {zone === "assign" 
              ? "Drag elements here to assign" 
              : "No elements found"
            }
          </p>
          {zone === "assign" && (
            <p className="text-xs mt-1">Or select multiple and drag them as a group</p>
          )}
        </div>
      )}
    </div>
  );
};
