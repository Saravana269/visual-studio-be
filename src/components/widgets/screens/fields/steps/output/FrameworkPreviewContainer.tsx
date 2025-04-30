
import React, { ReactNode } from "react";

interface FrameworkPreviewContainerProps {
  children: ReactNode;
}

export const FrameworkPreviewContainer = ({ children }: FrameworkPreviewContainerProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold mb-3">Framework Output Preview</h3>
        <div className="p-3 border border-gray-800 rounded-lg bg-gray-950">
          {children}
        </div>
      </div>
    </div>
  );
};
