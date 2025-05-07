
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConnectButton } from "./ConnectButton";
import { ConnectionBadge } from "../../../connections/ConnectionBadge";
import { ConnectionDetailsModal } from "../../../connections/ConnectionDetailsModal";
import { useOptionConnections } from "@/hooks/widgets/connection/useOptionConnections";

interface OptionsFrameworkProps {
  options: string[];
  isRadio?: boolean;
  onConnect: (value: any, context?: string) => void;
  widgetId?: string;
  screenId?: string;
}

export function OptionsFramework({ 
  options = [], 
  isRadio = false,
  onConnect,
  widgetId,
  screenId
}: OptionsFrameworkProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Get current connections
  const { 
    connections,
    isOptionConnected, 
    getConnectionForOption 
  } = useOptionConnections(screenId, isRadio ? "Radio Button" : "Multiple Options");

  // Generate all possible non-empty combinations of options for multiple select
  const generateCombinations = (opts: string[]): string[][] => {
    if (isRadio || opts.length === 0) return [];
    
    const result: string[][] = [];
    
    const backtrack = (start: number, current: string[]) => {
      if (current.length > 0) {
        result.push([...current]);
      }
      
      for (let i = start; i < opts.length; i++) {
        current.push(opts[i]);
        backtrack(i + 1, current);
        current.pop();
      }
    };
    
    backtrack(0, []);
    return result;
  };
  
  const combinations = generateCombinations(options);
  
  // Handle viewing a connection
  const handleViewConnection = (connectionId: string) => {
    setSelectedConnectionId(connectionId);
    setIsModalOpen(true);
  };
  
  console.log("🔄 Options framework rendering:", {
    isRadio,
    screenId,
    optionsCount: options.length,
    combinationsCount: combinations.length
  });

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-medium">
          {isRadio ? "Select one option" : "Available combinations"}
        </h2>
      </div>

      {isRadio ? (
        <div className="space-y-2 mt-4">
          {options.map((option, index) => {
            // Check if this option is connected
            const connected = isOptionConnected(option);
            const connection = connected ? getConnectionForOption(option) : null;
            
            return (
              <div 
                key={index} 
                className="flex items-center justify-between p-2 rounded hover:bg-gray-800/30 border border-gray-700"
              >
                <span className="text-sm">{option}</span>
                {connected && connection ? (
                  <ConnectionBadge 
                    connectionId={connection.id}
                    onViewConnection={() => handleViewConnection(connection.id)}
                  />
                ) : (
                  <ConnectButton 
                    value={option} 
                    context={`element_id_${index}`}
                    onConnect={(value) => {
                      // Only store the selected option in propertyValues
                      onConnect({
                        value,
                        propertyValues: { selectedOption: option }
                      }, `element_id_${index}`);
                    }}
                    widgetId={widgetId}
                  />
                )}
              </div>
            );
          })}
          {options.length === 0 && (
            <p className="text-gray-500 text-sm">No options defined yet</p>
          )}
        </div>
      ) : (
        <div className="mt-2">
          {options.length > 0 ? (
            <ScrollArea className="h-[350px]">
              <div className="space-y-2">
                {combinations.map((combination, index) => {
                  // For string arrays, we need to convert to string for connection checking
                  const combinationStr = JSON.stringify(combination);
                  // Check if this combination is connected
                  const connected = isOptionConnected(combinationStr);
                  const connection = connected ? getConnectionForOption(combinationStr) : null;
                  
                  return (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-2 rounded hover:bg-[#00FF00]/10 border border-[#00FF00]/20 bg-black/30"
                    >
                      <span className="text-sm">{combination.join(", ")}</span>
                      {connected && connection ? (
                        <ConnectionBadge 
                          connectionId={connection.id}
                          onViewConnection={() => handleViewConnection(connection.id)}
                        />
                      ) : (
                        <ConnectButton 
                          value={combination} 
                          context={`combination_${index}`}
                          onConnect={(value) => {
                            // Only store the selected combination in propertyValues
                            onConnect({
                              value,
                              propertyValues: { selectedOptions: combination }
                            }, `combination_${index}`);
                          }}
                          widgetId={widgetId}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-gray-500 text-sm">No options defined yet</p>
          )}
        </div>
      )}
      
      {/* Connection details modal */}
      <ConnectionDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        connectionId={selectedConnectionId}
      />
    </div>
  );
}
