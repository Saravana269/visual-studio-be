
import { ScrollArea } from "@/components/ui/scroll-area";

interface RadioButtonContentProps {
  metadata: Record<string, any>;
  onConnect?: (option: string, index: number) => void;
}

export function RadioButtonContent({
  metadata,
  onConnect
}: RadioButtonContentProps) {
  return (
    <div className="space-y-2 mt-2">
      <h4 className="text-xs font-medium text-gray-400">Options:</h4>
      
      {/* Only the options list is scrollable */}
      <ScrollArea className="h-[200px]">
        <div className="space-y-2 pr-1">
          {(metadata.options || []).map((option: string, index: number) => (
            <div key={index} className="p-2 rounded border border-[#00FF00]/20 bg-black/30">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2 border border-[#00FF00]/50"></div>
                <span className="text-sm">{option}</span>
              </div>
            </div>
          ))}
          {(metadata.options || []).length === 0 && <div className="text-gray-500 italic text-sm">No options added yet</div>}
        </div>
      </ScrollArea>
    </div>
  );
}
