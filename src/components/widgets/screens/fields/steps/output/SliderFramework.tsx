
import React from "react";
import { ConnectButton } from "./ConnectButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useOptionConnections } from "@/hooks/widgets/connection/useOptionConnections";
import { ConnectionBadge } from "@/components/widgets/screens/connections/ConnectionBadge";

interface SliderFrameworkProps {
  min: number;
  max: number;
  step: number;
  onConnect: (value: any, context?: string) => void;
  widgetId?: string;
  screenId?: string;
}

export const SliderFramework = ({ min, max, step, onConnect, widgetId, screenId }: SliderFrameworkProps) => {
  // Set default values if not provided
  const minValue = min || 0;
  const maxValue = max || 100;
  const stepValue = step || 1;
  
  // Use the option connections hook to check for existing connections
  const { 
    isOptionConnected, 
    getConnectionForOption 
  } = useOptionConnections(screenId, "Slider");
  
  // Generate the list of values based on min, max, and step
  const generateValues = () => {
    const values = [];
    for (let i = minValue + stepValue; i <= maxValue; i += stepValue) {
      values.push(i);
    }
    return values;
  };
  
  const values = generateValues();

  // For logging/debugging
  console.log("🎚️ Slider framework rendering:", {
    screenId,
    valueCount: values.length,
    minValue,
    maxValue,
    stepValue
  });

  return (
    <div className="space-y-3">
      <h4 className="text-base font-medium">Slider Values</h4>
      
      <ScrollArea className="h-60 pr-4">
        <div className="space-y-2">
          {values.length > 0 ? (
            values.map((value, index) => {
              // Convert value to string for connection checking
              const valueStr = value.toString();
              // Check if this value is already connected
              const isConnected = isOptionConnected(valueStr);
              // Get connection details if connected
              const connection = isConnected ? getConnectionForOption(valueStr) : null;
              
              return (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-2 rounded hover:bg-gray-800/30 border border-gray-700"
                >
                  <span className="text-sm">{value}</span>
                  {isConnected && connection ? (
                    <ConnectionBadge 
                      connectionId={connection.id}
                      onViewConnection={() => {
                        console.log("View connection:", connection.id);
                        // Connection view logic could be added here
                      }}
                    />
                  ) : (
                    <ConnectButton 
                      value={value} 
                      context={`slider_value_${value}`}
                      onConnect={onConnect}
                      widgetId={widgetId} 
                    />
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-sm">No values available with current configuration</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
