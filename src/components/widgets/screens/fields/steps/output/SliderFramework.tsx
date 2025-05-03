
import React from "react";
import { ConnectButton } from "./ConnectButton";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SliderFrameworkProps {
  min: number;
  max: number;
  step: number;
  onConnect: (value: any, context?: string) => void;
  widgetId?: string;
}

export const SliderFramework = ({ min, max, step, onConnect, widgetId }: SliderFrameworkProps) => {
  // Set default values if not provided
  const minValue = min || 0;
  const maxValue = max || 100;
  const stepValue = step || 1;
  
  // Generate the list of values based on min, max, and step
  const generateValues = () => {
    const values = [];
    for (let i = minValue + stepValue; i <= maxValue; i += stepValue) {
      values.push(i);
    }
    return values;
  };
  
  const values = generateValues();

  return (
    <div className="space-y-3">
      <h4 className="text-base font-medium">Slider Values</h4>
      
      <ScrollArea className="h-60 pr-4">
        <div className="space-y-2">
          {values.length > 0 ? (
            values.map((value, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-2 rounded hover:bg-gray-800/30 border border-gray-700"
              >
                <span className="text-sm">{value}</span>
                <ConnectButton 
                  value={value} 
                  context={`slider_value_${value}`}
                  onConnect={onConnect}
                  widgetId={widgetId} 
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No values available with current configuration</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
