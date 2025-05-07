
import React from "react";
import { ConnectButton } from "./ConnectButton";
import { useScreenConnections } from "@/hooks/widgets/connection/useScreenConnections";
import { ConnectionBadge } from "../../connections/ConnectionBadge";

interface InformationFrameworkProps {
  text: string | undefined;
  onConnect: (value: any, context?: string) => void;
  widgetId?: string;
  screenId?: string;
}

export const InformationFramework = ({ text, onConnect, widgetId, screenId }: InformationFrameworkProps) => {
  // Fetch existing connections for this screen
  const { connections } = useScreenConnections({
    screenId,
    enabled: !!screenId
  });
  
  // Check if this framework is already connected to another screen
  const hasExistingConnection = connections.some(conn => 
    conn.screen_ref === screenId && 
    conn.framework_type === "Information" && 
    !conn.is_screen_terminated &&
    conn.source_value === text
  );

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
              <ConnectButton value={text} context="info_text" onConnect={onConnect} widgetId={widgetId} />
            )}
            {text && hasExistingConnection && (
              <ConnectionBadge 
                connectionId="info-connected" 
                className="h-6 w-auto px-2 flex-shrink-0"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
