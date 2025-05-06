
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ConnectionValueContext } from "@/types/connection";
import { useConnectionUIState } from "./useConnectionUIState";

/**
 * Core connection handler hook with shared state and basic utilities
 */
export function useConnectionCore(widgetId?: string) {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Get UI state management
  const {
    isExistingScreenDialogOpen,
    setIsExistingScreenDialogOpen,
    connectionContext,
    setConnectionContext,
    currentScreen,
    setCurrentScreen
  } = useConnectionUIState();
  
  // Set the connection context for use by dialog handlers
  const setActiveConnectionContext = (
    value: any, 
    context?: string, 
    frameType?: string
  ) => {
    setConnectionContext({
      value,
      context,
      frameType
    });
  };

  return {
    // State management
    isConnecting,
    setIsConnecting,
    isExistingScreenDialogOpen,
    setIsExistingScreenDialogOpen,
    connectionContext,
    setConnectionContext: setActiveConnectionContext,
    currentScreen,
    setCurrentScreen,
    // Utilities
    toast,
    widgetId
  };
}
