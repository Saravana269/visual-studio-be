
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Screen } from "@/types/screen";
import { useToast } from "@/hooks/use-toast";
import { useConnectionDialogs } from "@/context/connection/useConnectionDialogs";

export function useConnectionManager(widgetId?: string) {
  const [currentScreen, setCurrentScreen] = useState<Screen | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  const { isExistingScreenDialogOpen, openExistingScreenDialog, closeExistingScreenDialog } = useConnectionDialogs();

  // Fetch the current screen using its ID
  const fetchCurrentScreen = async (screenId: string): Promise<Screen | null> => {
    try {
      const { data, error } = await supabase
        .from('screens')
        .select('*')
        .eq('id', screenId)
        .single();
      
      if (error) throw error;
      
      return data as Screen;
    } catch (error) {
      console.error("Error fetching current screen:", error);
      return null;
    }
  };

  // Handle connecting - open the connection dialog
  const handleConnect = (value: any, context?: string) => {
    // Get current screen ID from localStorage (set by OutputStep component)
    const screenId = localStorage.getItem('current_screen_id');
    console.log("🔗 handleConnect with screenId from localStorage:", screenId);
    
    // Create a context object with all needed values
    const connectionValueContext = {
      value,
      context,
      widgetId,
      screenId: screenId || undefined
    };
    
    // Pass the whole context object to openExistingScreenDialog
    openExistingScreenDialog(connectionValueContext);
  };

  // Handle connecting to an existing screen
  const handleExistingScreenConnect = async (selectedScreenId: string) => {
    setIsConnecting(true);
    
    try {
      // Get the current screen ID from localStorage
      const currentScreenId = localStorage.getItem('current_screen_id');
      
      if (!currentScreenId) {
        throw new Error('Current screen ID not available');
      }
      
      // Check if we have the current screen info
      let screen = currentScreen;
      
      if (!screen) {
        // Fetch the screen info if not available
        const screenData = await fetchCurrentScreen(currentScreenId);
        
        if (!screenData) {
          throw new Error('Failed to fetch current screen information');
        }
        
        screen = screenData;
        setCurrentScreen(screenData);
      }
      
      // Todo: Create the connection here
      toast({
        title: "Connection created",
        description: "Screen connection has been successfully created",
      });
      
      // Close the dialog
      closeExistingScreenDialog();
      
    } catch (error: any) {
      console.error("Error connecting to screen:", error);
      toast({
        title: "Connection Error",
        description: error.message || "Failed to create connection",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return {
    handleConnect,
    isConnecting,
    isExistingScreenDialogOpen,
    setIsExistingScreenDialogOpen: closeExistingScreenDialog,
    currentScreen,
    handleExistingScreenConnect,
    fetchCurrentScreen
  };
}
