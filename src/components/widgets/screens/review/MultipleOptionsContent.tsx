
import { ScrollArea } from "@/components/ui/scroll-area";
import { MultipleOptionsCombinationsContent } from "./MultipleOptionsCombinationsContent";
import { useState } from "react";
import { ConnectionDetailsModal } from "../connections/ConnectionDetailsModal";
import { useOptionConnections } from "@/hooks/widgets/connection/useOptionConnections";

interface MultipleOptionsContentProps {
  metadata: Record<string, any>;
  screenId?: string;
  onConnect?: (option: string[] | string, context?: string) => void; // Updated to accept both string[] and string
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
  const handleConnect = (option: string, index: number) => {
    if (onConnect) {
      onConnect([option], `option_${index}`);
    }
  };

  return (
    <div className="space-y-2 mt-2">
      {/* Only show combinations */}
      {(metadata.options || []).length > 0 ? (
        <MultipleOptionsCombinationsContent 
          metadata={metadata}
          screenId={screenId}
          onConnect={onConnect}
          isOptionConnected={isOptionConnected}
          onViewConnection={(option) => {
            const connection = getConnectionForOption(option);
            if (connection?.id) {
              handleViewConnection(connection.id);
            }
          }}
        />
      ) : (
        <div className="text-gray-500 italic text-sm">No options added yet</div>
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
