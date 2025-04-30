
import { Screen } from "@/types/screen";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmptyScreenPreview } from "./review/EmptyScreenPreview";
import { FrameworkContent } from "./review/FrameworkContent";

interface ScreenReviewPanelProps {
  screen: Screen | null;
}

export function ScreenReviewPanel({ screen }: ScreenReviewPanelProps) {
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
      <div className="bg-[#00FF00] p-4 border-b border-[#00FF00]/30">
        <h2 className="text-black text-lg font-medium">Screen Review Area</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-6">
          <FrameworkContent screen={screen} />
        </div>
      </ScrollArea>
    </div>
  );
}
