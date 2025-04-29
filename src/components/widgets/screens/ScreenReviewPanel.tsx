
import { Screen } from "@/types/screen";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface ScreenReviewPanelProps {
  screen: Screen | null;
}

export function ScreenReviewPanel({ screen }: ScreenReviewPanelProps) {
  // Extract field data from screen metadata
  const fieldName = screen?.metadata?.field_name || "";
  const information = screen?.metadata?.information || "";
  const fieldOptions = screen?.metadata?.field_options || [];
  const frameworkType = screen?.framework_type || "Not specified";
  const rangeMin = screen?.metadata?.range_min;
  const rangeMax = screen?.metadata?.range_max;

  if (!screen) {
    return (
      <div className="flex flex-col h-full border-2 border-dashed border-gray-700 rounded-lg overflow-hidden">
        <div className="bg-[#00FF00]/20 p-4 border-b border-[#00FF00]/30">
          <h2 className="text-xl font-medium text-[#00FF00]">Screen Review Area</h2>
        </div>
        <div className="flex items-center justify-center flex-1 p-6">
          <p className="text-gray-500 text-center">
            Select a screen from the navigation below to preview it here.
          </p>
        </div>
      </div>
    );
  }

  // Render framework-specific content
  const renderFrameworkContent = () => {
    switch (screen.framework_type) {
      case "Multiple Options":
        return (
          <div className="space-y-2 mt-4">
            <h4 className="text-sm font-medium text-gray-400">Options:</h4>
            <div className="space-y-2">
              {fieldOptions.map((option, index) => (
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
            </div>
          </div>
        );
        
      case "Single Choice":
        return (
          <div className="space-y-2 mt-4">
            <h4 className="text-sm font-medium text-gray-400">Options:</h4>
            <div className="space-y-2">
              {fieldOptions.map((option, index) => (
                <div 
                  key={index} 
                  className="p-3 rounded border border-[#00FF00]/20 bg-black/30"
                >
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full mr-3 border border-[#00FF00]/50"></div>
                    {option}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case "Yes/No":
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
        
      case "Slider":
      case "Range Selector":
        return (
          <div className="space-y-2 mt-4">
            <h4 className="text-sm font-medium text-gray-400">Range:</h4>
            <div className="p-3 rounded border border-[#00FF00]/20 bg-black/30">
              <div className="flex flex-col">
                <div className="w-full h-2 bg-gray-700 rounded-full mb-2">
                  <div className="h-full bg-[#00FF00]/50 rounded-full" style={{ width: "50%" }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{rangeMin || 0}</span>
                  <span>{rangeMax || 100}</span>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="p-4 mt-4 border border-dashed border-gray-600 rounded bg-black/20">
            <p className="text-gray-500 text-center">Preview for {frameworkType}</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full border border-gray-800 rounded-lg overflow-hidden">
      <div className="bg-[#00FF00]/20 p-4 border-b border-[#00FF00]/30">
        <h2 className="text-xl font-medium text-[#00FF00]">Screen Review Area</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-6">
          <div className="mb-3">
            <Badge className="bg-[#00FF00]/20 text-[#00FF00] border-[#00FF00]/30">
              {frameworkType}
            </Badge>
          </div>
          
          <h3 className="text-xl font-semibold mb-2">{screen.name}</h3>
          
          {screen.description && (
            <p className="text-gray-400 mb-4">{screen.description}</p>
          )}
          
          {fieldName && (
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-400">Field Name:</h4>
              <p className="text-white">{fieldName}</p>
            </div>
          )}
          
          {information && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-400">Information:</h4>
              <p className="text-gray-300 whitespace-pre-wrap">{information}</p>
            </div>
          )}
          
          {/* Render framework-specific content */}
          {renderFrameworkContent()}
          
          {(!fieldName && !information && (!fieldOptions || fieldOptions.length === 0)) && (
            <div className="text-gray-500 text-center py-8">
              <p>No content has been added to this screen.</p>
              <p className="mt-2">Edit in the define area to add content.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
