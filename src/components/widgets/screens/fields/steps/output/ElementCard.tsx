
import React from "react";
import { ConnectButton } from "./ConnectButton";
import { Element } from "@/types/element";

interface ElementCardProps {
  element: Element;
  onConnect: (value: string) => void;
}

export const ElementCard = ({ element, onConnect }: ElementCardProps) => {
  return (
    <div className="p-2 border border-gray-800 rounded-md bg-black/20 flex items-start justify-between">
      <div className="flex items-start gap-2">
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
          <p className="text-sm font-medium">{element.name}</p>
          {element.description && (
            <p className="text-xs text-gray-400 line-clamp-2">{element.description}</p>
          )}
        </div>
      </div>
      <ConnectButton 
        value={element.id} 
        onConnect={() => onConnect(element.id)} 
      />
    </div>
  );
};
