
import { Button } from "@/components/ui/button";
import { Link2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface InformationContentProps {
  metadata: Record<string, any>;
  onConnect?: (text: string) => void;
}

export function InformationContent({ metadata, onConnect }: InformationContentProps) {
  const text = metadata.text || "No information text provided.";
  
  return (
    <div className="p-4 mt-4 border border-[#00FF00]/20 rounded bg-black/30">
      <div className="flex justify-between">
        <p className="text-gray-300 whitespace-pre-wrap pr-3">{text}</p>
        {onConnect && text !== "No information text provided." && (
          <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 rounded-full bg-[#00FF00]/10 hover:bg-[#00FF00]/20 border border-[#00FF00]/30 flex-shrink-0"
                  onClick={() => onConnect(text)}
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
  );
}
