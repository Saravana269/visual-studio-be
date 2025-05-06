
import { Screen } from "@/types/screen";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmptyScreenPreview } from "./review/EmptyScreenPreview";
import { FrameworkContent } from "./review/FrameworkContent";
import { Button } from "@/components/ui/button";
import { LinkIcon } from "lucide-react";

interface ScreenReviewPanelProps {
  screen: Screen | null;
  onShowConnections?: () => void;
}

export function ScreenReviewPanel({ screen, onShowConnections }: ScreenReviewPanelProps) {
  if (!screen) {
    return (
      <div className="flex flex-col h-full border-2 border-dashed border-gray-700 rounded-lg overflow-hidden">
        <div className="bg-[#00FF00] p-4 border-b border-[#00FF00]/30">
          <h2 className="text-black text-lg font-medium">Screen Review Area</h2>
        </div>
        <EmptyScreenPreview />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full border border-gray-800 rounded-lg overflow-hidden">
      {/* Fixed header */}
      <div className="bg-[#00FF00] p-4 border-b border-[#00FF00]/30">
        <div className="flex justify-between items-center">
          <h2 className="text-black text-lg font-medium">Screen Review Area</h2>
          {onShowConnections && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onShowConnections}
              className="bg-black/20 hover:bg-black/30 text-black"
            >
              <LinkIcon size={16} className="mr-1" />
              Connections
            </Button>
          )}
        </div>
      </div>
      
      {/* Scrollable content area */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <FrameworkContent screen={screen} />
        </div>
      </div>
    </div>
  );
}
