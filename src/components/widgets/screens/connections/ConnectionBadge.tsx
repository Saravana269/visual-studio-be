
import { Badge } from "@/components/ui/badge";
import { Link2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface ConnectionBadgeProps {
  connectionId: string;
  onViewConnection?: () => void;
  className?: string;
}

export function ConnectionBadge({ 
  connectionId, 
  onViewConnection,
  className = ""
}: ConnectionBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            className={`bg-[#00FF00]/20 text-[#00FF00] hover:bg-[#00FF00]/30 cursor-pointer flex items-center gap-1 ${className}`}
            onClick={(e) => {
              e.stopPropagation();
              if (onViewConnection) onViewConnection();
            }}
          >
            <Link2 className="h-3 w-3" />
            <span>Connected</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="text-xs">View Connection</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
