
import React, { useState, useEffect } from 'react';
import { useOptionConnections } from '@/hooks/widgets/connection/useOptionConnections';

import { OptionRow } from './OptionRow';
import { ConnectionDetailsModal } from '../../../../connections/ConnectionDetailsModal';

interface RadioOptionsProps {
  options: string[];
  screenId?: string;
  widgetId?: string;
  isReviewMode?: boolean;
  onConnect: (value: any, context?: string) => void;
}

export const RadioOptions: React.FC<RadioOptionsProps> = ({ 
  options, 
  screenId,
  widgetId,
  isReviewMode = false,
  onConnect
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Get current connections
  const { 
    connections,
    isOptionConnected, 
    getConnectionForOption,
    clearSelectedValues
  } = useOptionConnections(screenId, "Radio Button");

  // Load selected option from localStorage only in Define mode
  useEffect(() => {
    if (!isReviewMode) {
      const storedOption = localStorage.getItem('selected_option_value');
      if (storedOption && options.includes(storedOption)) {
        setSelectedOption(storedOption);
      } else {
        setSelectedOption(null);
      }
    }
  }, [options, isReviewMode]);

  // Clean up selected values when component unmounts
  useEffect(() => {
    return () => {
      clearSelectedValues();
    };
  }, []);

  // Handle selecting an individual option - only in Define mode
  const handleOptionSelect = (option: string) => {
    if (!isReviewMode) {
      setSelectedOption(option);
      localStorage.setItem('selected_option_value', option);
    }
  };
  
  // Handle viewing a connection
  const handleViewConnection = (connectionId: string) => {
    setSelectedConnectionId(connectionId);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="space-y-2 mt-4">
        {options.map((option, index) => {
          // Check if this option is connected
          const connected = isOptionConnected(option);
          const connection = connected ? getConnectionForOption(option) : null;
          
          // Check if this option is selected (only show in Define mode)
          const isSelected = !isReviewMode && selectedOption === option;
          
          return (
            <OptionRow
              key={index}
              option={option}
              index={index}
              isSelected={isSelected}
              isReviewMode={isReviewMode}
              isConnected={connected}
              connectionId={connection?.id}
              onSelect={() => handleOptionSelect(option)}
              onViewConnection={handleViewConnection}
              onConnect={onConnect}
              widgetId={widgetId}
              screenId={screenId}
            />
          );
        })}
        {options.length === 0 && (
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
