
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { ConnectionDetailsModal } from "../connections/ConnectionDetailsModal";
import { ConnectionBadge } from "../connections/ConnectionBadge";
import { useOptionConnections } from "@/hooks/widgets/connection/useOptionConnections";

interface RadioButtonContentProps {
  metadata: Record<string, any>;
  screenId?: string;
  onConnect?: (option: string, index: number) => void;
}

export function RadioButtonContent({
  metadata,
  screenId,
  onConnect
}: RadioButtonContentProps) {
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Get connection data for options
  const { isOptionConnected, getConnectionForOption } = useOptionConnections(screenId, "Radio Button");
  
  // Handle viewing a connection
  const handleViewConnection = (connectionId: string) => {
    setSelectedConnectionId(connectionId);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-2 mt-2">
      <h4 className="text-xs font-medium text-gray-400">Options:</h4>
      
      {/* Only the options list is scrollable */}
      <ScrollArea className="h-[200px]">
        <div className="space-y-2 pr-1">
          {(metadata.options || []).map((option: string, index: number) => {
            const isConnected = isOptionConnected(option);
            const connection = getConnectionForOption(option);
            
            return (
              <div 
                key={index} 
                className="flex items-center justify-between p-2 rounded border border-[#00FF00]/20 bg-black/30"
              >
                <span className="text-sm">{option}</span>
                {isConnected ? (
                  <ConnectionBadge 
                    connectionId={`option_${index}`}
                    onViewConnection={() => handleViewConnection(connection.id)}
                  />
                ) : onConnect && (
                  <button 
                    onClick={() => onConnect(option, index)}
                    className="px-2 py-1 text-xs text-[#00FF00] hover:bg-[#00FF00]/20 rounded"
                  >
                    Connect
                  </button>
                )}
              </div>
            );
          })}
          {(metadata.options || []).length === 0 && <div className="text-gray-500 italic text-sm">No options added yet</div>}
        </div>
      </ScrollArea>
      
      {/* Connection details modal */}
      <ConnectionDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        connectionId={selectedConnectionId}
      />
    </div>
  );
}
