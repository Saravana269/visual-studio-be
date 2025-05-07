
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConnectionBadge } from "../connections/ConnectionBadge";
import { useState, useEffect } from "react";

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

  // State for selected combination
  const [selectedCombination, setSelectedCombination] = useState<string[] | null>(null);

  // Generate all combinations
  const combinations = generateAllCombinations(options);

  // Handle row click to select combination
  const handleRowClick = (combination: string[]) => {
    setSelectedCombination(combination);
    localStorage.setItem('selected_combination_value', combination.join(', '));
  };

  // Check if we have a stored selected combination in localStorage on component mount
  useEffect(() => {
    const storedCombination = localStorage.getItem('selected_combination_value');
    if (storedCombination && combinations.length > 0) {
      // Try to find the matching combination in our generated list
      const combinationArray = storedCombination.split(', ');
      const matchingCombination = combinations.find(
        combo => JSON.stringify(combo) === JSON.stringify(combinationArray)
      );
      if (matchingCombination) {
        setSelectedCombination(matchingCombination);
      }
    }
  }, [combinations]);

  return (
    <div className="space-y-2 mt-4">
      <h4 className="text-xs font-medium text-gray-400">Combinations:</h4>
      
      <ScrollArea className="h-[300px]">
        <div className="space-y-2 pr-1">
          {combinations.length > 0 ? combinations.map((combination, index) => {
            // Check if this combination is connected - we need to handle both array and string formats
            const isConnected = isOptionConnected ? isOptionConnected(combination) || isOptionConnected(JSON.stringify(combination)) : false;
            
            // Check if this combination is currently selected
            const isSelected = selectedCombination && JSON.stringify(selectedCombination) === JSON.stringify(combination);
            
            // Determine the appropriate class names based on selection and connection status
            let rowClassName = "flex items-center justify-between p-2 rounded cursor-pointer transition-colors ";
            
            // Base styling
            rowClassName += "border border-[#00FF00]/20 bg-black/30 ";
            
            // Selection styling
            if (isSelected) {
              rowClassName += "border-[#00FF00] bg-[#00FF00]/20 ";
            } else {
              rowClassName += "hover:bg-[#00FF00]/10 ";
            }

            return (
              <div 
                key={index} 
                className={rowClassName}
                onClick={() => handleRowClick(combination)}
              >
                <span className="text-sm">{combination.join(", ")}</span>
                <div className="flex items-center space-x-2">
                  {isConnected ? (
                    <ConnectionBadge 
                      connectionId={`combination_${index}`} 
                      onViewConnection={() => onViewConnection && onViewConnection(combination)} 
                    />
                  ) : (
                    onConnect && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row selection when clicking the connect button
                          onConnect(combination, "Multiple Options");
                        }}
                        className="text-xs bg-[#00FF00]/20 text-[#00FF00] hover:bg-[#00FF00]/30 px-2 py-1 rounded-md flex items-center gap-1"
                      >
                        Connect
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          }) : <div className="text-gray-500 italic text-sm">No combinations available with current options</div>}
        </div>
      </ScrollArea>
    </div>
  );
}
