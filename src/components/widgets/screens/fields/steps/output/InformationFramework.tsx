
import React from "react";
import { ConnectButton } from "./ConnectButton";
import { useScreenConnections } from "@/hooks/widgets/connection/useScreenConnections";
import { ConnectionBadge } from "@/components/widgets/screens/connections/ConnectionBadge";
import { useOptionConnections } from "@/hooks/widgets/connection/useOptionConnections";

interface InformationFrameworkProps {
  text: string | undefined;
  onConnect: (value: any, context?: string) => void;
  widgetId?: string;
  screenId?: string;
}

export const InformationFramework = ({ text, onConnect, widgetId, screenId }: InformationFrameworkProps) => {
  // Use the custom hook to check for existing Information framework connections
  const { connections, isFrameworkConnected, isOptionConnected } = useOptionConnections(screenId, "Information");
  
  // Check if this specific text content is already connected
  const hasExistingConnection = connections.some(conn => 
    conn.screen_ref === screenId &&
    conn.framework_type === "Information" && 
    !conn.is_screen_terminated &&
    conn.source_value === text
  );

  // Find the connection for displaying the badge
  const existingConnection = connections.find(conn => 
    conn.screen_ref === screenId &&
    conn.framework_type === "Information" && 
    !conn.is_screen_terminated &&
    conn.source_value === text
  );
  
  console.log("Information framework connections:", {
    hasExistingConnection,
    connections,
    screenId,
    text
  });

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Information Content</h4>
      <div className="max-h-60 overflow-y-auto">
        <div className="p-3 border border-gray-800 rounded-md">
          <div className="flex items-start justify-between">
            {text ? (
              <p className="whitespace-pre-wrap pr-4 text-sm">{text}</p>
            ) : (
              <p className="text-gray-500 text-sm">No information text provided</p>
            )}
            {text && !hasExistingConnection && (
              <ConnectButton 
                value={text} 
                context="info_text" 
                onConnect={onConnect} 
                widgetId={widgetId} 
                screenId={screenId}
              />
            )}
            {text && hasExistingConnection && existingConnection && (
              <ConnectionBadge 
                connectionId={existingConnection.id} 
                className="h-6 w-auto px-2 flex-shrink-0"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
