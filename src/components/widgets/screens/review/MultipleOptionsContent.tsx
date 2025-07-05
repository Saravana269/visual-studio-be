
import { ScrollArea } from "@/components/ui/scroll-area";
import { MultipleOptionsCombinationsContent } from "./MultipleOptionsCombinationsContent";
import { useState, useEffect } from "react";
import { ConnectionDetailsModal } from "../connections/ConnectionDetailsModal";
import { useOptionConnections } from "@/hooks/widgets/connection/useOptionConnections";
import { ConnectionBadge } from "../connections/ConnectionBadge";

interface MultipleOptionsContentProps {
  metadata: Record<string, any>;
  screenId?: string;
  onConnect?: (option: string[] | string, context?: string) => void;
}

export function MultipleOptionsContent({
  metadata,
  screenId,
  onConnect
}: MultipleOptionsContentProps) {
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  // Get connection data for options
  const { isOptionConnected, getConnectionForOption } = useOptionConnections({
    screenId,
    contextType: "Multiple Options"
  });
  
  // Handle viewing a connection
  const handleViewConnection = (connectionId: string) => {
    setSelectedConnectionId(connectionId);
    setIsModalOpen(true);
  };

  // Load selected option from localStorage on component mount
  useEffect(() => {
    const storedOption = localStorage.getItem('selected_option_value');
    if (storedOption && metadata.options?.includes(storedOption)) {
      setSelectedOption(storedOption);
    }
  }, [metadata.options]);

  // Handle selecting an individual option
  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    localStorage.setItem('selected_option_value', option);
  };

  // Create a wrapper for onConnect to handle the parameter type conversion
  const handleConnect = (option: string[] | string, context?: string) => {
    if (onConnect) {
      // We store the selected value in localStorage for external components to use
      if (Array.isArray(option)) {
        // For combinations
        localStorage.setItem('selected_combination_value', option.join(', '));
        
        // Pass the properly formatted data to onConnect
        onConnect({
          value: option,
          propertyValues: { 
            selectedOptions: option,
            contextType: context || "Multiple Options"
          }
        } as any, context || "Multiple Options");
      } else {
        // For individual options
        localStorage.setItem('selected_option_value', option);
        
        // For string options, we format differently
        onConnect({
          value: option,
          propertyValues: { 
            selectedOption: option,
            contextType: context || "Multiple Options - Individual" 
          }
        } as any, context || "Multiple Options - Individual");
      }
    }
  };

  return (
    <div className="space-y-6 mt-2">
      {/* Individual options section */}
      {(metadata.options || []).length > 0 ? (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-400">Individual Options:</h4>
          <ScrollArea className="h-[150px]">
            <div className="space-y-2 pr-1">
              {metadata.options.map((option: string, index: number) => {
                // Check if this individual option is connected
                const isConnected = isOptionConnected(option);
                const connection = isConnected ? getConnectionForOption(option) : null;
                
                // Determine if this option is selected
                const isSelected = selectedOption === option;
                
                // Build the className based on selection and hover states
                let rowClassName = "flex items-center justify-between p-2 rounded cursor-pointer transition-colors ";
                
                // Add selection styling with enhanced visibility for selected option
                if (isSelected) {
                  // Enhanced styling for selected option - brighter colors, bolder appearance
                  rowClassName += "border-2 border-[#F97316] bg-[#F97316]/30 shadow-[0_0_12px_rgba(249,115,22,0.5)] font-medium";
                } else {
                  rowClassName += "border border-[#00FF00]/20 bg-black/30 hover:bg-[#00FF00]/10";
                }
                
                return (
                  <div 
                    key={`option-${index}`} 
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
                      {isConnected && connection?.id && (
                        <ConnectionBadge 
                          type="option"
                          label="Connected"
                          connectionId={connection.id}
                          onViewConnection={() => handleViewConnection(connection.id as string)} 
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      ) : (
        <div className="text-gray-500 italic text-sm">No options added yet</div>
      )}

      {/* Combinations section */}
      {(metadata.options || []).length > 0 ? (
        <div>
          <MultipleOptionsCombinationsContent 
            metadata={metadata}
            screenId={screenId}
            onConnect={handleConnect}
            isOptionConnected={(option) => {
              // Convert array to string for connection checks if needed
              const optionValue = Array.isArray(option) ? JSON.stringify(option) : option;
              return isOptionConnected(optionValue);
            }}
            onViewConnection={(option) => {
              // Convert array to string for connection retrieval if needed
              const optionValue = Array.isArray(option) ? JSON.stringify(option) : option;
              const connection = getConnectionForOption(optionValue);
              if (connection?.id) {
                handleViewConnection(connection.id);
              }
            }}
          />
        </div>
      ) : null}
      
      {/* Connection details modal */}
      <ConnectionDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        connectionId={selectedConnectionId}
      />
    </div>
  );
}
