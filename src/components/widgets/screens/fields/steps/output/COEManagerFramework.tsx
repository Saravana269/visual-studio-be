
import React, { useState, useEffect } from "react";
import { useCOEData } from "@/hooks/useCOEData";
import { useCOEElements } from "@/hooks/useCOEElements";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ElementCard } from "./ElementCard";
import { useOptionConnections } from "@/hooks/widgets/connection/useOptionConnections";

interface COEManagerFrameworkProps {
  coeId: string | null | undefined;
  onConnect: (value: any, context?: string) => void;
  widgetId?: string;
  screenId?: string;
}

export const COEManagerFramework = ({ coeId, onConnect, widgetId, screenId }: COEManagerFrameworkProps) => {
  const { data: coes } = useCOEData();
  const [selectedCoe, setSelectedCoe] = useState<any>(null);
  const { data: coeElements = [], isLoading: isLoadingElements } = useCOEElements(coeId);
  
  // Use the hook to check for existing element connections
  const { connections, isOptionConnected, getConnectionForOption } = 
    useOptionConnections(screenId, "COE Manager");
  
  // Find the selected COE from the list
  useEffect(() => {
    if (coeId && coes) {
      const coe = coes.find(c => c.id === coeId);
      if (coe) {
        setSelectedCoe(coe);
      }
    }
  }, [coeId, coes]);

  // Function to check if an element is connected
  const isElementConnected = (elementId: string): boolean => {
    // Need to check for connections with source_value containing the element ID
    // This handles both direct element IDs and serialized JSON objects
    return connections.some(conn => {
      // Check for direct match
      if (conn.source_value === elementId) return true;
      
      // Check for JSON objects containing the element ID
      try {
        if (typeof conn.source_value === 'string' && conn.source_value.includes(elementId)) {
          const parsedValue = JSON.parse(conn.source_value);
          return parsedValue.id === elementId;
        }
      } catch (e) {
        // Ignore parsing errors
      }
      
      return false;
    });
  };

  // Function to get the connection ID for an element
  const getElementConnectionId = (elementId: string): string | undefined => {
    const matchingConn = connections.find(conn => {
      // Check for direct match
      if (conn.source_value === elementId) return true;
      
      // Check for JSON objects containing the element ID
      try {
        if (typeof conn.source_value === 'string' && conn.source_value.includes(elementId)) {
          const parsedValue = JSON.parse(conn.source_value);
          return parsedValue.id === elementId;
        }
      } catch (e) {
        // Ignore parsing errors
      }
      
      return false;
    });
    
    return matchingConn?.id;
  };
  
  console.log("🔄 COE Manager rendering:", { 
    coeId, 
    widgetId,
    screenId,
    elementsCount: coeElements.length,
    connectionsCount: connections.length
  });

  if (!coeId) {
    return (
      <div className="text-gray-500 text-center p-8">
        No class of elements selected
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {selectedCoe && (
        <div>
          <h4 className="text-base font-medium mb-2">{selectedCoe.name}</h4>
          {selectedCoe.description && (
            <p className="text-sm text-gray-400 mb-4">{selectedCoe.description}</p>
          )}
        </div>
      )}

      {isLoadingElements ? (
        <div className="flex justify-center py-8">
          <div className="animate-pulse text-gray-400">Loading elements...</div>
        </div>
      ) : (
        <ScrollArea className="h-[300px]">
          <div className="space-y-2 pr-4">
            {coeElements.length > 0 ? (
              coeElements.map((element) => {
                const isConnected = isElementConnected(element.id);
                const connectionId = isConnected ? getElementConnectionId(element.id) : undefined;
                
                return (
                  <ElementCard 
                    key={element.id}
                    element={element}
                    onConnect={onConnect}
                    widgetId={widgetId}
                    isConnected={isConnected}
                    connectionId={connectionId}
                    onViewConnection={() => console.log("View connection for element:", element.id)}
                  />
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-4">No elements found for this class</p>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
