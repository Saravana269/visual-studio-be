
import { useState, useEffect } from "react";
import { Screen } from "@/types/screen";

interface UseScreenNavigationProps {
  screens: Screen[];
}

export function useScreenNavigation({ screens }: UseScreenNavigationProps) {
  const [activeScreenIndex, setActiveScreenIndex] = useState<number>(0);
  const [activeScreenId, setActiveScreenId] = useState<string | null>(null);

  // Initialize activeScreenId when screens are loaded
  useEffect(() => {
    if (screens.length > 0 && activeScreenIndex < screens.length) {
      setActiveScreenId(screens[activeScreenIndex].id);
    } else {
      setActiveScreenId(null);
    }
  }, [screens, activeScreenIndex]);

  // Get the currently active screen
  const activeScreen = activeScreenId
    ? screens.find(screen => screen.id === activeScreenId) || null
    : screens[activeScreenIndex] || null;

  // Navigate to a specific screen by index
  const goToScreenByIndex = (index: number) => {
    if (index >= 0 && index < screens.length) {
      setActiveScreenIndex(index);
      setActiveScreenId(screens[index].id);
    }
  };

  // Navigate to a specific screen by ID
  const goToScreen = (screenId: string) => {
    const index = screens.findIndex(screen => screen.id === screenId);
    if (index !== -1) {
      setActiveScreenIndex(index);
      setActiveScreenId(screenId);
    }
  };

  return {
    activeScreenIndex,
    activeScreenId,
    activeScreen,
    goToScreenByIndex,
    goToScreen
  };
}
