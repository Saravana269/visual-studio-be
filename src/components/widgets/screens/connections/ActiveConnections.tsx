
import React from "react";
import { useScreenConnections } from "@/hooks/widgets/connection/useScreenConnections";
import { ConnectionCard } from "./ConnectionCard";
import { EmptyConnections } from "./EmptyConnections";
import { ConnectionsLoading } from "./ConnectionsLoading";
import { useConnectionRemoval } from "./utils/connection-utils";

interface ActiveConnectionsProps {
  screenId?: string;
  elementId?: string;
  widgetId?: string;
  refetch?: () => Promise<void>;
  isLoading?: boolean;
}

export function ActiveConnections({ 
  screenId, 
  elementId, 
  widgetId, 
  refetch, 
  isLoading: externalIsLoading 
}: ActiveConnectionsProps) {
  // Get connections data
  const { 
    connections, 
    isLoading: internalIsLoading, 
    refetchConnections 
  } = useScreenConnections({
    screenId,
    elementId,
    widgetId,
    enabled: !!(screenId || elementId || widgetId)
  });
  
  // Get connection removal utility
  const { removeConnection } = useConnectionRemoval();
  
  // Use external loading state if provided, otherwise use internal loading state
  const isLoading = externalIsLoading !== undefined ? externalIsLoading : internalIsLoading;
  
  // Use external refetch function if provided, otherwise use internal refetch function
  const handleRefetch = refetch || refetchConnections;

  // Handle removing a connection
  const handleRemoveConnection = async (connectionId: string) => {
    await removeConnection(connectionId, handleRefetch);
  };

  // Filter connections to only show outgoing connections from the current screen
  // This means only showing connections where the current screen is the source
  const relevantConnections = connections.filter(conn => 
    !conn.is_screen_terminated && conn.screen_ref === screenId
  );

  // Show loading state
  if (isLoading) {
    return <ConnectionsLoading />;
  }

  // Show empty state
  if (relevantConnections.length === 0) {
    return <EmptyConnections />;
  }

  // Show connections list
  return (
    <div className="space-y-2">
      {relevantConnections.map((connection) => (
        <ConnectionCard 
          key={connection.id} 
          connection={connection} 
          onRemove={handleRemoveConnection}
        />
      ))}
    </div>
  );
}
