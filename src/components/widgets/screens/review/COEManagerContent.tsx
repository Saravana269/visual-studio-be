
import { ScrollArea } from "@/components/ui/scroll-area";

interface COEManagerContentProps {
  metadata: Record<string, any>;
  screenId?: string;
  onConnect?: (coeId: string) => void;
}

export function COEManagerContent({ metadata, screenId, onConnect }: COEManagerContentProps) {
  const coeId = metadata.coe_id || null;
  
  return (
    <div className="mt-4">
      {coeId ? (
        <div className="p-4 border border-[#00FF00]/20 rounded bg-black/30">
          <p className="text-sm">Selected COE ID: {coeId}</p>
        </div>
      ) : (
        <div className="p-4 border border-[#00FF00]/20 rounded bg-black/30">
          <p className="text-gray-400 text-sm">No COE selected</p>
        </div>
      )}
    </div>
  );
}
