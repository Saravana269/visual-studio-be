import { ScrollArea } from "@/components/ui/scroll-area";
import { ConnectionBadge } from "../connections/ConnectionBadge";

interface MultipleOptionsCombinationsContentProps {
  metadata: Record<string, any>;
  screenId?: string;
  onConnect?: (combination: string[], type: string) => void;
  isOptionConnected?: (option: string | string[]) => boolean;
  onViewConnection?: (option: string[]) => void;
}

// Generate all possible non-empty combinations of options
function generateAllCombinations(options: string[]): string[][] {
  if (!options || options.length === 0) return [];
  
  const result: string[][] = [];
  
  // Helper function to generate combinations with backtracking
  const backtrack = (start: number, current: string[]) => {
    // Add the current combination if it's not empty
    if (current.length > 0) {
      result.push([...current]);
    }
    
    // Generate combinations by adding each remaining option
    for (let i = start; i < options.length; i++) {
      current.push(options[i]);
      backtrack(i + 1, current);
      current.pop();
    }
  };
  
  backtrack(0, []);
  return result;
}

export function MultipleOptionsCombinationsContent({
  metadata,
  screenId,
  onConnect,
  isOptionConnected = () => false,
  onViewConnection
}: MultipleOptionsCombinationsContentProps) {
  // Get options from metadata
  const options = metadata.options || [];
  
  // Generate all combinations
  const combinations = generateAllCombinations(options);
  
  return (
    <div className="space-y-2 mt-4">
      <h4 className="text-xs font-medium text-gray-400">Combinations:</h4>
      
      <ScrollArea className="h-[300px]">
        <div className="space-y-2 pr-1">
          {combinations.length > 0 ? (
            combinations.map((combination, index) => {
              const isConnected = isOptionConnected(combination);
              
              return (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-2 rounded border border-[#00FF00]/20 bg-black/30 hover:bg-[#00FF00]/10"
                >
                  <span className="text-sm">{combination.join(", ")}</span>
                  <div className="flex items-center space-x-2">
                    {isConnected ? (
                      <ConnectionBadge 
                        connectionId={`combination_${index}`}
                        onViewConnection={() => onViewConnection && onViewConnection(combination)}
                      />
                    ) : onConnect && (
                      <button 
                        onClick={() => onConnect(combination, `combination_${index}`)}
                        className="px-2 py-1 text-xs text-[#00FF00] hover:bg-[#00FF00]/20 rounded"
                      >
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-gray-500 italic text-sm">No combinations available with current options</div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
