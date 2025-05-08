
import React from "react";
import { Card } from "@/components/ui/card";
import { ActiveConnections } from "./ActiveConnections";
import { useScreenConnections } from "@/hooks/widgets/connection/useScreenConnections";

export interface ConnectionsPanelProps {
  screenId: string;
}

export function ConnectionsPanel({ screenId }: ConnectionsPanelProps) {
  const { connections, isLoading, refetchConnections } = useScreenConnections({
    screenId,
    enabled: !!screenId,
  });

  return (
    <div className="flex flex-col h-full border border-gray-800 rounded-lg overflow-hidden">
      <div className="bg-[#00FF00] p-4">
        <h2 className="text-black font-medium text-lg">Screen Connections</h2>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        <Card className="border-gray-700 bg-black/20">
          <ActiveConnections
            screenId={screenId}
            refetch={refetchConnections}
            isLoading={isLoading}
          />
        </Card>
      </div>
    </div>
  );
}
