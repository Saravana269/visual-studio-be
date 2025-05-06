
import { useState } from "react";
import { useElementConnections } from "./storage/useElementConnections";
import { useFrameworkConnections } from "./storage/useFrameworkConnections";
import { useLocalStorageConnections } from "./storage/useLocalStorageConnections";

/**
 * Combined hook for storing connections in the database or local storage
 */
export function useConnectionStorage() {
  const { storeElementScreenConnection, isStoring: isStoringElement } = useElementConnections();
  const { storeFrameworkScreenConnection, isStoring: isStoringFramework } = useFrameworkConnections();
  const { storeSelectedElement, storeSelectedCOE } = useLocalStorageConnections();
  
  // Combined isStoring state to maintain backward compatibility
  const isStoring = isStoringElement || isStoringFramework;

  return {
    storeElementScreenConnection,
    storeFrameworkScreenConnection,
    storeSelectedElement,
    storeSelectedCOE,
    isStoring
  };
}
