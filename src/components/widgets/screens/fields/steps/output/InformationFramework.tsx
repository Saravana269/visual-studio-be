
import React, { useState } from 'react';
import { ConnectButton } from './ConnectButton';
import { ConnectionBadge } from '../../../connections/ConnectionBadge';

interface InformationFrameworkProps {
  text?: string;
  onConnect: (value: any, context?: string) => void;
  widgetId?: string;
  screenId?: string;
  isReviewMode?: boolean;
}

export const InformationFramework: React.FC<InformationFrameworkProps> = ({
  text = "Information text not set",
  onConnect,
  widgetId,
  screenId,
  isReviewMode = false
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [hasBeenRead, setHasBeenRead] = useState(false);

  // After a user has been on the page for 5 seconds, consider the information as "read"
  React.useEffect(() => {
    if (!isReviewMode && !hasBeenRead) {
      const timer = setTimeout(() => {
        setHasBeenRead(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isReviewMode, hasBeenRead]);

  const handleConnect = () => {
    // When connecting, pass the "read" status
    onConnect({ 
      read: true, 
      timestamp: new Date().toISOString() 
    }, "Information");
    
    setIsConnected(true);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Information</h2>
        
        {/* Show connection status or connect button */}
        {isConnected ? (
          <ConnectionBadge 
            type="framework"
            label="Information Read"
            connectionId="information" 
            className="ml-auto" 
          />
        ) : (
          !isReviewMode && hasBeenRead && (
            <ConnectButton 
              value={{ read: true, timestamp: new Date().toISOString() }} 
              context="Information"
              onConnect={onConnect}
              widgetId={widgetId}
              screenId={screenId}
            />
          )
        )}
      </div>
      
      <div className="prose prose-invert max-w-none">
        <p className="text-gray-300">{text}</p>
      </div>
      
      {isReviewMode && (
        <div className="border-t border-gray-800 pt-4 mt-6">
          <p className="text-xs text-gray-500">
            In the user flow, this information will need to be viewed for a few seconds before the user can proceed.
          </p>
        </div>
      )}
    </div>
  );
};
