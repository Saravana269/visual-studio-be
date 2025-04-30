
interface COEManagerContentProps {
  metadata: Record<string, any>;
}

export function COEManagerContent({ metadata }: COEManagerContentProps) {
  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-400 mb-2">Class of Elements:</h4>
      <div className="p-4 border border-[#00FF00]/20 rounded bg-black/30">
        <p className="text-gray-400">
          {metadata.coe_id ? "COE selected" : "No class of elements selected"}
        </p>
      </div>
    </div>
  );
}
