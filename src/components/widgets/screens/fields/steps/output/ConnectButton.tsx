
import React from "react";
import { Button } from "@/components/ui/button";
import { Link2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { ConnectOptionsMenu } from "./ConnectOptionsMenu";

interface ConnectButtonProps {
  value: any;
  context?: string;
  onConnect: (value: any, context?: string) => void;
}

export const ConnectButton = ({ value, context, onConnect }: ConnectButtonProps) => {
  const handleOptionSelect = (option: string) => {
    // Pass the selected option along with value and context
    onConnect(value, context ? `${context}:${option}` : option);
  };

  const connectButton = (
    <Button 
      variant="ghost" 
      size="icon" 
      className="h-6 w-6 rounded-full bg-[#00FF00]/10 hover:bg-[#00FF00]/20 border border-[#00FF00]/30"
      type="button"
    >
      <Link2 className="h-3.5 w-3.5 text-[#00FF00]" />
    </Button>
  );

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <ConnectOptionsMenu 
            trigger={connectButton}
            onOptionSelect={handleOptionSelect}
          />
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="text-xs">Connect</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
