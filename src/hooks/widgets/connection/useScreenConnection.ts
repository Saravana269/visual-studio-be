
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useScreenCreation } from "../useScreenCreation";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook to handle screen connection functionality
 */
export const useScreenConnection = (widgetId?: string) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createScreen, isLoading } = useScreenCreation({ widgetId });

  // Create a new screen for connection
  const createNewScreen = async () => {
    if (!widgetId) {
      toast({
        title: "Error",
        description: "Widget ID not available. Cannot create screen.",
        variant: "destructive"
      });
      return null;
    }

    try {
      const newScreen = await createScreen({
        name: "Untitled Screen",
        description: "",
        framework_type: null
      });
      
      if (newScreen) {
        // Navigate to the widget screens page with the new screen
        navigate(`/widgets/${widgetId}/screens`);
        
        toast({
          title: "Success",
          description: "New screen created and connected",
        });
      }
      
      return newScreen;
    } catch (error) {
      console.error("Error creating screen:", error);
      toast({
        title: "Error",
        description: "Failed to create new screen",
        variant: "destructive"
      });
      return null;
    }
  };
  
  // Fetch current screen data
  const fetchCurrentScreen = async (currentScreenId: string | null) => {
    if (!currentScreenId) return null;
    
    try {
      const { data: screenData } = await supabase
        .from('screens')
        .select('*')
        .eq('id', currentScreenId)
        .maybeSingle();
      
      return screenData;
    } catch (error) {
      console.error("Error fetching current screen:", error);
      return null;
    }
  };

  return {
    createNewScreen,
    fetchCurrentScreen,
    isCreatingScreen: isLoading
  };
};
