
import React from 'react';
import { ConnectButton } from '../ConnectButton';
import { ConnectionBadge } from '../../../../connections/ConnectionBadge';

interface OptionRowProps {
  option: string;
  isSelected: boolean;
  isConnected: boolean;
  isReviewMode?: boolean;
  connectionId?: string;
  onSelect: () => void;
  onViewConnection?: (connectionId: string) => void;
  onConnect?: (value: any, context?: string) => void;
  widgetId?: string;
  screenId?: string;
}

export const OptionRow: React.FC<OptionRowProps> = ({
  option,
  isSelected,
  isConnected,
  isReviewMode = false,
  connectionId,
  onSelect,
  onViewConnection,
  onConnect,
  widgetId,
  screenId
}) => {
  // Handle row click
  const handleClick = () => {
    if (!isReviewMode) {
      onSelect();
    }
  };
  
  // Handle view connection
  const handleViewConnection = () => {
    if (connectionId && onViewConnection) {
      onViewConnection(connectionId);
    }
  };
  
  return (
    <div
      className={`
        p-3 rounded-md cursor-pointer flex justify-between items-center
        ${isSelected ? 'bg-green-500/20 border-2 border-green-500' : 'bg-gray-900 border border-gray-800 hover:bg-gray-800'}
        transition-all duration-150 mb-2
      `}
      onClick={handleClick}
    >
      <div className="flex items-center">
        <span className="text-sm">{option}</span>
      </div>
      
      <div className="flex items-center">
        {isConnected && connectionId && onViewConnection && (
          <ConnectionBadge 
            type="option"
            label="Connected"
            connectionId={connectionId} 
            onViewConnection={handleViewConnection} 
          />
        )}
        
        {!isConnected && isSelected && onConnect && !isReviewMode && (
          <ConnectButton
            value={option}
            context="Multiple Options - Individual"
            onConnect={onConnect}
            widgetId={widgetId}
            screenId={screenId}
          />
        )}
      </div>
    </div>
  );
};
