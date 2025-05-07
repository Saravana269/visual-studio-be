
import { useState } from "react";
import { useElementConnections } from "./storage/useElementConnections";
import { useFrameworkConnections } from "./storage/useFrameworkConnections";
import { useLocalStorageConnections } from "./storage/useLocalStorageConnections";
import { ConnectionValueContext } from "@/types/connection";

/**
 * Combined hook for storing connections in the database or local storage
 */
export function useConnectionStorage() {
  const { storeElementScreenConnection, isStoring: isStoringElement } = useElementConnections();
  const { storeFrameworkScreenConnection, isStoring: isStoringFramework } = useFrameworkConnections();
  const { storeSelectedElement, storeSelectedCOE } = useLocalStorageConnections();
  
  // Combined isStoring state to maintain backward compatibility
  const isStoring = isStoringElement || isStoringFramework;
  
  // Store connection context in session storage
  const storeConnectionContext = (connectionContext: ConnectionValueContext | null) => {
    try {
      if (connectionContext) {
        window.sessionStorage.setItem('connectionContext', JSON.stringify(connectionContext));
        console.log("💾 Stored connection context in session storage:", connectionContext);
      } else {
        window.sessionStorage.removeItem('connectionContext');
        console.log("🗑️ Removed connection context from session storage");
      }
    } catch (e) {
      console.error("Error storing connection context:", e);
    }
  };
  
  // Clear connection context from session storage
  const clearConnectionContext = () => {
    try {
      window.sessionStorage.removeItem('connectionContext');
      console.log("🗑️ Cleared connection context from session storage");
    } catch (e) {
      console.error("Error clearing connection context:", e);
    }
  };

  return {
    storeElementScreenConnection,
    storeFrameworkScreenConnection,
    storeSelectedElement,
    storeSelectedCOE,
    storeConnectionContext,
    clearConnectionContext,
    isStoring
  };
}
