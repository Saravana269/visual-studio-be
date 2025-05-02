
import { Button } from "@/components/ui/button";
import { Link2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Switch id="review-toggle" checked={isEnabled} disabled />
            <Label htmlFor="review-toggle" className="text-sm text-gray-300">
              {isEnabled ? 'Yes' : 'No'}
            </Label>
          </div>
          {onConnect && (
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 rounded-full bg-[#00FF00]/10 hover:bg-[#00FF00]/20 border border-[#00FF00]/30"
                    onClick={() => onConnect(isEnabled ? "yes" : "no")}
                  >
                    <Link2 className="h-3.5 w-3.5 text-[#00FF00]" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs">Connect Toggle Value</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  );
}
