
import React from "react";
import { ConnectButton } from "./ConnectButton";

interface InformationFrameworkProps {
  text: string | undefined;
  onConnect: (value: any, context?: string) => void;
  widgetId?: string;
}

export const InformationFramework = ({ text, onConnect, widgetId }: InformationFrameworkProps) => {
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
            {text && <ConnectButton value={text} context="info_text" onConnect={onConnect} widgetId={widgetId} />}
          </div>
        </div>
      </div>
    </div>
  );
}
