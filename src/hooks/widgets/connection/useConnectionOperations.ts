
import { supabase } from "@/integrations/supabase/client";
import { useConnectionCore } from "./useConnectionCore";
import { useConnectionStorage } from "./useConnectionStorage";
import { useConnectionHandlers } from "./useConnectionHandlers";
import { ConnectionValueContext } from "@/types/connection"; // Fixed the missing import

/**
 * Hook that provides operations for connecting elements and frameworks
 */
export function useConnectionOperations(widgetId?: string) {
  // Get core state and utilities
  const { 
    setIsConnecting, 
    setIsExistingScreenDialogOpen, 
    setConnectionContext,
    toast 
  } = useConnectionCore(widgetId);
  
  // Get connection storage utilities
  const {
    storeElementScreenConnection,
    storeFrameworkScreenConnection,
    storeSelectedElement,
    storeSelectedCOE,
    isStoring
  } = useConnectionStorage();
  
  // Get option-specific handlers
  const {
    handleNewScreenForElement,
    handleExistingScreenForElement,
    handleConnectWidgetForElement,
    handleTerminateForElement,
    handleNewScreenForFramework,
    handleExistingScreenForFramework,
    handleConnectWidgetForFramework,
    handleTerminateForFramework
  } = useConnectionHandlers(widgetId);
  
  // Handle connection to existing screen
  const handleExistingScreenConnect = async (selectedScreenId: string) => {
    console.log("🔄 Existing screen selected for connection", { selectedScreenId });
    setIsConnecting(true);
    
    try {
      const connectionCtx = await fetchConnectionContext();
      
      if (!connectionCtx) {
        console.warn("⚠️ No connection context available when trying to connect to existing screen");
        return;
      }
      
      if (connectionCtx.context?.startsWith('element_id_')) {
        const elementId = connectionCtx.context.replace('element_id_', '');
        await storeElementScreenConnection(elementId, selectedScreenId);
      } else {
        // For framework-level connections
        await storeFrameworkScreenConnection(
          connectionCtx.frameType || 'unknown', 
          connectionCtx.value, 
          selectedScreenId
        );
      }
      
      // Clear state
      setConnectionContext(null);
      
      // Close dialog after connection
      setIsExistingScreenDialogOpen(false);
      
      toast({
        title: "Screen Connected",
        description: "Successfully connected to the selected screen",
      });
    } catch (error) {
      console.error("Error connecting to screen:", error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to selected screen",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };
  
  // Helper to fetch connection context (in a real app, this might fetch from state or API)
  const fetchConnectionContext = async (): Promise<ConnectionValueContext | null> => {
    // For this example, we're just returning the state directly
    // but in a real app you might need to fetch this from an API or other source
    return new Promise((resolve) => {
      const ctx = window.sessionStorage.getItem('connectionContext');
      
      if (ctx) {
        try {
          resolve(JSON.parse(ctx));
        } catch (e) {
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  };

  return {
    handleExistingScreenConnect,
    isConnecting: isStoring,
    handleNewScreenForElement,
    handleExistingScreenForElement,
    handleConnectWidgetForElement,
    handleTerminateForElement,
    handleNewScreenForFramework,
    handleExistingScreenForFramework,
    handleConnectWidgetForFramework,
    handleTerminateForFramework
  };
}
