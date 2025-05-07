
import { ScrollArea } from "@/components/ui/scroll-area";

interface InformationContentProps {
  metadata: Record<string, any>;
  onConnect?: (text: string) => void;
  screenId?: string;
}

export function InformationContent({ metadata, onConnect, screenId }: InformationContentProps) {
  const text = metadata.text || "No information text provided.";
  
  return (
    <div className="mt-4 border border-[#00FF00]/20 rounded bg-black/30">
      <div className="p-2">
        <ScrollArea className="h-[180px] w-full">
          <div className="pr-3">
            <p className="text-gray-300 whitespace-pre-wrap text-sm">{text}</p>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
