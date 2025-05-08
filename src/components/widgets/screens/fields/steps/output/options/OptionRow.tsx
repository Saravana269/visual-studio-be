
import React from 'react';
import { ConnectionBadge } from '../../../../connections/ConnectionBadge';
import { ConnectButton } from '../ConnectButton';
import { buildRowClassName } from './optionUtils';

interface OptionRowProps {
  option: string;
  index: number;
  isSelected: boolean;
  isReviewMode: boolean;
  isConnected: boolean;
  connectionId?: string;
  onSelect?: () => void;
  onViewConnection?: (connectionId: string) => void;
  onConnect?: (value: any, context?: string) => void;
  widgetId?: string;
  screenId?: string;
}

export const OptionRow: React.FC<OptionRowProps> = ({
  option,
  index,
  isSelected,
  isReviewMode,
  isConnected,
  connectionId,
  onSelect,
  onViewConnection,
  onConnect,
  widgetId,
  screenId
}) => {
  const rowClassName = buildRowClassName(isSelected, isReviewMode);
  
  return (
    <div 
      className={rowClassName}
      onClick={!isReviewMode && onSelect ? onSelect : undefined}
    >
      <div className="flex items-center">
        {isSelected && !isReviewMode && (
          <span className="text-[#F97316] mr-2">●</span>
        )}
        <span className={`text-sm ${isSelected && !isReviewMode ? 'text-white' : ''}`}>{option}</span>
      </div>
      <div className="flex items-center space-x-2">
        {isConnected && connectionId && onViewConnection ? (
          <ConnectionBadge 
            connectionId={connectionId}
            onViewConnection={() => onViewConnection(connectionId)}
          />
        ) : !isReviewMode && onConnect && (
          <ConnectButton 
            value={option} 
            context={`element_id_${index}`}
            onConnect={(value) => {
              // Only store the selected option in propertyValues
              onConnect({
                value,
                propertyValues: { selectedOption: option }
              }, `element_id_${index}`);
            }}
            widgetId={widgetId}
            screenId={screenId}
          />
        )}
      </div>
    </div>
  );
};
