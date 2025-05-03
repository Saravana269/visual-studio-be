
import { useToast } from "@/hooks/use-toast";

export const useConnectionHandler = () => {
  const { toast } = useToast();
  
  // Store selected COE in local storage for demo purposes
  const handleConnect = (frameworkType: string, value: any, context?: string) => {
    // For future connecting to different parts of the application
    if (context?.startsWith('element_id_')) {
      // Extract the element ID from the context
      const elementId = context.replace('element_id_', '');
      
      // Handle element connection
      toast({
        title: "Element Connected",
        description: `Connected element with ID: ${elementId}`,
      });
      
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
    } else {
      // Generic connection for other framework types
      toast({
        title: "Value Connected",
        description: `Connected ${frameworkType} value`,
      });
    }
  };

  return { handleConnect };
};
