
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useScreenCreation } from "./useScreenCreation";

export const useConnectionHandler = (widgetId?: string) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { createScreen, isLoading } = useScreenCreation({ widgetId });
  
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
            toast({
              title: "Creating New Screen",
              description: `Creating new screen connected to element: ${elementId}`,
            });
            
            // Create a new screen if widget ID is available
            if (widgetId) {
              try {
                const newScreen = await createScreen({
                  name: "Untitled Screen",
                  description: "",
                  framework_type: null
                });
                
                if (newScreen) {
                  // Store connection info for the new screen
                  try {
                    localStorage.setItem(`connected_element_${newScreen.id}`, elementId);
                  } catch (e) {
                    console.error("Error storing connection info:", e);
                  }
                  
                  // Navigate to the widget screens page with the new screen
                  navigate(`/widgets/${widgetId}/screens`);
                  
                  toast({
                    title: "Success",
                    description: "New screen created and connected to element",
                  });
                }
              } catch (error) {
                console.error("Error creating screen:", error);
                toast({
                  title: "Error",
                  description: "Failed to create new screen",
                  variant: "destructive"
                });
              }
            } else {
              toast({
                title: "Error",
                description: "Widget ID not available. Cannot create screen.",
                variant: "destructive"
              });
            }
            break;
          case 'existing_screen':
            toast({
              title: "Existing Screen Connection",
              description: `Connecting to existing screen from element: ${elementId}`,
            });
            break;
          case 'connect_widget':
            toast({
              title: "Widget Connection",
              description: `Connecting to another widget from element: ${elementId}`,
            });
            break;
          case 'terminate':
            toast({
              title: "Connection Terminated",
              description: `Removed connection for element: ${elementId}`,
            });
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
      try {
        localStorage.setItem("selected_element_for_screen", elementId);
      } catch (e) {
        console.error("Error storing element ID in localStorage:", e);
      }
    } else if (context === 'coe_id') {
      // Handle COE connection
      toast({
        title: "COE Connected",
        description: `Connected COE with ID: ${value}`,
      });
      
      // Store in local storage for demo
      try {
        localStorage.setItem("selected_coe_for_screen", value);
      } catch (e) {
        console.error("Error storing COE ID in localStorage:", e);
      }
    } else if (context?.includes(':')) {
      // Handle other contexts with options
      const [baseContext, option] = context.split(':');
      
      // Handle based on option
      switch(option) {
        case 'new_screen':
          toast({
            title: "Creating New Screen",
            description: `Creating new screen connection for ${frameworkType}`,
          });
          
          // Create a new screen if widget ID is available
          if (widgetId) {
            try {
              const newScreen = await createScreen({
                name: "Untitled Screen",
                description: "",
                framework_type: null
              });
              
              if (newScreen) {
                // Store connection info
                try {
                  localStorage.setItem(`connected_framework_${newScreen.id}`, frameworkType);
                } catch (e) {
                  console.error("Error storing connection info:", e);
                }
                
                // Navigate to the widget screens page with the new screen
                navigate(`/widgets/${widgetId}/screens`);
                
                toast({
                  title: "Success",
                  description: "New screen created and connected",
                });
              }
            } catch (error) {
              console.error("Error creating screen:", error);
              toast({
                title: "Error",
                description: "Failed to create new screen",
                variant: "destructive"
              });
            }
          } else {
            toast({
              title: "Error",
              description: "Widget ID not available. Cannot create screen.",
              variant: "destructive"
            });
          }
          break;
        case 'existing_screen':
          toast({
            title: "Existing Screen Connection",
            description: `Connecting to existing screen for ${frameworkType}`,
          });
          break;
        case 'connect_widget':
          toast({
            title: "Widget Connection",
            description: `Connecting to another widget for ${frameworkType}`,
          });
          break;
        case 'terminate':
          toast({
            title: "Connection Terminated",
            description: `Removed connection for ${frameworkType}`,
          });
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

  return { handleConnect, isConnecting: isLoading };
};
