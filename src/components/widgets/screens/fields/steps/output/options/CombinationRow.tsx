
import React from 'react';
import { ConnectButton } from '../ConnectButton';
import { ConnectionBadge } from '../../../../connections/ConnectionBadge';

interface CombinationRowProps {
  combination: string[];
  index: number;
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

export const CombinationRow: React.FC<CombinationRowProps> = ({
  combination,
  index,
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
  // Row click handler
  const handleClick = () => {
    if (!isReviewMode) {
      onSelect();
    }
  };
  
  // View connection details handler
  const handleViewConnection = () => {
    if (connectionId && onViewConnection) {
      onViewConnection(connectionId);
    }
  };
  
  // Connect handler
  const handleConnect = (value: any, context?: string) => {
    if (onConnect) {
      onConnect(value, context);
    }
  };
  
  return (
    <div
      className={`
        p-3 rounded-md cursor-pointer flex justify-between items-center
        ${isSelected ? 'bg-green-500/20 border-2 border-green-500' : 'bg-gray-900 border border-gray-800 hover:bg-gray-800'}
        ${isSelected ? 'mb-4' : 'mb-2'}
        transition-all duration-150
      `}
      onClick={handleClick}
    >
      <div className="flex items-center">
        <span className="text-sm">
          {combination.join(", ")}
        </span>
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
            value={combination.join(', ')}
            context="Multiple Options"
            onConnect={handleConnect}
            widgetId={widgetId}
            screenId={screenId}
          />
        )}
      </div>
    </div>
  );
};
