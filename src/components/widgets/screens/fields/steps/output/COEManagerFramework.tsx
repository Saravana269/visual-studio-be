
import React from "react";
import { ConnectButton } from "./ConnectButton";

interface COEManagerFrameworkProps {
  coeId: string | null | undefined;
  onConnect: (value: any, context?: string) => void;
}

export const COEManagerFramework = ({ coeId, onConnect }: COEManagerFrameworkProps) => {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium">COE Configuration</h4>
      <div className="p-3 border border-gray-800 rounded-md">
        <div className="flex items-center justify-between">
          <p>COE ID: {coeId || 'Not set'}</p>
          {coeId && <ConnectButton value={coeId} context="coe_id" onConnect={onConnect} />}
        </div>
      </div>
    </div>
  );
};
