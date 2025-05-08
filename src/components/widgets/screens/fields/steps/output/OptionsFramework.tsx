
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

  // Load selected option from localStorage on component mount
  useEffect(() => {
    const storedOption = localStorage.getItem('selected_option_value');
    if (storedOption && options.includes(storedOption)) {
      setSelectedOption(storedOption);
    }
  }, [options]);

  // Handle selecting an individual option
  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    localStorage.setItem('selected_option_value', option);
  };

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
  
  // Handle clicking the connect button
  const handleConnectClick = (value: any, context?: string) => {
    if (typeof value === 'string') {
      // For individual options
      localStorage.setItem('selected_option_value', value);
    } else if (Array.isArray(value)) {
      // For combinations
      localStorage.setItem('selected_combination_value', value.join(', '));
    }
    
    // Call the provided connect handler
    onConnect(value, context);
  };
  
  // Listen for connection established events
  useEffect(() => {
    const handleConnectionEstablished = () => {
      // Force refresh of connection state
      setTimeout(() => {
        // This timeout allows the connection to be saved first
        // before we check for it again
      }, 500);
    };
    
    window.addEventListener('connectionEstablished', handleConnectionEstablished);
    
    return () => {
      window.removeEventListener('connectionEstablished', handleConnectionEstablished);
    };
  }, []);
  
  console.log("🔄 Options framework rendering:", {
    isRadio,
    screenId,
    optionsCount: options.length,
    combinationsCount: combinations.length,
    connections: connections?.length || 0
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
            
            // Check if this option is selected
            const isSelected = selectedOption === option;
            
            // Build className based on selection state
            let rowClassName = "flex items-center justify-between p-2 rounded cursor-pointer transition-colors ";
            
            // Add selection styling
            if (isSelected) {
              rowClassName += "border-2 border-[#F97316] bg-[#F97316]/30 shadow-[0_0_12px_rgba(249,115,22,0.5)] font-medium";
            } else {
              rowClassName += "border border-[#00FF00]/20 bg-black/30 hover:bg-[#00FF00]/10";
            }
            
            return (
              <div 
                key={index} 
                className={rowClassName}
                onClick={() => handleOptionSelect(option)}
              >
                <div className="flex items-center">
                  {isSelected && (
                    <span className="text-[#F97316] mr-2">●</span>
                  )}
                  <span className={`text-sm ${isSelected ? 'text-white' : ''}`}>{option}</span>
                </div>
                <div className="flex items-center space-x-2">
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
                        handleConnectClick({
                          value,
                          propertyValues: { selectedOption: option }
                        }, `element_id_${index}`);
                      }}
                      widgetId={widgetId}
                      screenId={screenId}
                    />
                  )}
                </div>
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
                  const combinationStr = combination.join(', ');
                  
                  // Check if this combination is connected
                  const connected = isOptionConnected(combinationStr);
                  const connection = connected ? getConnectionForOption(combinationStr) : null;
                  
                  // Check if this combination matches the selected combination in localStorage
                  const selectedCombination = localStorage.getItem('selected_combination_value')?.split(', ') || [];
                  const isSelected = JSON.stringify(selectedCombination.sort()) === JSON.stringify(combination.sort());
                  
                  // Build className based on selection state
                  let rowClassName = "flex items-center justify-between p-2 rounded cursor-pointer transition-colors ";
                  
                  // Add selection styling
                  if (isSelected) {
                    rowClassName += "border-2 border-[#F97316] bg-[#F97316]/30 shadow-[0_0_12px_rgba(249,115,22,0.5)] font-medium";
                  } else {
                    rowClassName += "border border-[#00FF00]/20 bg-black/30 hover:bg-[#00FF00]/10";
                  }
                  
                  return (
                    <div 
                      key={index} 
                      className={rowClassName}
                      onClick={() => {
                        localStorage.setItem('selected_combination_value', combination.join(', '));
                      }}
                    >
                      <div className="flex items-center">
                        {isSelected && (
                          <span className="text-[#F97316] mr-2">●</span>
                        )}
                        <span className={`text-sm ${isSelected ? 'text-white' : ''}`}>
                          {combination.join(", ")}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
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
                              handleConnectClick({
                                value,
                                propertyValues: { 
                                  selectedOptions: combination,
                                  combinationString: combination.join(', ')
                                }
                              }, `combination_${index}`);
                            }}
                            widgetId={widgetId}
                            screenId={screenId}
                          />
                        )}
                      </div>
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
