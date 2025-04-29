
import { useState, useCallback } from 'react';
import { Screen } from '@/types/screen';

interface UseScreenNavigationProps {
  screens: Screen[];
}

export function useScreenNavigation({ screens }: UseScreenNavigationProps) {
  const [activeScreenId, setActiveScreenId] = useState<string | null>(screens[0]?.id || null);
  
  // Get the current screen object
  const activeScreen = screens.find(screen => screen.id === activeScreenId) || null;
  
  // Get the current screen index for stepper
  const activeScreenIndex = screens.findIndex(screen => screen.id === activeScreenId);
  
  // Navigate to next screen
  const goToNextScreen = useCallback(() => {
    if (activeScreenIndex < screens.length - 1) {
      setActiveScreenId(screens[activeScreenIndex + 1].id);
    }
  }, [activeScreenIndex, screens]);
  
  // Navigate to previous screen
  const goToPreviousScreen = useCallback(() => {
    if (activeScreenIndex > 0) {
      setActiveScreenId(screens[activeScreenIndex - 1].id);
    }
  }, [activeScreenIndex, screens]);
  
  // Navigate to specific screen by ID
  const goToScreen = useCallback((screenId: string) => {
    const screenExists = screens.some(screen => screen.id === screenId);
    if (screenExists) {
      setActiveScreenId(screenId);
    }
  }, [screens]);
  
  // Navigate to specific screen by index
  const goToScreenByIndex = useCallback((index: number) => {
    if (index >= 0 && index < screens.length) {
      setActiveScreenId(screens[index].id);
    }
  }, [screens]);
  
  // Check if it's the first screen
  const isFirstScreen = activeScreenIndex === 0;
  
  // Check if it's the last screen
  const isLastScreen = activeScreenIndex === screens.length - 1;
  
  return {
    activeScreenId,
    activeScreen,
    activeScreenIndex,
    goToNextScreen,
    goToPreviousScreen,
    goToScreen,
    goToScreenByIndex,
    isFirstScreen,
    isLastScreen
  };
}
