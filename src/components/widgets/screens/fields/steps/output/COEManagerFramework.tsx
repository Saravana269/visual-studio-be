
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ElementCard } from './ElementCard';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useOptionConnections } from '@/hooks/widgets/connection/useOptionConnections';
import { useToast } from '@/hooks/use-toast';

interface COEManagerFrameworkProps {
  coeId?: string;
  onConnect?: (value: any, context?: string) => void;
  widgetId?: string;
  screenId?: string;
  isReviewMode?: boolean; 
  isConnected?: boolean;
}

export function COEManagerFramework({
  coeId,
  onConnect,
  widgetId,
  screenId,
  isReviewMode = false,
  isConnected = false
}: COEManagerFrameworkProps) {
  const { toast } = useToast();
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  
  // Get connection data
  const { 
    selectedValue,
    selectValue,
    getConnectionDetails,
    viewConnection,
    connectionIds
  } = useOptionConnections({
    widgetId,
    screenId,
    contextType: "COE Manager"
  });

  // Query to get COE details
  const { data: coe } = useQuery({
    queryKey: ['coe-detail', coeId],
    queryFn: async () => {
      if (!coeId) return null;
      const { data, error } = await supabase
        .from('coes')
        .select('*')
        .eq('id', coeId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!coeId
  });
  
  // Query to get COE elements
  const { data: elements = [] } = useQuery({
    queryKey: ['coe-elements', coeId],
    queryFn: async () => {
      if (!coeId) return [];
      
      const { data, error } = await supabase
        .from('coe_elements')
        .select(`
          id,
          name,
          status,
          element_id,
          elements (*)
        `)
        .eq('coe_id', coeId);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!coeId
  });

  // Select element handler
  const handleSelectElement = (elementId: string) => {
    if (isReviewMode) return;
    selectValue(elementId);
    setSelectedElementId(elementId);
  };
  
  // Connect element handler
  const handleConnectElement = (elementId: string) => {
    if (!onConnect) return;
    
    // Find the element
    const element = elements.find(el => el.element_id === elementId);
    if (!element) {
      toast({
        title: "Error",
        description: "Element not found",
        variant: "destructive"
      });
      return;
    }
    
    // Connect with both element ID and element data
    onConnect({
      elementId,
      elementData: element
    }, "COE Manager");
  };
  
  // See if an element is connected
  const isElementConnected = (elementId: string) => {
    return connectionIds[elementId] !== undefined;
  };
  
  // Get connection ID for an element
  const getElementConnectionId = (elementId: string) => {
    return connectionIds[elementId];
  };
  
  // Handle view connection
  const handleViewElementConnection = (elementId: string) => {
    const connectionId = getElementConnectionId(elementId);
    if (connectionId) {
      viewConnection(connectionId);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-300">COE Manager Framework</h3>
      
      {coe && (
        <div className="mb-4">
          <h3 className="font-medium">{coe.name}</h3>
          {coe.description && <p className="text-gray-400 text-sm">{coe.description}</p>}
        </div>
      )}
      
      <ScrollArea className="h-64 rounded border border-gray-800 bg-black p-2">
        <div className="space-y-1">
          {elements.length > 0 ? (
            elements.map((element) => {
              const isConnected = isElementConnected(element.element_id);
              const connectionId = getElementConnectionId(element.element_id);
              
              return (
                <ElementCard
                  key={element.element_id}
                  elementName={element.elements?.name || "Unnamed Element"}
                  elementId={element.element_id}
                  isSelected={selectedElementId === element.element_id}
                  isConnected={isConnected}
                  connectionId={connectionId}
                  onSelect={() => handleSelectElement(element.element_id)}
                  onViewConnection={
                    isConnected && connectionId 
                      ? () => handleViewElementConnection(element.element_id)
                      : undefined
                  }
                />
              );
            })
          ) : (
            <div className="text-center p-4 text-gray-500">
              {coeId 
                ? "No elements assigned to this COE" 
                : "No COE selected"}
            </div>
          )}
        </div>
      </ScrollArea>
      
      {!isReviewMode && selectedElementId && !isElementConnected(selectedElementId) && onConnect && (
        <div className="flex justify-end">
          <Button 
            onClick={() => handleConnectElement(selectedElementId)}
            className="bg-[#00FF00] text-black hover:bg-[#00FF00]/80"
          >
            Connect Element
          </Button>
        </div>
      )}
    </div>
  );
}
