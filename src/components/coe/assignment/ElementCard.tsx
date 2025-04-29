
import { Element } from "@/types/element";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ElementCardProps {
  element: Element;
  isSelected: boolean;
  onClick: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

export const ElementCard = ({
  element,
  isSelected,
  onClick,
  onDragStart,
  onDragEnd
}: ElementCardProps) => {
  return (
    <Card
      key={element.id}
      className={`flex cursor-pointer p-2 ${isSelected ? 'border-primary bg-primary/5' : ''}`}
      onClick={onClick}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="flex items-start gap-2 w-full">
        {element.image_url && (
          <div className="w-12 h-12 bg-muted flex-shrink-0">
            <img 
              src={element.image_url} 
              alt={element.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{element.name}</h4>
          {element.description && (
            <p className="text-xs text-muted-foreground line-clamp-1">
              {element.description}
            </p>
          )}
          {element.primary_tag_id && (
            <div className="mt-1">
              <Badge variant="outline" className="text-xs">
                Has tag
              </Badge>
            </div>
          )}
        </div>
        {isSelected && (
          <div className="h-4 w-4 rounded-full bg-primary ml-auto mr-1"></div>
        )}
      </div>
    </Card>
  );
};
