
import { useRef } from "react";
import { Screen } from "@/types/screen";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

interface ScreenCarouselNavProps {
  screens: Screen[];
  activeScreenId: string | null;
  onScreenSelect: (screenId: string) => void;
  onAddScreen: () => void;
}

export function ScreenCarouselNav({
  screens,
  activeScreenId,
  onScreenSelect,
  onAddScreen
}: ScreenCarouselNavProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll left handler
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  // Scroll right handler
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div className="relative border-t border-gray-800 pt-4">
      <h3 className="text-sm font-medium text-gray-400 px-4 mb-2">Screen Navigation</h3>
      
      <div className="relative">
        {screens.length > 3 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/80 hover:bg-black/90 text-gray-400 hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={scrollRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/80 hover:bg-black/90 text-gray-400 hover:text-white"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
        
        <div
          ref={scrollContainerRef}
          className="flex space-x-2 p-2 overflow-x-auto scrollbar-none"
        >
          {screens.map((screen) => (
            <div
              key={screen.id}
              onClick={() => onScreenSelect(screen.id)}
              className={`
                min-w-[180px] max-w-[180px] p-3 rounded-md cursor-pointer transition-all
                ${activeScreenId === screen.id
                  ? "bg-[#00FF00]/10 border-2 border-[#00FF00]/40"
                  : "bg-gray-900 border border-gray-800 hover:border-gray-700"}
              `}
            >
              <h3 className="font-medium text-sm truncate mb-1">
                {screen.name || "Untitled"}
              </h3>
              {screen.description && (
                <p className="text-xs text-gray-400 truncate">{screen.description}</p>
              )}
              {screen.framework_type && (
                <div className="mt-2">
                  <span className="text-[10px] bg-[#00FF00]/10 text-[#00FF00] px-2 py-0.5 rounded-full">
                    {screen.framework_type}
                  </span>
                </div>
              )}
            </div>
          ))}
          
          <div
            onClick={onAddScreen}
            className="
              min-w-[120px] p-3 rounded-md cursor-pointer border border-dashed border-gray-700 
              hover:border-[#00FF00]/50 bg-black hover:bg-gray-900 flex items-center justify-center
            "
          >
            <Plus className="h-4 w-4 text-[#00FF00] mr-2" />
            <span className="text-[#00FF00] text-sm">Add Screen</span>
          </div>
        </div>
      </div>
    </div>
  );
}
