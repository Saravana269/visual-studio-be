
import { useState } from "react";
import { Screen } from "@/types/screen";

/**
 * Hook to manage the UI state for connection dialogs
 */
export const useConnectionUIState = () => {
  // Dialog state for existing screen selection
  const [isExistingScreenDialogOpen, setIsExistingScreenDialogOpen] = useState<boolean>(false);
  const [connectionContext, setConnectionContext] = useState<{
    value: any;
    context?: string;
    frameType?: string;
  } | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen | null>(null);
  
  return {
    isExistingScreenDialogOpen,
    setIsExistingScreenDialogOpen,
    connectionContext,
    setConnectionContext,
    currentScreen,
    setCurrentScreen,
  };
};
