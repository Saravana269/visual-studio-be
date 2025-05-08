
import React from 'react';
import { ConnectionBadge } from '../../../../connections/ConnectionBadge';
import { ConnectButton } from '../ConnectButton';
import { buildRowClassName } from './optionUtils';

interface CombinationRowProps {
  combination: string[];
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

export const CombinationRow: React.FC<CombinationRowProps> = ({
  combination,
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
        <span className={`text-sm ${isSelected && !isReviewMode ? 'text-white' : ''}`}>
          {combination.join(", ")}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        {isConnected && connectionId && onViewConnection ? (
          <ConnectionBadge 
            connectionId={connectionId}
            onViewConnection={() => onViewConnection(connectionId)}
          />
        ) : !isReviewMode && onConnect && (
          <ConnectButton 
            value={combination} 
            context={`combination_${index}`}
            onConnect={(value) => {
              // Only store the selected combination in propertyValues
              onConnect({
                value,
                propertyValues: { 
                  selectedOptions: combination,
                  combinationString: combination.join(', ')
                }
              }, `combination_${index}`);
            }}
            widgetId={widgetId}
            screenId={screenId}
          />
        )}
      </div>
    </div>
  );
};
