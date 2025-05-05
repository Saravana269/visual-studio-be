
import { useToast } from "@/hooks/use-toast";
import { useConnectionUIState } from "./useConnectionUIState";
import { useScreenConnection } from "./useScreenConnection";
import { useConnectionStorage } from "./useConnectionStorage";

/**
 * Hook for handling option-specific connection logic
 */
export const useConnectionHandlers = (widgetId?: string) => {
  const { toast } = useToast();
  const { 
    setIsExistingScreenDialogOpen, 
    setCurrentScreen, 
    setConnectionContext 
  } = useConnectionUIState();
  const { 
    createNewScreen, 
    fetchCurrentScreen 
  } = useScreenConnection(widgetId);
  const { 
    storeNewScreenConnectionInfo, 
    storeFrameworkConnectionInfo,
    storeSelectedElement 
  } = useConnectionStorage();

  // Handle "new_screen" option for an element
  const handleNewScreenForElement = async (elementId: string) => {
    toast({
      title: "Creating New Screen",
      description: `Creating new screen connected to element: ${elementId}`,
    });
    
    const newScreen = await createNewScreen();
    
    if (newScreen) {
      // Store connection info for the new screen
      storeNewScreenConnectionInfo(newScreen.id, elementId);
    }
  };
  
  // Handle "existing_screen" option for an element
  const handleExistingScreenForElement = async (elementId: string) => {
    if (!widgetId) {
      toast({
        title: "Error",
        description: "Widget ID not available",
        variant: "destructive"
      });
      return;
    }
    
    const currentScreenId = localStorage.getItem('current_screen_id');
    const screenData = await fetchCurrentScreen(currentScreenId);
    
    setCurrentScreen(screenData);
    setConnectionContext({ 
      value: elementId, 
      context: `element_id_${elementId}`,
    });
    setIsExistingScreenDialogOpen(true);
  };
  
  // Handle "connect_widget" option for an element
  const handleConnectWidgetForElement = (elementId: string) => {
    toast({
      title: "Widget Connection",
      description: `Connecting to another widget from element: ${elementId}`,
    });
  };
  
  // Handle "terminate" option for an element
  const handleTerminateForElement = (elementId: string) => {
    toast({
      title: "Connection Terminated",
      description: `Removed connection for element: ${elementId}`,
    });
  };
  
  // Handle new screen creation for framework
  const handleNewScreenForFramework = async (frameworkType: string) => {
    toast({
      title: "Creating New Screen",
      description: `Creating new screen connection for ${frameworkType}`,
    });
    
    const newScreen = await createNewScreen();
    
    if (newScreen) {
      // Store connection info
      storeFrameworkConnectionInfo(newScreen.id, frameworkType);
    }
  };
  
  // Handle existing screen selection for framework
  const handleExistingScreenForFramework = async (baseContext: string, frameworkType: string, value: any) => {
    if (!widgetId) {
      toast({
        title: "Error",
        description: "Widget ID not available",
        variant: "destructive"
      });
      return;
    }
    
    const currentScreenId = localStorage.getItem('current_screen_id');
    const screenData = await fetchCurrentScreen(currentScreenId);
    
    setCurrentScreen(screenData);
    setConnectionContext({ 
      value, 
      context: baseContext,
      frameType: frameworkType
    });
    setIsExistingScreenDialogOpen(true);
  };
  
  // Handle connecting framework to another widget
  const handleConnectWidgetForFramework = (frameworkType: string) => {
    toast({
      title: "Widget Connection",
      description: `Connecting to another widget for ${frameworkType}`,
    });
  };
  
  // Handle terminating framework connection
  const handleTerminateForFramework = (frameworkType: string) => {
    toast({
      title: "Connection Terminated",
      description: `Removed connection for ${frameworkType}`,
    });
  };

  return {
    handleNewScreenForElement,
    handleExistingScreenForElement,
    handleConnectWidgetForElement,
    handleTerminateForElement,
    handleNewScreenForFramework,
    handleExistingScreenForFramework,
    handleConnectWidgetForFramework,
    handleTerminateForFramework
  };
};
