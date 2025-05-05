
import React from "react";
import { Screen } from "@/types/screen";
import { renderMetadataPreview } from "../utils/metadataHelpers";

interface ScreenPreviewSectionProps {
  selectedScreenId: string | null;
  selectedScreen: Screen | null;
  isLoading: boolean;
}

export function ScreenPreviewSection({ 
  selectedScreenId, 
  selectedScreen, 
  isLoading 
}: ScreenPreviewSectionProps) {
  return (
    <div className="border border-gray-800 rounded-md p-4 bg-black/30">
      <h3 className="text-sm font-medium text-gray-200 mb-2">🔍 Preview</h3>
      
      {!selectedScreenId ? (
        <p className="text-xs text-gray-400">Select a screen to see preview</p>
      ) : isLoading ? (
        <p className="text-xs text-gray-400">Loading preview...</p>
      ) : selectedScreen ? (
        <div className="space-y-1">
          <div className="flex">
            <span className="text-xs font-medium text-gray-300 w-20">Name:</span>
            <span className="text-xs text-gray-300">{selectedScreen.name}</span>
          </div>
          <div className="flex">
            <span className="text-xs font-medium text-gray-300 w-20">Type:</span>
            <span className="text-xs text-gray-300">{selectedScreen.framework_type || "None"}</span>
          </div>
          {selectedScreen.metadata && (
            <div className="flex">
              <span className="text-xs font-medium text-gray-300 w-20">Metadata:</span>
              <span className="text-xs text-gray-300">
                {renderMetadataPreview(selectedScreen.framework_type, selectedScreen.metadata)}
              </span>
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs text-gray-400">Error loading preview</p>
      )}
    </div>
  );
}
