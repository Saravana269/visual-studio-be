
interface SliderContentProps {
  metadata: Record<string, any>;
  onConnect?: (value: number, type: string) => void;
}

export function SliderContent({ metadata, onConnect }: SliderContentProps) {
  const min = metadata.min || 0;
  const max = metadata.max || 100;
  
  return (
    <div className="space-y-2 mt-4">
      <h4 className="text-xs font-medium text-gray-400">Range:</h4>
      <div className="p-2 rounded border border-[#00FF00]/20 bg-black/30">
        <div className="flex flex-col">
          <div className="w-full h-2 bg-gray-700 rounded-full mb-2">
            <div className="h-full bg-[#00FF00]/50 rounded-full" style={{ width: "50%" }}></div>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <div>
              <span>{min}</span>
            </div>
            <div>
              <span>{max}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
