
import { Button } from "@/components/ui/button";
import { Link2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ImageUploadContentProps {
  metadata: Record<string, any>;
  onConnect?: (imageUrl: string) => void;
}

export function ImageUploadContent({ metadata, onConnect }: ImageUploadContentProps) {
  return (
    <div className="mt-4">
      <h4 className="text-xs font-medium text-gray-400 mb-2">Image Upload:</h4>
      <div className="max-h-60 overflow-y-auto">
        {metadata.image_url ? (
          <div className="p-1 border border-[#00FF00]/20 rounded bg-black/30 relative">
            <img 
              src={metadata.image_url} 
              alt="Uploaded preview" 
              className="max-h-40 rounded object-contain mx-auto"
            />
            {onConnect && (
              <div className="absolute top-2 right-2">
                <TooltipProvider>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 rounded-full bg-[#00FF00]/10 hover:bg-[#00FF00]/20 border border-[#00FF00]/30"
                        onClick={() => onConnect(metadata.image_url)}
                      >
                        <Link2 className="h-3.5 w-3.5 text-[#00FF00]" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-xs">Connect</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
        ) : (
          <div className="p-3 border border-dashed border-[#00FF00]/20 rounded bg-black/30 text-center">
            <p className="text-gray-500 text-sm">No image uploaded</p>
          </div>
        )}
      </div>
    </div>
  );
}
