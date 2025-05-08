
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConnectionBadge } from "../../../connections/ConnectionBadge";

interface ElementCardProps {
  elementName: string;
  elementId: string;
  isSelected: boolean;
  isConnected?: boolean;
  connectionId?: string | null;
  onSelect: () => void;
  onViewConnection?: () => void;
}

export function ElementCard({ 
  elementName,
  elementId,
  isSelected,
  isConnected = false,
  connectionId = null,
  onSelect,
  onViewConnection
}: ElementCardProps) {
  // Determine row class based on selected and connected status
  let rowClasses = "cursor-pointer flex items-center justify-between p-3 rounded mb-2 transition-all";
  
  // If element is selected
  if (isSelected) {
    rowClasses += " border-2 border-orange-500 bg-orange-500/10";
  } 
  // If element is connected but not selected
  else if (isConnected) {
    rowClasses += " border border-gray-600 bg-gray-800";
  } 
  // Default state - not selected or connected
  else {
    rowClasses += " border border-gray-700 bg-black hover:border-gray-600";
  }

  return (
    <Card className={rowClasses} onClick={onSelect}>
      <div className="flex items-center">
        {/* Selection indicator */}
        {isSelected && (
          <div className="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
        )}
        <span className="text-sm font-medium">{elementName}</span>
      </div>
      
      {/* Show connection badge if connected */}
      {isConnected && connectionId && onViewConnection && (
        <ConnectionBadge
          type="screen" 
          label="Connected"
          connectionId={connectionId}
          onViewConnection={onViewConnection}
        />
      )}
    </Card>
  );
}
