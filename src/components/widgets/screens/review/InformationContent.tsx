
import React from "react";
import { ConnectionBadge } from "../connections/ConnectionBadge";

interface InformationContentProps {
  metadata: Record<string, any>;
  isConnected?: boolean;
  screenId?: string;
  onConnect?: () => void;
}

export function InformationContent({
  metadata,
  isConnected = false,
  screenId,
  onConnect,
}: InformationContentProps) {
  // Get the text from metadata
  const text = metadata.text || "No information text set";
  
  // If text is too long, create a shorter version for display
  const displayText = typeof text === 'string' && text.length > 120 
    ? text.slice(0, 120) + '...' 
    : text;

  return (
    <div className="space-y-4 mt-2">
      {/* Framework header with connection status */}
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-300">Information Framework</h3>
        
        {isConnected && screenId && (
          <ConnectionBadge 
            type="framework"
            label="Information"
            connectionId={`${screenId}_info`} 
            className="text-xs" 
          />
        )}
      </div>
      
      {/* Content area */}
      <div className="border border-[#00FF00]/20 bg-black/30 p-4 rounded">
        <div className="prose prose-invert max-w-none">
          <p className="text-sm text-gray-300">{displayText}</p>
        </div>
        
        <div className="mt-4 pt-3 border-t border-[#00FF00]/10">
          <p className="text-xs text-[#00FF00]/70">
            When this framework is encountered, the user must read the information before continuing.
          </p>
        </div>
      </div>
    </div>
  );
}
