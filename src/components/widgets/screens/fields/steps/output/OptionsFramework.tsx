
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ConnectButton } from "./ConnectButton";
import { ScrollArea } from "@/components/ui/scroll-area";

interface OptionsFrameworkProps {
  options: string[];
  isRadio?: boolean;
  onConnect: (value: any, context?: string) => void;
  widgetId?: string;
}

export function OptionsFramework({ 
  options = [], 
  isRadio = false,
  onConnect,
  widgetId 
}: OptionsFrameworkProps) {
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);

  // Generate all possible non-empty combinations of options for multiple select
  const generateCombinations = (opts: string[]): string[][] => {
    if (isRadio || opts.length === 0) return [];
    
    const result: string[][] = [];
    
    const backtrack = (start: number, current: string[]) => {
      if (current.length > 0) {
        result.push([...current]);
      }
      
      for (let i = start; i < opts.length; i++) {
        current.push(opts[i]);
        backtrack(i + 1, current);
        current.pop();
      }
    };
    
    backtrack(0, []);
    return result;
  };
  
  const combinations = generateCombinations(options);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-medium">
          {isRadio ? "Select one option" : "Select options"}
        </h2>
      </div>

      {isRadio ? (
        <div className="space-y-2 mt-4">
          {options.map((option, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-2 rounded hover:bg-gray-800/30 border border-gray-700"
            >
              <span className="text-sm">{option}</span>
              <ConnectButton 
                value={option} 
                context={`element_id_${index}`}
                onConnect={onConnect}
                widgetId={widgetId}
              />
            </div>
          ))}
          {options.length === 0 && (
            <p className="text-gray-500 text-sm">No options defined yet</p>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-2 mt-4">
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox 
                  id={`option-${index}`} 
                  checked={selectedOptions.includes(option)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedOptions([...selectedOptions, option]);
                    } else {
                      setSelectedOptions(selectedOptions.filter(o => o !== option));
                    }
                  }}
                />
                <Label htmlFor={`option-${index}`} className="cursor-pointer">
                  {option}
                </Label>
                <div className="ml-auto">
                  <ConnectButton 
                    value={option} 
                    context={`element_id_${index}`}
                    onConnect={onConnect}
                    widgetId={widgetId}
                  />
                </div>
              </div>
            ))}
          </div>

          {options.length > 1 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-3">Combinations:</h3>
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {combinations.map((combination, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-2 rounded hover:bg-[#00FF00]/10 border border-[#00FF00]/20 bg-black/30"
                    >
                      <span className="text-sm">{combination.join(", ")}</span>
                      <ConnectButton 
                        value={combination} 
                        context={`combination_${index}`}
                        onConnect={onConnect}
                        widgetId={widgetId}
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </>
      )}
    </div>
  );
}
