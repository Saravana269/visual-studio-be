
import { useCallback } from "react";
import { ConnectionValueContext } from "@/types/connection";

export const useConnectionStorage = () => {
  // Store connection context in session storage
  const storeConnectionContext = useCallback((connectionContext: ConnectionValueContext | null) => {
    try {
      if (connectionContext) {
        window.sessionStorage.setItem('connectionContext', JSON.stringify({ 
          value: connectionContext.value, 
          context: connectionContext.context, 
          frameType: connectionContext.frameType,
          widgetId: connectionContext.widgetId,
          screenId: connectionContext.screenId
        }));
        console.log("💾 Stored connection context in session storage:", connectionContext);
      } else {
        window.sessionStorage.removeItem('connectionContext');
        console.log("🗑️ Removed connection context from session storage");
      }
    } catch (e) {
      console.error("Error managing connection context in session storage:", e);
    }
  }, []);

  // Retrieve connection context from session storage
  const getConnectionContext = useCallback((): ConnectionValueContext | null => {
    try {
      const storedContext = window.sessionStorage.getItem('connectionContext');
      if (storedContext) {
        return JSON.parse(storedContext);
      }
      return null;
    } catch (e) {
      console.error("Error retrieving connection context from session storage:", e);
      return null;
    }
  }, []);

  // Clear connection context from session storage
  const clearConnectionContext = useCallback(() => {
    try {
      window.sessionStorage.removeItem('connectionContext');
    } catch (e) {
      console.error("Error removing connection context from session storage:", e);
    }
  }, []);

  return {
    storeConnectionContext,
    getConnectionContext,
    clearConnectionContext
  };
};
