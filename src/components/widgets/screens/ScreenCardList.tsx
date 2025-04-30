
import { Screen } from "@/types/screen";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-gray-900 border-gray-800">
            <CardHeader className="bg-gray-800/50 animate-pulse h-20"></CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-800 animate-pulse rounded w-3/4"></div>
                <div className="h-4 bg-gray-800 animate-pulse rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {screens.map((screen) => (
        <Card 
          key={screen.id} 
          className="bg-gray-900 border-gray-800 hover:border-[#00FF00]/40 cursor-pointer transition-all"
          onClick={() => onScreenSelect(screen.id)}
        >
          <CardHeader className="bg-gray-800/50">
            <h3 className="text-xl font-medium text-white">{screen.name || "Untitled"}</h3>
            {screen.description && (
              <p className="text-gray-400 text-sm line-clamp-2">{screen.description}</p>
            )}
          </CardHeader>
          
          <CardContent className="pt-4">
            {screen.framework_type && (
              <Badge className="bg-[#00FF00]/20 text-[#00FF00] border-[#00FF00]/30">
                {screen.framework_type}
              </Badge>
            )}
            
            <div className="mt-4">
              <p className="text-sm text-gray-400">
                Created: {new Date(screen.created_at).toLocaleDateString()}
              </p>
              {screen.updated_at && screen.updated_at !== screen.created_at && (
                <p className="text-sm text-gray-400">
                  Updated: {new Date(screen.updated_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="pt-2 border-t border-gray-800">
            <Button 
              variant="ghost" 
              className="w-full text-[#00FF00]"
            >
              View Details
            </Button>
          </CardFooter>
        </Card>
      ))}
      
      {/* Add new screen card */}
      <Card className="bg-black border border-dashed border-gray-700 hover:border-[#00FF00]/50 transition-all cursor-pointer flex flex-col justify-center items-center p-8 h-full" onClick={onAddScreen}>
        <Plus size={32} className="text-[#00FF00] mb-3" />
        <h3 className="text-[#00FF00] text-lg font-medium">Add New Screen</h3>
        <p className="text-gray-400 text-sm text-center mt-2">Create a new screen for this widget</p>
      </Card>
    </div>
  );
}
