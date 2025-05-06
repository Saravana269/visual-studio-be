
// This file is now a wrapper around the refactored hooks for backward compatibility
import { useConnectionManager } from "./connection/useConnectionManager";

export const useConnectionHandler = (widgetId?: string) => {
  const {
    handleConnect,
    isConnecting,
    isExistingScreenDialogOpen,
    setIsExistingScreenDialogOpen,
    currentScreen,
    handleExistingScreenConnect,
    fetchCurrentScreen
  } = useConnectionManager(widgetId);

  return {
    handleConnect,
    isConnecting,
    isExistingScreenDialogOpen,
    setIsExistingScreenDialogOpen,
    currentScreen,
    handleExistingScreenConnect,
    fetchCurrentScreen
  };
};
