
import { Screen } from "@/types/screen";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";

interface ScreenCardListProps {
  screens: Screen[];
  isLoading: boolean;
  onScreenSelect: (screenId: string) => void;
  onAddScreen: () => void;
}

export function ScreenCardList({ screens, isLoading, onScreenSelect, onAddScreen }: ScreenCardListProps) {
  // Mapping of framework types to display badges with appropriate colors
  const frameworkColorMap: Record<string, string> = {
    "Multiple Options": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "Radio Button": "bg-purple-500/20 text-purple-400 border-purple-500/30",
    "Yes / No": "bg-amber-500/20 text-amber-400 border-amber-500/30",
    "Slider": "bg-green-500/20 text-green-400 border-green-500/30",
    "Information": "bg-gray-500/20 text-gray-400 border-gray-500/30",
    "Image Upload": "bg-pink-500/20 text-pink-400 border-pink-500/30",
    "COE Manager": "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  };

  // Get badge style based on framework type
  const getBadgeStyle = (frameworkType: string | null | undefined) => {
    return frameworkType && frameworkColorMap[frameworkType] 
      ? frameworkColorMap[frameworkType]
      : "bg-[#00FF00]/20 text-[#00FF00] border-[#00FF00]/30";
  };
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="bg-gray-900 border-gray-800">
            <CardHeader className="bg-gray-800/50 animate-pulse h-14 p-3"></CardHeader>
            <CardContent className="pt-2 p-3">
              <div className="space-y-2">
                <div className="h-3 bg-gray-800 animate-pulse rounded w-3/4"></div>
                <div className="h-3 bg-gray-800 animate-pulse rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {screens.map((screen) => (
        <Card 
          key={screen.id} 
          className="bg-gray-900 border-gray-800 hover:border-[#00FF00]/40 transition-all"
        >
          <CardHeader className="bg-gray-800/50 p-3">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-medium text-white">{screen.name || "Untitled"}</h3>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full hover:bg-gray-700"
                  onClick={() => onScreenSelect(screen.id)}
                >
                  <Edit size={14} />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-2 p-3">
            {screen.description && (
              <p className="text-gray-400 text-xs line-clamp-2 mb-2">{screen.description}</p>
            )}
            
            {screen.framework_type && (
              <Badge className={getBadgeStyle(screen.framework_type)}>
                {screen.framework_type}
              </Badge>
            )}
          </CardContent>
        </Card>
      ))}
      
      {/* Add new screen card */}
      <Card className="bg-black border border-dashed border-gray-700 hover:border-[#00FF00]/50 transition-all cursor-pointer flex flex-col justify-center items-center p-4 h-full" onClick={onAddScreen}>
        <Plus size={24} className="text-[#00FF00] mb-2" />
        <h3 className="text-[#00FF00] text-sm font-medium">Add New Screen</h3>
        <p className="text-gray-400 text-xs text-center mt-1">Create new screen</p>
      </Card>
    </div>
  );
}
