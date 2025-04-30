
import React from "react";
import { ConnectButton } from "./ConnectButton";
import { ScrollArea } from "@/components/ui/scroll-area";

interface OptionsFrameworkProps {
  options: string[];
  onConnect: (value: any, context?: string) => void;
}

export const OptionsFramework = ({ options, onConnect }: OptionsFrameworkProps) => {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Options</h4>
      
      {/* Only the options list is scrollable */}
      <ScrollArea className="h-[180px]">
        <div className="pr-1">
          {options && options.length > 0 ? (
            <ul className="space-y-2">
              {options.map((option: string, index: number) => (
                <li key={index} className="text-gray-300 flex items-center justify-between text-sm p-1.5 border border-gray-800 rounded">
                  <span>{option}</span>
                  <ConnectButton value={option} context={`option_${index}`} onConnect={onConnect} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No options defined</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
