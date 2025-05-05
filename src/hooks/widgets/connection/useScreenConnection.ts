
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
    console.log("🔍 Fetching current screen with ID:", currentScreenId);
    
    if (!currentScreenId) {
      console.warn("⚠️ No current screen ID provided");
      // Try to get active screen from URL if not in localStorage
      const path = window.location.pathname;
      const matches = path.match(/\/widgets\/([^\/]+)\/screens\/([^\/]+)/);
      
      if (matches && matches.length >= 3) {
        currentScreenId = matches[2];
        console.log("📌 Extracted screen ID from URL:", currentScreenId);
      } else {
        console.error("❌ Could not determine current screen ID");
        return null;
      }
    }
    
    try {
      console.log("🔄 Fetching screen from Supabase with ID:", currentScreenId);
      const { data: screenData, error } = await supabase
        .from('screens')
        .select('*')
        .eq('id', currentScreenId)
        .maybeSingle();
      
      if (error) {
        console.error("❌ Supabase error fetching screen:", error);
        throw error;
      }
      
      console.log("✅ Screen data retrieved:", screenData);
      return screenData;
    } catch (error) {
      console.error("❌ Error fetching current screen:", error);
      return null;
    }
  };

  return {
    createNewScreen,
    fetchCurrentScreen,
    isCreatingScreen: isLoading
  };
};
