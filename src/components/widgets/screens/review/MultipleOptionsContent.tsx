
import { ScrollArea } from "@/components/ui/scroll-area";
import { MultipleOptionsCombinationsContent } from "./MultipleOptionsCombinationsContent";

interface MultipleOptionsContentProps {
  metadata: Record<string, any>;
  onConnect?: (option: string, index: number) => void;
}

export function MultipleOptionsContent({
  metadata,
  onConnect
}: MultipleOptionsContentProps) {
  // Display the combinations instead of individual options
  return (
    <div className="space-y-2 mt-2">
      <h4 className="text-xs font-medium text-gray-400">Options:</h4>
      
      {/* First show the available options */}
      <ScrollArea className="h-[150px]">
        <div className="space-y-2 pr-1">
          {(metadata.options || []).map((option: string, index: number) => (
            <div key={index} className="p-2 rounded border border-[#00FF00]/20 bg-black/30">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded mr-2 border border-[#00FF00]/50"></div>
                <span className="text-sm">{option}</span>
              </div>
            </div>
          ))}
          {(metadata.options || []).length === 0 && <div className="text-gray-500 italic text-sm">No options added yet</div>}
        </div>
      </ScrollArea>
      
      {/* Then show all possible combinations */}
      {(metadata.options || []).length > 0 && (
        <MultipleOptionsCombinationsContent metadata={metadata} />
      )}
    </div>
  );
}
