
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { useCOEData } from "@/hooks/useCOEData";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

interface COEManagerFieldConfigProps {
  frameworkConfig: Record<string, any>;
  onUpdateMetadata: (updates: Record<string, any>) => void;
}

// Local storage key for selected COE
const SELECTED_COE_KEY = "selected_coe_for_screen";

export function COEManagerFieldConfig({
  frameworkConfig,
  onUpdateMetadata
}: COEManagerFieldConfigProps) {
  // Get COE data from hook
  const { data: coes, isLoading } = useCOEData();
  
  // Local state to track selected COE
  const [selectedCoeId, setSelectedCoeId] = useState<string | null>(
    frameworkConfig?.coe_id || localStorage.getItem(SELECTED_COE_KEY) || null
  );

  // When selected COE changes, update localStorage and metadata
  useEffect(() => {
    if (selectedCoeId) {
      // Store in localStorage for persistence between steps
      localStorage.setItem(SELECTED_COE_KEY, selectedCoeId);
      
      // Update the framework metadata
      onUpdateMetadata({ coe_id: selectedCoeId });
    }
  }, [selectedCoeId, onUpdateMetadata]);

  // Handle radio selection
  const handleCOESelect = (value: string) => {
    setSelectedCoeId(value);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Class of Elements Selection</Label>
        <p className="text-sm text-gray-400">Select a class of elements to associate with this screen.</p>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : coes.length === 0 ? (
        <Card className="p-4 text-center border-gray-600 bg-gray-800/30">
          <p className="text-gray-300">No classes of elements found</p>
          <p className="text-xs text-gray-400 mt-2">Create some classes of elements first</p>
        </Card>
      ) : (
        <ScrollArea className="h-[240px] rounded-md border border-gray-600 p-2">
          <RadioGroup 
            value={selectedCoeId || ""} 
            onValueChange={handleCOESelect}
            className="space-y-2"
          >
            {coes.map((coe) => (
              <div key={coe.id} className={`flex items-center space-x-2 rounded-md border p-3 ${selectedCoeId === coe.id ? 'border-[#00FF00] bg-[#00FF00]/10' : 'border-gray-600'}`}>
                <RadioGroupItem value={coe.id} id={`radio-${coe.id}`} />
                <Label htmlFor={`radio-${coe.id}`} className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-medium">{coe.name}</p>
                    {coe.description && (
                      <p className="text-sm text-gray-400 truncate">{coe.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Elements: {coe.element_count || 0}
                    </p>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </ScrollArea>
      )}
    </div>
  );
}
