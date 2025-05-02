
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface YesNoContentProps {
  onConnect?: (option: string) => void;
  metadata?: Record<string, any>;
}

export function YesNoContent({ onConnect, metadata = {} }: YesNoContentProps) {
  // Convert value to boolean, handling various formats
  const [isEnabled, setIsEnabled] = useState<boolean>(
    metadata?.value === true || 
    metadata?.value === "yes" || 
    metadata?.value === "true"
  );
  
  // Update state when metadata changes (for real-time updates)
  useEffect(() => {
    setIsEnabled(
      metadata?.value === true || 
      metadata?.value === "yes" || 
      metadata?.value === "true"
    );
  }, [metadata]);

  return (
    <div className="space-y-4 mt-4">
      {/* Toggle switch display */}
      <div className="p-3 border border-[#00FF00]/20 bg-black/30 rounded-md mb-4">
        <div className="flex items-center">
          <Switch id="review-toggle" checked={isEnabled} disabled />
          <Label htmlFor="review-toggle" className="text-sm text-gray-300 ml-3">
            {isEnabled ? 'Yes' : 'No'}
          </Label>
        </div>
      </div>
    </div>
  );
}
