
import React, { useState, useEffect } from "react";
import { OptionRow } from "./OptionRow";
import { Button } from "@/components/ui/button";
import { useOptionConnections } from "@/hooks/widgets/connection/useOptionConnections";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RadioOptionsProps {
  options: string[];
  onConnect?: (value: any, context?: string) => void;
  widgetId?: string;
  screenId?: string;
  isReviewMode?: boolean;
}

export function RadioOptions({ 
  options, 
  onConnect,
  widgetId,
  screenId,
  isReviewMode = false 
}: RadioOptionsProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  // Get connections management
  const { 
    selectedValue, 
    selectValue,
    connectionIds,
    viewConnection
  } = useOptionConnections({
    widgetId,
    screenId,
    contextType: "Radio Button"
  });
  
  // Update selected option when connection value changes
  useEffect(() => {
    if (selectedValue && options.includes(selectedValue)) {
      setSelectedOption(selectedValue);
    } else {
      setSelectedOption(null);
    }
  }, [selectedValue, options]);
  
  // Handle option selection
  const handleOptionSelect = (option: string) => {
    if (isReviewMode) return;
    
    selectValue(option);
    setSelectedOption(option);
  };
  
  // Handle connect button click
  const handleConnect = () => {
    if (!selectedOption || !onConnect) return;
    onConnect(selectedOption, "Radio Button");
  };
  
  // Check if an option is connected
  const isOptionConnected = (option: string): boolean => {
    return connectionIds[option] !== undefined;
  };
  
  // Get connection ID for an option
  const getOptionConnectionId = (option: string): string => {
    return connectionIds[option] || "";
  };
  
  // Handle view connection
  const handleViewConnection = (connectionId: string) => {
    viewConnection(connectionId);
  };
  
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400">
        This framework requires users to select exactly one option before continuing. 
        Each option can be connected to a different screen.
      </p>
      
      <ScrollArea className="h-64">
        <div className="space-y-2">
          {options.map((option, i) => {
            const isConnected = isOptionConnected(option);
            const connectionId = getOptionConnectionId(option);
            
            return (
              <OptionRow
                key={i}
                option={option}
                isSelected={selectedOption === option}
                isConnected={isConnected}
                isReviewMode={isReviewMode}
                connectionId={connectionId}
                onSelect={() => handleOptionSelect(option)}
                onViewConnection={handleViewConnection}
                onConnect={onConnect}
                widgetId={widgetId}
                screenId={screenId}
              />
            );
          })}
        </div>
      </ScrollArea>
      
      {!isReviewMode && selectedOption && !isOptionConnected(selectedOption) && onConnect && (
        <div className="flex justify-end">
          <Button
            className="bg-[#00FF00] text-black hover:bg-[#00FF00]/80"
            onClick={handleConnect}
          >
            Connect Selected Option
          </Button>
        </div>
      )}
    </div>
  );
}
