
import { Screen } from "@/types/screen";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface ScreenReviewPanelProps {
  screen: Screen | null;
}

export function ScreenReviewPanel({ screen }: ScreenReviewPanelProps) {
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

  const metadata = screen.metadata || {};
  const frameworkType = screen.framework_type || "Not specified";

  // Render framework-specific content
  const renderFrameworkContent = () => {
    switch (frameworkType) {
      case "Multiple Options":
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
            </div>
          </div>
        );
        
      case "Radio Button":
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
                    <div className="w-4 h-4 rounded-full mr-3 border border-[#00FF00]/50"></div>
                    {option}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case "Yes / No":
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
        return (
          <div className="space-y-2 mt-4">
            <h4 className="text-sm font-medium text-gray-400">Range:</h4>
            <div className="p-3 rounded border border-[#00FF00]/20 bg-black/30">
              <div className="flex flex-col">
                <div className="w-full h-2 bg-gray-700 rounded-full mb-2">
                  <div className="h-full bg-[#00FF00]/50 rounded-full" style={{ width: "50%" }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{metadata.min || 0}</span>
                  <span>{metadata.max || 100}</span>
                </div>
              </div>
            </div>
          </div>
        );
        
      case "Information":
        return (
          <div className="p-4 mt-4 border border-[#00FF00]/20 rounded bg-black/30">
            <p className="text-gray-300 whitespace-pre-wrap">{metadata.text || "No information text provided."}</p>
          </div>
        );
        
      case "Image Upload":
        return (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-400 mb-2">Image Upload:</h4>
            {metadata.image_url ? (
              <div className="p-1 border border-[#00FF00]/20 rounded bg-black/30">
                <img 
                  src={metadata.image_url} 
                  alt="Uploaded preview" 
                  className="max-h-48 rounded object-contain mx-auto"
                />
              </div>
            ) : (
              <div className="p-4 border border-dashed border-[#00FF00]/20 rounded bg-black/30 text-center">
                <p className="text-gray-500">No image uploaded</p>
              </div>
            )}
          </div>
        );
        
      case "COE Manager":
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
          
          {/* Render framework-specific content */}
          {renderFrameworkContent()}
          
          {(!metadata || Object.keys(metadata).length === 0) && (
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
