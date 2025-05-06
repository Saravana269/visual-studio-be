
import { useToast } from "@/hooks/use-toast";
import { useConnectionUIState } from "./connection/useConnectionUIState";
import { useConnectionHandlers } from "./connection/useConnectionHandlers";
import { useConnectionStorage } from "./connection/useConnectionStorage";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export const useConnectionHandler = (widgetId?: string) => {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  
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
  
  // Store selected COE in local storage for demo purposes
  const handleConnect = async (frameworkType: string, value: any, context?: string) => {
    console.log("🔗 Handle Connect called:", { frameworkType, context, widgetId });
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

  // Handle connection to existing screen
  const handleExistingScreenConnect = async (selectedScreenId: string) => {
    console.log("🔄 Existing screen selected for connection", { selectedScreenId, connectionContext });
    setIsConnecting(true);
    
    try {
      if (!connectionContext) {
        console.warn("⚠️ No connection context available when trying to connect to existing screen");
        return;
      }
      
      if (connectionContext.context?.startsWith('element_id_')) {
        const elementId = connectionContext.context.replace('element_id_', '');
        await storeElementScreenConnection(elementId, selectedScreenId);
      } else {
        // For framework-level connections
        await storeFrameworkScreenConnection(
          connectionContext.frameType || 'unknown', 
          connectionContext.value, 
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

  return { 
    handleConnect, 
    isConnecting: isConnecting || isStoring,
    isExistingScreenDialogOpen,
    setIsExistingScreenDialogOpen,
    currentScreen,
    handleExistingScreenConnect 
  };
};
