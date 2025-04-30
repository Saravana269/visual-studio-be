
import React from "react";

interface FrameworkTypeHeaderProps {
  frameworkType: string | null;
}

export const FrameworkTypeHeader = ({ frameworkType }: FrameworkTypeHeaderProps) => {
  return (
    <div className="mb-4">
      <span className="bg-[#00FF00]/20 text-[#00FF00] border border-[#00FF00]/30 px-2 py-1 rounded text-sm">
        {frameworkType}
      </span>
    </div>
  );
};
