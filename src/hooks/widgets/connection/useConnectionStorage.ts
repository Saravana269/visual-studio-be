
import { useToast } from "@/hooks/use-toast";

/**
 * Hook to handle storing connection data between screens and elements
 */
export const useConnectionStorage = () => {
  const { toast } = useToast();

  // Store connection in local storage
  const storeConnection = (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.error("Error storing connection data:", e);
      return false;
    }
  };
  
  // Store element connection to screen
  const storeElementScreenConnection = (elementId: string, screenId: string) => {
    const success = storeConnection(`element_connected_to_screen_${elementId}`, screenId);
    
    if (success) {
      toast({
        title: "Connection Established",
        description: `Connected element to screen "${screenId}"`,
      });
    }
    
    return success;
  };
  
  // Store framework connection to screen
  const storeFrameworkScreenConnection = (frameworkType: string, value: any, screenId: string) => {
    const success = storeConnection(
      `framework_connection_${frameworkType}_${value}`, 
      screenId
    );
    
    if (success) {
      toast({
        title: "Connection Established",
        description: `Connected ${frameworkType} to screen "${screenId}"`,
      });
    }
    
    return success;
  };
  
  // Store connection info for new screen
  const storeNewScreenConnectionInfo = (screenId: string, connectionData: string) => {
    return storeConnection(`connected_element_${screenId}`, connectionData);
  };
  
  // Store framework info for new screen
  const storeFrameworkConnectionInfo = (screenId: string, frameworkType: string) => {
    return storeConnection(`connected_framework_${screenId}`, frameworkType);
  };
  
  // Store selected element for screen (for demo purposes)
  const storeSelectedElement = (elementId: string) => {
    return storeConnection("selected_element_for_screen", elementId);
  };
  
  // Store selected COE for screen (for demo purposes)
  const storeSelectedCOE = (coeId: string) => {
    return storeConnection("selected_coe_for_screen", coeId);
  };

  return {
    storeElementScreenConnection,
    storeFrameworkScreenConnection,
    storeNewScreenConnectionInfo,
    storeFrameworkConnectionInfo,
    storeSelectedElement,
    storeSelectedCOE
  };
};
