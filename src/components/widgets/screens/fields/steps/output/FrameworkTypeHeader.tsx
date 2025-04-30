
import React from "react";

interface FrameworkTypeHeaderProps {
  frameworkType: string;
}

export const FrameworkTypeHeader = ({ frameworkType }: FrameworkTypeHeaderProps) => {
  return (
    <div className="mb-4">
      <h3 className="text-base font-medium text-[#00FF00]">Framework Type: {frameworkType}</h3>
      <p className="text-xs text-gray-400 mt-1">
        This is the preview for the {frameworkType} framework. You can connect values to other components.
      </p>
    </div>
  );
};
