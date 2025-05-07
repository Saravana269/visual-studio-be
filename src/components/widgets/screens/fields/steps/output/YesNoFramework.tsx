
import React from "react";
import { ConnectButton } from "./ConnectButton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useOptionConnections } from "@/hooks/widgets/connection/useOptionConnections";
import { ConnectionBadge } from "@/components/widgets/screens/connections/ConnectionBadge";

interface YesNoFrameworkProps {
  value: boolean | null | string;
  onConnect: (value: any, context?: string) => void;
  widgetId?: string;
  screenId?: string;
}

export const YesNoFramework = ({ value, onConnect, widgetId, screenId }: YesNoFrameworkProps) => {
  // Convert string or boolean values to boolean for the toggle
  const isEnabled = value === true || value === "yes" || value === "true";
  
  // Use the option connections hook to check for existing connections
  const { 
    isOptionConnected, 
    getConnectionForOption 
  } = useOptionConnections(screenId, "Yes / No");
  
  // Check if Yes or No options are already connected
  const yesConnected = isOptionConnected("true");
  const noConnected = isOptionConnected("false");
  
  // Get connection details if connected
  const yesConnection = yesConnected ? getConnectionForOption("true") : null;
  const noConnection = noConnected ? getConnectionForOption("false") : null;
  
  console.log("🔄 Yes/No framework rendering:", {
    screenId,
    value,
    yesConnected,
    noConnected,
    yesConnectionId: yesConnection?.id,
    noConnectionId: noConnection?.id
  });
  
  return (
    <div className="space-y-3">
      <h4 className="text-base font-medium">Yes/No Configuration</h4>
      
      <div className="mb-4 p-3 border border-gray-800 rounded-md bg-black/30">
        <div className="flex items-center">
          <Switch id="yes-no-toggle" checked={isEnabled} disabled />
          <Label htmlFor="yes-no-toggle" className="text-sm text-gray-300 ml-3">
            {isEnabled ? 'Yes' : 'No'}
          </Label>
        </div>
      </div>
      
      <div className="flex space-x-3">
        <div className="p-2 border border-gray-800 rounded-md flex-1 bg-black/30">
          <div className="flex items-center justify-between">
            <p className="text-sm">Yes</p>
            {yesConnected && yesConnection ? (
              <ConnectionBadge 
                connectionId={yesConnection.id}
                onViewConnection={() => {
                  console.log("View Yes connection:", yesConnection.id);
                  // Connection view logic could be added here
                }}
              />
            ) : (
              <ConnectButton 
                value={true} 
                context="yes_option" 
                onConnect={onConnect} 
                widgetId={widgetId} 
              />
            )}
          </div>
        </div>
        <div className="p-2 border border-gray-800 rounded-md flex-1 bg-black/30">
          <div className="flex items-center justify-between">
            <p className="text-sm">No</p>
            {noConnected && noConnection ? (
              <ConnectionBadge 
                connectionId={noConnection.id}
                onViewConnection={() => {
                  console.log("View No connection:", noConnection.id);
                  // Connection view logic could be added here
                }}
              />
            ) : (
              <ConnectButton 
                value={false} 
                context="no_option" 
                onConnect={onConnect} 
                widgetId={widgetId} 
              />
            )}
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-400">Default value: {value === null ? 'Not set' : (value === true || value === "yes" || value === "true") ? 'Yes' : 'No'}</p>
    </div>
  );
};
