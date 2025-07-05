
import React, { useState, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useOptionConnections } from '@/hooks/widgets/connection/useOptionConnections';
import { generateCombinations } from './optionUtils';
import { CombinationRow } from './CombinationRow';
import { ConnectionDetailsModal } from '../../../../connections/ConnectionDetailsModal';

interface MultipleOptionsProps {
  options: string[];
  screenId?: string;
  widgetId?: string;
  isReviewMode?: boolean;
  onConnect: (value: any, context?: string) => void;
}

export const MultipleOptions: React.FC<MultipleOptionsProps> = ({
  options,
  screenId,
  widgetId,
  isReviewMode = false,
  onConnect
}) => {
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Get current connections
  const { 
    connections,
    isOptionConnected, 
    getConnectionForOption,
    clearSelectedValues
  } = useOptionConnections({
    screenId,
    contextType: "Multiple Options"
  });

  // Generate all possible combinations of options
  const combinations = generateCombinations(options);
  
  // Clean up selected values when component unmounts
  useEffect(() => {
    return () => {
      clearSelectedValues();
    };
  }, []);
  
  // Handle viewing a connection
  const handleViewConnection = (connectionId: string) => {
    setSelectedConnectionId(connectionId);
    setIsModalOpen(true);
  };

  // Handle clicking on a combination (for Define mode)
  const handleCombinationSelect = (combination: string[]) => {
    if (!isReviewMode) {
      localStorage.setItem('selected_combination_value', combination.join(', '));
    }
  };

  return (
    <>
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
                
                // Check if this combination matches the selected combination in localStorage (only in Define mode)
                const selectedCombination = !isReviewMode ? (localStorage.getItem('selected_combination_value')?.split(', ') || []) : [];
                const isSelected = !isReviewMode && JSON.stringify(selectedCombination.sort()) === JSON.stringify(combination.sort());
                
                return (
                  <CombinationRow
                    key={index}
                    combination={combination}
                    index={index}
                    isSelected={isSelected}
                    isReviewMode={isReviewMode}
                    isConnected={connected}
                    connectionId={connection?.id}
                    onSelect={() => handleCombinationSelect(combination)}
                    onViewConnection={handleViewConnection}
                    onConnect={onConnect}
                    widgetId={widgetId}
                    screenId={screenId}
                  />
                );
              })}
            </div>
          </ScrollArea>
        ) : (
          <p className="text-gray-500 text-sm">No options defined yet</p>
        )}
      </div>
      
      {/* Connection details modal */}
      <ConnectionDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        connectionId={selectedConnectionId}
      />
    </>
  );
};
