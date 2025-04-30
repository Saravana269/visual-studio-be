
import React from "react";
import { ConnectButton } from "./ConnectButton";

interface InformationFrameworkProps {
  text: string | undefined;
  onConnect: (value: any, context?: string) => void;
}

export const InformationFramework = ({ text, onConnect }: InformationFrameworkProps) => {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium">Information Content</h4>
      <div className="p-4 border border-gray-800 rounded-md">
        <div className="flex items-start justify-between">
          {text ? (
            <p className="whitespace-pre-wrap pr-4">{text}</p>
          ) : (
            <p className="text-gray-500">No information text provided</p>
          )}
          {text && <ConnectButton value={text} context="info_text" onConnect={onConnect} />}
        </div>
      </div>
    </div>
  );
};
