
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Element {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  tags: string[] | null;
}

interface COEElementsListProps {
  elements: Element[];
  isLoading?: boolean;
}

export function COEElementsList({ elements, isLoading = false }: COEElementsListProps) {
  if (isLoading) {
    return (
      <div className="mt-2 p-3 border border-[#00FF00]/10 rounded bg-black/20">
        <p className="text-gray-500 text-sm text-center">Loading elements...</p>
      </div>
    );
  }

  if (!elements || elements.length === 0) {
    return (
      <div className="mt-2 p-3 border border-[#00FF00]/10 rounded bg-black/20">
        <p className="text-gray-500 text-sm text-center">No elements available in this COE yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <h4 className="text-xs font-medium text-gray-400 mb-2">Elements in this COE:</h4>
      <ScrollArea className="h-[200px] p-1">
        <div className="space-y-2">
          {elements.map((element) => (
            <div
              key={element.id}
              className="p-2 border border-[#00FF00]/10 rounded bg-black/20 flex items-start gap-2"
            >
              {element.image_url && (
                <div className="flex-shrink-0 w-8 h-8 rounded overflow-hidden">
                  <img
                    src={element.image_url}
                    alt={element.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-200">{element.name}</p>
                {element.description && (
                  <p className="text-xs text-gray-400 line-clamp-2">{element.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
