
import React from "react";
import { ConnectButton } from "./ConnectButton";

interface OptionsFrameworkProps {
  options: string[];
  onConnect: (value: any, context?: string) => void;
}

export const OptionsFramework = ({ options, onConnect }: OptionsFrameworkProps) => {
  return (
    <div className="space-y-3">
      <h4 className="text-base font-medium">Options</h4>
      <div className="max-h-60 overflow-y-auto pr-1">
        {options && options.length > 0 ? (
          <ul className="space-y-2 pl-5 list-disc">
            {options.map((option: string, index: number) => (
              <li key={index} className="text-gray-300 flex items-center justify-between text-sm">
                <span>{option}</span>
                <ConnectButton value={option} context={`option_${index}`} onConnect={onConnect} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No options defined</p>
        )}
      </div>
    </div>
  );
};
