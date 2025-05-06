
import { useConnectionCore } from "./useConnectionCore";
import { useConnectionOperations } from "./useConnectionOperations";

/**
 * Main hook for handling connections, combining core state management and operations
 */
export function useConnectionManager(widgetId?: string) {
  // Get core state and utilities
  const { 
    isConnecting, 
    setIsConnecting,
    isExistingScreenDialogOpen,
    setIsExistingScreenDialogOpen,
    currentScreen,
    setConnectionContext,
    fetchCurrentScreen,
    toast 
  } = useConnectionCore(widgetId);
  
  // Get connection operations
  const {
    handleExistingScreenConnect,
    isConnecting: isStoringConnection,
    handleNewScreenForElement,
    handleExistingScreenForElement,
    handleConnectWidgetForElement,
    handleTerminateForElement,
    handleNewScreenForFramework,
    handleExistingScreenForFramework,
    handleConnectWidgetForFramework,
    handleTerminateForFramework
  } = useConnectionOperations(widgetId);
  
  // Store selected COE in local storage for demo purposes
  const handleConnect = async (frameworkType: string, value: any, context?: string) => {
    console.log("🔗 Handle Connect called:", { frameworkType, context, widgetId });
    
    // Always try to fetch current screen first to ensure we have the data
    await fetchCurrentScreen();
    
    setIsConnecting(true);
    
    try {
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
          console.log(`📌 Element connection option selected: ${option} for element ${elementId}`);
          
          // Handle specific options
          switch(option) {
            case 'new_screen':
              await handleNewScreenForElement(elementId);
              break;
              
            case 'existing_screen':
              await handleExistingScreenForElement(elementId);
              break;
              
            case 'connect_widget':
              await handleConnectWidgetForElement(elementId);
              break;
              
            case 'terminate':
              await handleTerminateForElement(elementId);
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
      } else if (context === 'coe_id') {
        // Handle COE connection 
        toast({
          title: "COE Connected",
          description: `Connected COE with ID: ${value}`,
        });
      } else if (context?.includes(':')) {
        // Handle other contexts with options
        const [baseContext, option] = context.split(':');
        console.log(`📌 Framework connection option selected: ${option} for context ${baseContext}`);
        
        // Handle based on option
        switch(option) {
          case 'new_screen':
            await handleNewScreenForFramework(frameworkType);
            break;
            
          case 'existing_screen':
            console.log("🔍 Handling existing screen for framework", { baseContext, frameworkType, value, widgetId });
            // If we're on screens page, use panel layout instead of dialog
            if (window.location.pathname.includes('/screens')) {
              // Make sure we have current screen info first
              const currentScreenInfo = await fetchCurrentScreen();
              if (!currentScreenInfo) {
                toast({
                  title: "Connection Error",
                  description: "Current screen information not available",
                  variant: "destructive"
                });
                break;
              }
              
              // Dispatch custom event to open the panel in connection mode
              const customEvent = new CustomEvent('openConnectionPanel', { 
                detail: { connectionMode: "existingScreen" } 
              });
              window.dispatchEvent(customEvent);
            } else {
              // Use dialog approach for other pages
              await handleExistingScreenForFramework(baseContext, frameworkType, value);
            }
            break;
            
          case 'connect_widget':
            await handleConnectWidgetForFramework(frameworkType);
            break;
            
          case 'terminate':
            await handleTerminateForFramework(frameworkType);
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
    } catch (error) {
      console.error('Error handling connection:', error);
      toast({
        title: "Connection Error",
        description: "Failed to establish connection",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return { 
    handleConnect, 
    isConnecting: isConnecting || isStoringConnection,
    isExistingScreenDialogOpen,
    setIsExistingScreenDialogOpen,
    currentScreen,
    handleExistingScreenConnect,
    fetchCurrentScreen
  };
}
