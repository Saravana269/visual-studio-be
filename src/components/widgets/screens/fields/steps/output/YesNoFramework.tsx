
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { ConnectButton } from "./ConnectButton";
import { ConnectionBadge } from "../../../connections/ConnectionBadge";

interface YesNoFrameworkProps {
  value?: boolean;
  onConnect: (value: any, context?: string) => void;
  widgetId?: string;
  screenId?: string;
  isReviewMode?: boolean;
}

export const YesNoFramework: React.FC<YesNoFrameworkProps> = ({
  value,
  onConnect,
  widgetId,
  screenId,
  isReviewMode = false
}) => {
  const [selectedValue, setSelectedValue] = useState<boolean | null>(value ?? null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  
  // Handle yes/no button click
  const handleSelect = (newValue: boolean) => {
    if (isReviewMode) return;
    setSelectedValue(newValue);
    setIsConnected(false); // Reset connection status when value changes
  };
  
  // Handle connect button click
  const handleConnect = () => {
    if (selectedValue !== null) {
      onConnect(selectedValue, "Yes / No");
      setIsConnected(true);
      setConnectionId(`yes-no-${selectedValue}`);
    }
  };
  
  // Handle viewing connection
  const handleViewConnection = () => {
    console.log("View connection for value:", selectedValue);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Yes / No Selection</h2>
        
        {isConnected && connectionId ? (
          <ConnectionBadge 
            type="value"
            label={selectedValue ? "Yes" : "No"}
            connectionId={connectionId} 
            onViewConnection={handleViewConnection} 
          />
        ) : (
          selectedValue !== null && !isReviewMode && (
            <ConnectButton
              value={selectedValue}
              context="Yes / No"
              onConnect={onConnect}
              widgetId={widgetId}
              screenId={screenId}
            />
          )
        )}
      </div>
      
      <div className="flex justify-center space-x-6 mt-8">
        <Button
          size="lg"
          variant={selectedValue === true ? "default" : "outline"}
          className={`px-8 py-6 text-lg ${
            selectedValue === true
              ? "bg-green-600 hover:bg-green-700 border-2 border-green-500"
              : "border-2 hover:border-green-500/50 hover:text-green-500"
          }`}
          onClick={() => handleSelect(true)}
          disabled={isReviewMode}
        >
          <Check className="mr-2" size={20} />
          Yes
        </Button>
        
        <Button
          size="lg"
          variant={selectedValue === false ? "default" : "outline"}
          className={`px-8 py-6 text-lg ${
            selectedValue === false
              ? "bg-red-600 hover:bg-red-700 border-2 border-red-500"
              : "border-2 hover:border-red-500/50 hover:text-red-500"
          }`}
          onClick={() => handleSelect(false)}
          disabled={isReviewMode}
        >
          <X className="mr-2" size={20} />
          No
        </Button>
      </div>
    </div>
  );
};
