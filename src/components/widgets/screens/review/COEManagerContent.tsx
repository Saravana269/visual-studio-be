
import { Button } from "@/components/ui/button";
import { Link2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useCOEData } from "@/hooks/useCOEData";
import { useState, useEffect } from "react";

interface COEManagerContentProps {
  metadata: Record<string, any>;
  onConnect?: (coeId: string) => void;
}

export function COEManagerContent({ metadata, onConnect }: COEManagerContentProps) {
  const { data: coes = [] } = useCOEData();
  const [selectedCoe, setSelectedCoe] = useState<any>(null);
  
  useEffect(() => {
    if (metadata.coe_id && coes.length > 0) {
      const coe = coes.find((coe) => coe.id === metadata.coe_id);
      if (coe) {
        setSelectedCoe(coe);
      }
    }
  }, [metadata.coe_id, coes]);

  return (
    <div className="mt-4">
      <h4 className="text-xs font-medium text-gray-400 mb-2">Class of Elements:</h4>
      <div className="p-2 border border-[#00FF00]/20 rounded bg-black/30">
        <div className="flex justify-between items-center">
          <div>
            {selectedCoe ? (
              <div>
                <p className="text-gray-200 text-sm font-medium">{selectedCoe.name}</p>
                {selectedCoe.description && (
                  <p className="text-gray-400 text-xs mt-1">{selectedCoe.description}</p>
                )}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">
                {metadata.coe_id ? "COE selected" : "No class of elements selected"}
              </p>
            )}
          </div>
          
          {onConnect && metadata.coe_id && (
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 rounded-full bg-[#00FF00]/10 hover:bg-[#00FF00]/20 border border-[#00FF00]/30"
                    onClick={() => onConnect(metadata.coe_id)}
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
  );
}
