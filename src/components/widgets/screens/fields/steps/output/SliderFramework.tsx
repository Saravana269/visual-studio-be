
import React, { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { ConnectButton } from "./ConnectButton";
import { ConnectionBadge } from "../../../connections/ConnectionBadge";

interface SliderFrameworkProps {
  min?: number;
  max?: number;
  step?: number;
  onConnect: (value: any, context?: string) => void;
  widgetId?: string;
  screenId?: string;
  isReviewMode?: boolean;
}

export const SliderFramework: React.FC<SliderFrameworkProps> = ({
  min = 0,
  max = 100,
  step = 1,
  onConnect,
  widgetId,
  screenId,
  isReviewMode = false
}) => {
  // Use provided values with fallbacks
  const actualMin = min ?? 0;
  const actualMax = max ?? 100;
  const actualStep = step ?? 1;
  
  // Set initial value to the middle of the range
  const initialValue = Math.round((actualMin + actualMax) / 2);
  
  const [value, setValue] = useState<number>(initialValue);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  
  // Format the value for display
  const formattedValue = value.toLocaleString();
  
  // Handle slider value change
  const handleValueChange = (newValue: number[]) => {
    setValue(newValue[0]);
  };
  
  // Handle connect button click
  const handleConnect = () => {
    onConnect(value, "Slider");
    setIsConnected(true);
    setConnectionId("slider-value");
  };
  
  // Handle viewing connection details
  const handleViewConnection = () => {
    // In a real implementation, this would open a modal or navigate to a details page
    console.log("View connection for value:", value);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Slider Selection</h2>
        
        {/* Show connection badge if connected, otherwise show connect button */}
        {isConnected && connectionId ? (
          <ConnectionBadge 
            type="value"
            label={`Value: ${formattedValue}`}
            connectionId={connectionId} 
            onViewConnection={handleViewConnection} 
          />
        ) : (
          !isReviewMode && (
            <ConnectButton
              value={value}
              context="Slider"
              onConnect={onConnect}
              widgetId={widgetId}
              screenId={screenId}
            />
          )
        )}
      </div>
      
      <div className="space-y-6">
        <div className="mt-4">
          <Slider
            disabled={isReviewMode}
            value={[value]}
            min={actualMin}
            max={actualMax}
            step={actualStep}
            onValueChange={handleValueChange}
            className="my-6"
          />
          
          <div className="flex justify-between text-sm text-gray-400">
            <span>{actualMin}</span>
            <span className="font-medium text-white">{formattedValue}</span>
            <span>{actualMax}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
