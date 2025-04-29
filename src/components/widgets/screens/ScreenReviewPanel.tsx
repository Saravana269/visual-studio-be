
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
          
          {fieldOptions && fieldOptions.length > 0 && (
            <div className="space-y-2 mt-4">
              <h4 className="text-sm font-medium text-gray-400">Options:</h4>
              <div className="space-y-2">
                {fieldOptions.map((option, index) => (
                  <div 
                    key={index} 
                    className="p-3 rounded border border-[#00FF00]/20 bg-black/30 hover:bg-black/50 transition-colors"
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
          )}
          
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
