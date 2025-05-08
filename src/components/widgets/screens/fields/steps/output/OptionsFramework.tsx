
import React from "react";
import { RadioOptions } from "./options/RadioOptions";
import { MultipleOptions } from "./options/MultipleOptions";

interface OptionsFrameworkProps {
  options: string[];
  isRadio?: boolean;
  onConnect: (value: any, context?: string) => void;
  widgetId?: string;
  screenId?: string;
  isReviewMode?: boolean;
}

export function OptionsFramework({ 
  options = [], 
  isRadio = false,
  onConnect,
  widgetId,
  screenId,
  isReviewMode = false
}: OptionsFrameworkProps) {
  console.log("🔄 Options framework rendering:", {
    isRadio,
    isReviewMode,
    screenId,
    optionsCount: options.length,
  });

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-medium">
          {isRadio ? "Select one option" : "Available combinations"}
        </h2>
      </div>

      {isRadio ? (
        <RadioOptions
          options={options}
          screenId={screenId}
          widgetId={widgetId}
          isReviewMode={isReviewMode}
          onConnect={onConnect}
        />
      ) : (
        <MultipleOptions
          options={options}
          screenId={screenId}
          widgetId={widgetId}
          isReviewMode={isReviewMode}
          onConnect={onConnect}
        />
      )}
    </div>
  );
}
