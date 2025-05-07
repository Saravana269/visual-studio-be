import { ScrollArea } from "@/components/ui/scroll-area";
import { MultipleOptionsCombinationsContent } from "./MultipleOptionsCombinationsContent";
import { useState } from "react";
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
  
  // Get connection data for options
  const { isOptionConnected, getConnectionForOption } = useOptionConnections(screenId, "Multiple Options");
  
  // Handle viewing a connection
  const handleViewConnection = (connectionId: string) => {
    setSelectedConnectionId(connectionId);
    setIsModalOpen(true);
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
                
                return (
                  <div 
                    key={`option-${index}`} 
                    className="flex items-center justify-between p-2 rounded 
                              border border-[#00FF00]/20 bg-black/30 hover:bg-[#00FF00]/10"
                  >
                    <span className="text-sm">{option}</span>
                    <div className="flex items-center space-x-2">
                      {isConnected ? (
                        <ConnectionBadge 
                          connectionId={`option_${index}`} 
                          onViewConnection={() => {
                            const connection = getConnectionForOption(option);
                            if (connection?.id) {
                              handleViewConnection(connection.id);
                            }
                          }} 
                        />
                      ) : (
                        onConnect && (
                          <button 
                            onClick={() => handleConnect(option, "Multiple Options - Individual")}
                            className="text-xs bg-[#00FF00]/20 text-[#00FF00] hover:bg-[#00FF00]/30 px-2 py-1 rounded-md flex items-center gap-1"
                          >
                            Connect
                          </button>
                        )
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
