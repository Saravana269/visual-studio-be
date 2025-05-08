
import { useState, useEffect } from "react";
import { Screen } from "@/types/screen";
import { useOptionConnections } from "./connection/useOptionConnections";

interface UseScreenNavigationProps {
  screens: Screen[];
}

export function useScreenNavigation({ screens }: UseScreenNavigationProps) {
  const [activeScreenIndex, setActiveScreenIndex] = useState<number>(0);
  const [activeScreenId, setActiveScreenId] = useState<string | null>(null);
  
  // Get the clearSelectedValues function from useOptionConnections
  const { clearSelectedValues } = useOptionConnections();

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
      clearSelectedValues(); // Clear selected values when changing screens
    }
  };

  // Navigate to a specific screen by ID
  const goToScreen = (screenId: string) => {
    const index = screens.findIndex(screen => screen.id === screenId);
    if (index !== -1) {
      setActiveScreenIndex(index);
      setActiveScreenId(screenId);
      clearSelectedValues(); // Clear selected values when changing screens
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
