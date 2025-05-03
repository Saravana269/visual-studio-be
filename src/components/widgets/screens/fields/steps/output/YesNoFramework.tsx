
import React from "react";
import { ConnectButton } from "./ConnectButton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface YesNoFrameworkProps {
  value: boolean | null | string;
  onConnect: (value: any, context?: string) => void;
  widgetId?: string;
}

export const YesNoFramework = ({ value, onConnect, widgetId }: YesNoFrameworkProps) => {
  // Convert string or boolean values to boolean for the toggle
  const isEnabled = value === true || value === "yes" || value === "true";
  
  return (
    <div className="space-y-3">
      <h4 className="text-base font-medium">Yes/No Configuration</h4>
      
      <div className="mb-4 p-3 border border-gray-800 rounded-md bg-black/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Switch id="yes-no-toggle" checked={isEnabled} disabled />
            <Label htmlFor="yes-no-toggle" className="text-sm text-gray-300">
              {isEnabled ? 'Yes' : 'No'}
            </Label>
          </div>
          <ConnectButton 
            value={isEnabled ? true : false} 
            context="toggle_value" 
            onConnect={onConnect}
            widgetId={widgetId}
          />
        </div>
      </div>
      
      <div className="flex space-x-3">
        <div className="p-2 border border-gray-800 rounded-md flex-1 bg-black/30">
          <div className="flex items-center justify-between">
            <p className="text-sm">Yes</p>
            <ConnectButton value={true} context="yes_option" onConnect={onConnect} widgetId={widgetId} />
          </div>
        </div>
        <div className="p-2 border border-gray-800 rounded-md flex-1 bg-black/30">
          <div className="flex items-center justify-between">
            <p className="text-sm">No</p>
            <ConnectButton value={false} context="no_option" onConnect={onConnect} widgetId={widgetId} />
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-400">Default value: {value === null ? 'Not set' : (value === true || value === "yes" || value === "true") ? 'Yes' : 'No'}</p>
    </div>
  );
};
