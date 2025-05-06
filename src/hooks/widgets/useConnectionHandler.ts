
// This file is now a wrapper around the refactored hooks for backward compatibility
import { useConnectionManager } from "./connection/useConnectionManager";

export const useConnectionHandler = (widgetId?: string) => {
  return useConnectionManager(widgetId);
};
