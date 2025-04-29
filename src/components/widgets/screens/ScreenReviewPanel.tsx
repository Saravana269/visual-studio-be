
import { Screen } from "@/types/screen";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const rangeStep = screen?.metadata?.range_step;

  if (!screen) {
    return (
      <Card className="h-full border-2 border-dashed border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg text-gray-500">No screen selected</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-500">
          <p>Select a screen from the navigation below to preview it here.</p>
        </CardContent>
      </Card>
    );
  }

  // Render framework-specific content
  const renderFrameworkContent = () => {
    switch (screen.framework_type) {
      case "Multiple Options":
        return (
          <div className="space-y-2 mt-4">
            <h4 className="text-sm font-medium text-gray-400">Options (Multiple Select):</h4>
            <div className="space-y-2">
              {fieldOptions.map((option, index) => (
                <div 
                  key={index} 
                  className="p-3 rounded border border-[#00FF00]/20 bg-black/30 hover:bg-black/50 transition-colors"
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
            <h4 className="text-sm font-medium text-gray-400">Options (Single Select):</h4>
            <div className="space-y-2">
              {fieldOptions.map((option, index) => (
                <div 
                  key={index} 
                  className="p-3 rounded border border-[#00FF00]/20 bg-black/30 hover:bg-black/50 transition-colors"
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
            <h4 className="text-sm font-medium text-gray-400">Yes/No Option:</h4>
            <div className="flex space-x-4">
              <div className="p-3 rounded border border-[#00FF00]/20 bg-black/30 hover:bg-black/50 transition-colors">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-3 border border-[#00FF00]/50"></div>
                  Yes
                </div>
              </div>
              <div className="p-3 rounded border border-[#00FF00]/20 bg-black/30 hover:bg-black/50 transition-colors">
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
            <h4 className="text-sm font-medium text-gray-400">{screen.framework_type}:</h4>
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
        
      case "Text Input":
        return (
          <div className="space-y-2 mt-4">
            <h4 className="text-sm font-medium text-gray-400">Text Input:</h4>
            <div className="p-3 rounded border border-[#00FF00]/20 bg-black/30">
              <div className="bg-black/50 border border-gray-700 p-2 rounded">
                <span className="text-gray-500">User input here...</span>
              </div>
            </div>
          </div>
        );
        
      case "Image Upload":
        return (
          <div className="space-y-2 mt-4">
            <h4 className="text-sm font-medium text-gray-400">Image Upload:</h4>
            <div className="p-6 rounded border border-[#00FF00]/20 bg-black/30 flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-2 border-dashed border-gray-500 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">+</span>
              </div>
              <span className="mt-2 text-sm text-gray-500">Upload Image</span>
            </div>
          </div>
        );
        
      case "Class of Elements":
        return (
          <div className="space-y-2 mt-4">
            <h4 className="text-sm font-medium text-gray-400">Class of Elements:</h4>
            <div className="p-3 rounded border border-[#00FF00]/20 bg-black/30">
              <select 
                disabled
                className="w-full p-2 rounded bg-black/50 border border-gray-700 text-gray-400"
              >
                <option>Select a class...</option>
              </select>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <Card className="h-full border-2 border-[#00FF00]/20 overflow-hidden">
      <CardHeader className="border-b border-[#00FF00]/10">
        <CardTitle className="text-xl text-white">{screen.name}</CardTitle>
        <Badge variant="outline" className="bg-[#00FF00]/10 text-[#00FF00] border-[#00FF00]/30">
          {frameworkType}
        </Badge>
      </CardHeader>
      <ScrollArea className="h-[calc(100%-80px)]">
        <CardContent className="p-4">
          {fieldName && (
            <div className="mb-4">
              <h3 className="text-lg font-medium text-[#00FF00]">{fieldName}</h3>
            </div>
          )}
          
          {information && (
            <div className="mb-6">
              <p className="text-gray-300 whitespace-pre-wrap">{information}</p>
            </div>
          )}
          
          {/* Render framework-specific content */}
          {renderFrameworkContent()}
          
          {(!fieldName && !information && (!fieldOptions || fieldOptions.length === 0)) && (
            <div className="text-gray-500 text-center py-8">
              <p>No content has been added to this screen yet.</p>
              <p className="mt-2">Edit this screen to add content.</p>
            </div>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
