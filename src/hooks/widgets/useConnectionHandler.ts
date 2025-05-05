
import { useToast } from "@/hooks/use-toast";
import { useConnectionUIState } from "./connection/useConnectionUIState";
import { useConnectionHandlers } from "./connection/useConnectionHandlers";
import { useConnectionStorage } from "./connection/useConnectionStorage";
import { supabase } from "@/integrations/supabase/client";

export const useConnectionHandler = (widgetId?: string) => {
  const { toast } = useToast();
  
  // Get UI state management
  const {
    isExistingScreenDialogOpen,
    setIsExistingScreenDialogOpen,
    connectionContext,
    setConnectionContext,
    currentScreen,
    setCurrentScreen
  } = useConnectionUIState();
  
  // Get connection storage utilities
  const {
    storeElementScreenConnection,
    storeFrameworkScreenConnection,
    storeSelectedElement,
    storeSelectedCOE
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
  
  // Store selected COE in local storage for demo purposes
  const handleConnect = async (frameworkType: string, value: any, context?: string) => {
    if (!context) {
      // Default generic connection
      toast({
        title: "Value Connected",
        description: `Connected ${frameworkType} value`,
      });
      return;
    }

    // Handle element connection with the new options menu
    if (context?.startsWith('element_id_')) {
      // Check if there's an option selected
      const [elementContext, option] = context.includes(':') 
        ? context.split(':') 
        : [context, null];
      
      // Extract the element ID from the context
      const elementId = elementContext.replace('element_id_', '');
      
      if (option) {
        // Handle specific options
        switch(option) {
          case 'new_screen':
            await handleNewScreenForElement(elementId);
            break;
            
          case 'existing_screen':
            await handleExistingScreenForElement(elementId);
            break;
            
          case 'connect_widget':
            handleConnectWidgetForElement(elementId);
            break;
            
          case 'terminate':
            handleTerminateForElement(elementId);
            break;
            
          default:
            // Generic element connection
            toast({
              title: "Element Connected",
              description: `Connected element with ID: ${elementId}`,
            });
        }
      } else {
        // Backwards compatibility for direct connections
        toast({
          title: "Element Connected",
          description: `Connected element with ID: ${elementId}`,
        });
      }
      
      // Store in local storage for demo
      storeSelectedElement(elementId);
    } else if (context === 'coe_id') {
      // Handle COE connection
      toast({
        title: "COE Connected",
        description: `Connected COE with ID: ${value}`,
      });
      
      // Store in local storage for demo
      storeSelectedCOE(value);
    } else if (context?.includes(':')) {
      // Handle other contexts with options
      const [baseContext, option] = context.split(':');
      
      // Handle based on option
      switch(option) {
        case 'new_screen':
          await handleNewScreenForFramework(frameworkType);
          break;
          
        case 'existing_screen':
          await handleExistingScreenForFramework(baseContext, frameworkType, value);
          break;
          
        case 'connect_widget':
          handleConnectWidgetForFramework(frameworkType);
          break;
          
        case 'terminate':
          handleTerminateForFramework(frameworkType);
          break;
          
        default:
          // Generic connection
          toast({
            title: "Value Connected",
            description: `Connected ${frameworkType} value with option: ${option}`,
          });
      }
    } else {
      // Generic connection for other framework types
      toast({
        title: "Value Connected",
        description: `Connected ${frameworkType} value`,
      });
    }
  };

  // Handle connection to existing screen
  const handleExistingScreenConnect = (selectedScreenId: string) => {
    if (!connectionContext) return;
    
    if (connectionContext.context?.startsWith('element_id_')) {
      const elementId = connectionContext.context.replace('element_id_', '');
      storeElementScreenConnection(elementId, selectedScreenId);
    } else {
      // For framework-level connections
      storeFrameworkScreenConnection(
        connectionContext.frameType || 'unknown', 
        connectionContext.value, 
        selectedScreenId
      );
    }
    
    // Clear state
    setConnectionContext(null);
  };

  return { 
    handleConnect, 
    isConnecting: false, // We'll set this to false since we split out the loading state
    isExistingScreenDialogOpen,
    setIsExistingScreenDialogOpen,
    currentScreen,
    handleExistingScreenConnect 
  };
};
