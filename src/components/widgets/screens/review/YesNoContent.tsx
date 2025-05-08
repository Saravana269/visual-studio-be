
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useState } from "react";

interface YesNoContentProps {
  metadata: Record<string, any>;
  screenId?: string;
  onConnect?: (value: boolean) => void;
}

export function YesNoContent({ metadata, screenId, onConnect }: YesNoContentProps) {
  const defaultValue = metadata?.value || null;
  
  // Local state for tracking selection
  const [selected, setSelected] = useState<boolean | null>(defaultValue);
  
  const handleSelect = (value: boolean) => {
    setSelected(value);
    if (onConnect) {
      onConnect(value);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={() => handleSelect(true)}
          className={`w-24 ${selected === true ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'}`}
          disabled={!onConnect}
        >
          <Check className="mr-2 h-4 w-4" />
          Yes
        </Button>
        
        <Button
          onClick={() => handleSelect(false)}
          className={`w-24 ${selected === false ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'}`}
          disabled={!onConnect}
        >
          <X className="mr-2 h-4 w-4" />
          No
        </Button>
      </div>
    </div>
  );
}
