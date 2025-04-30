
import { Button } from "@/components/ui/button";
import { Link2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface YesNoContentProps {
  onConnect?: (option: string) => void;
}

export function YesNoContent({ onConnect }: YesNoContentProps) {
  return (
    <div className="space-y-2 mt-4">
      <h4 className="text-sm font-medium text-gray-400">Options:</h4>
      <div className="flex space-x-4">
        <div className="p-3 rounded border border-[#00FF00]/20 bg-black/30 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full mr-3 border border-[#00FF00]/50"></div>
              Yes
            </div>
            {onConnect && (
              <TooltipProvider>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 rounded-full bg-[#00FF00]/10 hover:bg-[#00FF00]/20 border border-[#00FF00]/30"
                      onClick={() => onConnect("yes")}
                    >
                      <Link2 className="h-3.5 w-3.5 text-[#00FF00]" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs">Connect</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        <div className="p-3 rounded border border-[#00FF00]/20 bg-black/30 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full mr-3 border border-[#00FF00]/50"></div>
              No
            </div>
            {onConnect && (
              <TooltipProvider>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 rounded-full bg-[#00FF00]/10 hover:bg-[#00FF00]/20 border border-[#00FF00]/30"
                      onClick={() => onConnect("no")}
                    >
                      <Link2 className="h-3.5 w-3.5 text-[#00FF00]" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs">Connect</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
