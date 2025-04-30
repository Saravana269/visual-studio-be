
import { Button } from "@/components/ui/button";
import { Link2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SliderContentProps {
  metadata: Record<string, any>;
  onConnect?: (value: number, type: string) => void;
}

export function SliderContent({ metadata, onConnect }: SliderContentProps) {
  const min = metadata.min || 0;
  const max = metadata.max || 100;
  
  return (
    <div className="space-y-2 mt-4">
      <h4 className="text-xs font-medium text-gray-400">Range:</h4>
      <div className="p-2 rounded border border-[#00FF00]/20 bg-black/30">
        <div className="flex flex-col">
          <div className="w-full h-2 bg-gray-700 rounded-full mb-2">
            <div className="h-full bg-[#00FF00]/50 rounded-full" style={{ width: "50%" }}></div>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <span>{min}</span>
              {onConnect && (
                <TooltipProvider>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5 rounded-full bg-[#00FF00]/10 hover:bg-[#00FF00]/20 border border-[#00FF00]/30"
                        onClick={() => onConnect(min, "min")}
                      >
                        <Link2 className="h-3 w-3 text-[#00FF00]" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-xs">Connect Min Value</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <div className="flex items-center gap-1">
              <span>{max}</span>
              {onConnect && (
                <TooltipProvider>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5 rounded-full bg-[#00FF00]/10 hover:bg-[#00FF00]/20 border border-[#00FF00]/30"
                        onClick={() => onConnect(max, "max")}
                      >
                        <Link2 className="h-3 w-3 text-[#00FF00]" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-xs">Connect Max Value</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
