
import React from "react";
import { ConnectButton } from "./ConnectButton";
import { ConnectionBadge } from "@/components/widgets/screens/connections/ConnectionBadge";

interface Element {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
}

interface ElementCardProps {
  element: Element;
  onConnect: (value: any) => void;
  widgetId?: string;
  isConnected?: boolean;
  connectionId?: string;
  onViewConnection?: () => void;
}

export const ElementCard = ({ 
  element, 
  onConnect, 
  widgetId, 
  isConnected = false, 
  connectionId,
  onViewConnection
}: ElementCardProps) => {
  return (
    <div className="border border-gray-800 rounded-md p-2 flex items-center">
      {element.image_url && (
        <div className="w-10 h-10 rounded overflow-hidden mr-3">
          <img 
            src={element.image_url} 
            alt={element.name} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex-1">
        <p className="text-sm font-medium">{element.name}</p>
        {element.description && (
          <p className="text-xs text-gray-400 line-clamp-1">{element.description}</p>
        )}
      </div>
      {isConnected && connectionId ? (
        <ConnectionBadge 
          connectionId={connectionId} 
          onViewConnection={onViewConnection}
        />
      ) : (
        <ConnectButton 
          value={{ 
            id: element.id, 
            name: element.name, 
            image: element.image_url 
          }} 
          context={`element_${element.id}`} 
          onConnect={onConnect}
          widgetId={widgetId} 
        />
      )}
    </div>
  );
};
