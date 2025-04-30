
interface MultipleOptionsContentProps {
  metadata: Record<string, any>;
}

export function MultipleOptionsContent({ metadata }: MultipleOptionsContentProps) {
  return (
    <div className="space-y-2 mt-4">
      <h4 className="text-sm font-medium text-gray-400">Options:</h4>
      <div className="space-y-2">
        {(metadata.options || []).map((option: string, index: number) => (
          <div 
            key={index} 
            className="p-3 rounded border border-[#00FF00]/20 bg-black/30"
          >
            <div className="flex items-center">
              <div className="w-5 h-5 rounded mr-3 border border-[#00FF00]/50"></div>
              {option}
            </div>
          </div>
        ))}
        {(metadata.options || []).length === 0 && (
          <div className="text-gray-500 italic">No options added yet</div>
        )}
      </div>
    </div>
  );
}
