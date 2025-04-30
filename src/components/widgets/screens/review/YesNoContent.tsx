
export function YesNoContent() {
  return (
    <div className="space-y-2 mt-4">
      <h4 className="text-sm font-medium text-gray-400">Options:</h4>
      <div className="flex space-x-4">
        <div className="p-3 rounded border border-[#00FF00]/20 bg-black/30">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full mr-3 border border-[#00FF00]/50"></div>
            Yes
          </div>
        </div>
        <div className="p-3 rounded border border-[#00FF00]/20 bg-black/30">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full mr-3 border border-[#00FF00]/50"></div>
            No
          </div>
        </div>
      </div>
    </div>
  );
}
