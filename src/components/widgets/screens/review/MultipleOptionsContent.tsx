
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
  return (
    <div className="space-y-2 mt-2">
      {/* Only show combinations */}
      {(metadata.options || []).length > 0 ? (
        <MultipleOptionsCombinationsContent metadata={metadata} />
      ) : (
        <div className="text-gray-500 italic text-sm">No options added yet</div>
      )}
    </div>
  );
}
