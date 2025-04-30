
import React from "react";
import { ConnectButton } from "./ConnectButton";

interface YesNoFrameworkProps {
  value: boolean | null;
  onConnect: (value: any, context?: string) => void;
}

export const YesNoFramework = ({ value, onConnect }: YesNoFrameworkProps) => {
  return (
    <div className="space-y-3">
      <h4 className="text-base font-medium">Yes/No Configuration</h4>
      <div className="flex space-x-3">
        <div className="p-2 border border-gray-800 rounded-md flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm">Yes</p>
            <ConnectButton value="yes" context="yes_option" onConnect={onConnect} />
          </div>
        </div>
        <div className="p-2 border border-gray-800 rounded-md flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm">No</p>
            <ConnectButton value="no" context="no_option" onConnect={onConnect} />
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-400">Default value: {value === null ? 'Not set' : value ? 'Yes' : 'No'}</p>
    </div>
  );
};
