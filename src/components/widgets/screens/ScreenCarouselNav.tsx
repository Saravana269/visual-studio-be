
import { useRef } from "react";
import { Screen } from "@/types/screen";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    <div className="relative">
      {screens.length > 3 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </>
      )}
      
      <div
        ref={scrollContainerRef}
        className="flex space-x-4 p-4 overflow-x-auto scrollbar-none"
      >
        {screens.map((screen) => (
          <div
            key={screen.id}
            onClick={() => onScreenSelect(screen.id)}
            className={`
              min-w-[180px] p-3 rounded-lg cursor-pointer transition-all
              ${activeScreenId === screen.id
                ? "bg-gray-800 border-2 border-[#00FF00]"
                : "bg-gray-900 border border-gray-700 hover:border-gray-500"}
            `}
          >
            <h3 className="font-semibold truncate">{screen.name}</h3>
            {screen.description && (
              <p className="text-sm text-gray-400 truncate">{screen.description}</p>
            )}
          </div>
        ))}
        
        <div
          onClick={onAddScreen}
          className="min-w-[180px] p-3 rounded-lg cursor-pointer border border-dashed border-gray-700 
            hover:border-[#00FF00]/50 bg-gray-900/50 hover:bg-gray-800/50 flex items-center justify-center"
        >
          <Plus className="h-5 w-5 text-[#00FF00]/70 mr-2" />
          <span className="text-[#00FF00]/70">Add Screen</span>
        </div>
      </div>
    </div>
  );
}
