
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface SliderContentProps {
  metadata: Record<string, any>;
  screenId?: string;
  onConnect?: (value: number) => void;
}

export function SliderContent({ metadata, screenId, onConnect }: SliderContentProps) {
  const min = metadata?.min || 0;
  const max = metadata?.max || 100;
  const step = metadata?.step || 1;
  const value = metadata?.value || min;
  
  // Local state to manage the slider value
  const [sliderValue, setSliderValue] = useState(value);
  
  const handleValueChange = (val: number[]) => {
    setSliderValue(val[0]);
    if (onConnect) {
      onConnect(val[0]);
    }
  };

  return (
    <div className="mt-4">
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-400">
          <span>{min}</span>
          <span>Current Value: {sliderValue}</span>
          <span>{max}</span>
        </div>
        <Slider
          value={[sliderValue]}
          min={min}
          max={max}
          step={step}
          onValueChange={handleValueChange}
          disabled={!onConnect}
          className="mt-1"
        />
      </div>
    </div>
  );
}
