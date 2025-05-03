
import { ScrollArea } from "@/components/ui/scroll-area";

interface SliderContentProps {
  metadata: Record<string, any>;
  onConnect?: (value: number, type: string) => void;
}

export function SliderContent({ metadata, onConnect }: SliderContentProps) {
  const min = metadata.min || 0;
  const max = metadata.max || 100;
  const step = metadata.step || 1;
  
  // Generate the list of values based on min, max, and step
  const generateValues = () => {
    const values = [];
    for (let i = min; i <= max; i += step) {
      if (i > min) { // Skip the min value itself
        values.push(i);
      }
    }
    return values;
  };
  
  const values = generateValues();
  
  return (
    <div className="space-y-2 mt-4">
      <h4 className="text-xs font-medium text-gray-400">Values:</h4>
      
      <ScrollArea className="h-[200px]">
        <div className="space-y-2 pr-1">
          {values.length > 0 ? (
            values.map((value, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-2 rounded border border-[#00FF00]/20 bg-black/30"
              >
                <span className="text-sm">{value}</span>
                {onConnect && (
                  <button 
                    onClick={() => onConnect(value, `slider_value_${value}`)}
                    className="px-2 py-1 text-xs text-[#00FF00] hover:bg-[#00FF00]/20 rounded"
                  >
                    Connect
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-gray-500 italic text-sm">No values available with current configuration</div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
