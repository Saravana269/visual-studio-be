
import { Screen } from "@/types/screen";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

interface ScreenCardListProps {
  screens: Screen[];
  isLoading: boolean;
  onScreenSelect: (screenId: string) => void;
  onAddScreen: () => void;
}

export function ScreenCardList({ screens, isLoading, onScreenSelect, onAddScreen }: ScreenCardListProps) {
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
          className="bg-gray-900 border-gray-800 hover:border-[#00FF00]/40 cursor-pointer transition-all"
          onClick={() => onScreenSelect(screen.id)}
        >
          <CardHeader className="bg-gray-800/50 p-3">
            <h3 className="text-base font-medium text-white">{screen.name || "Untitled"}</h3>
          </CardHeader>
          
          <CardContent className="pt-2 p-3">
            {screen.description && (
              <p className="text-gray-400 text-xs line-clamp-2 mb-2">{screen.description}</p>
            )}
            
            {screen.framework_type && (
              <Badge className="bg-[#00FF00]/20 text-[#00FF00] border-[#00FF00]/30 text-xs">
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
