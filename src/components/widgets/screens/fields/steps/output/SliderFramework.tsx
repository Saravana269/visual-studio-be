
import React from "react";
import { ConnectButton } from "./ConnectButton";

interface SliderFrameworkProps {
  min: number;
  max: number;
  step: number;
  onConnect: (value: any, context?: string) => void;
}

export const SliderFramework = ({ min, max, step, onConnect }: SliderFrameworkProps) => {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium">Slider Configuration</h4>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-3 border border-gray-800 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Min Value</p>
              <p className="text-xl font-medium">{min || 0}</p>
            </div>
            <ConnectButton value={min || 0} context="min_value" onConnect={onConnect} />
          </div>
        </div>
        <div className="p-3 border border-gray-800 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Max Value</p>
              <p className="text-xl font-medium">{max || 100}</p>
            </div>
            <ConnectButton value={max || 100} context="max_value" onConnect={onConnect} />
          </div>
        </div>
        <div className="p-3 border border-gray-800 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Step</p>
              <p className="text-xl font-medium">{step || 1}</p>
            </div>
            <ConnectButton value={step || 1} context="step_value" onConnect={onConnect} />
          </div>
        </div>
      </div>
    </div>
  );
};
