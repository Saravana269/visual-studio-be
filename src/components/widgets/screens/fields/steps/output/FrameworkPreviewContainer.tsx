
import React, { ReactNode } from "react";

interface FrameworkPreviewContainerProps {
  children: ReactNode;
}

export const FrameworkPreviewContainer = ({ children }: FrameworkPreviewContainerProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Framework Output Preview</h3>
        <div className="p-4 border border-gray-800 rounded-lg bg-gray-950">
          {children}
        </div>
      </div>
    </div>
  );
};
