
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useConnectionDialogs } from "@/context/connection";
import { ConnectionValueContext, CreateScreenConnectionParams } from "@/types/connection";

export function useElementConnectionHandlers(widgetId?: string) {
  const { toast } = useToast();
  const { openExistingScreenDialog } = useConnectionDialogs();

  /**
   * Element-specific connection handlers
   */
  // Handle creating a new screen for an element
  const handleNewScreenForElement = async (elementId: string) => {
    try {
      // For now, just show a toast notification
      toast({
        title: "Create New Screen",
        description: `Create a new screen for element with ID: ${elementId}`,
      });
      
      // In a real implementation, navigate to screen creation with context
      return true;
    } catch (error) {
      console.error('Error handling new screen creation for element:', error);
      return false;
    }
  };
  
  // Handle connecting to an existing screen for an element
  const handleExistingScreenForElement = async (elementId: string) => {
    try {
      console.log("Opening dialog to select existing screen for element", elementId);
      
      // If we already have an element ID, create connection context and use openExistingScreenDialog
      if (elementId) {
        const connectionContext: ConnectionValueContext = {
          value: null,
          context: `element_id_${elementId}`,
          widgetId
        };
        
        openExistingScreenDialog(connectionContext);
      }
      
      return true;
    } catch (error) {
      console.error('Error handling existing screen connection for element:', error);
      return false;
    }
  };
  
  // Handle connecting to another widget for an element
  const handleConnectWidgetForElement = async (elementId: string) => {
    try {
      // For now, just show a toast notification
      toast({
        title: "Connect to Widget",
        description: `Connect element with ID: ${elementId} to another widget`,
      });
      
      return true;
    } catch (error) {
      console.error('Error handling widget connection for element:', error);
      return false;
    }
  };
  
  // Handle terminating connection for an element
  const handleTerminateForElement = async (elementId: string) => {
    try {
      // Get current screen ID
      const currentScreenId = localStorage.getItem('current_screen_id');
      if (!currentScreenId) {
        throw new Error('No current screen ID available');
      }
      
      // Get current screen data
      const { data: screenData, error: screenError } = await supabase
        .from('screens')
        .select('*')
        .eq('id', currentScreenId)
        .maybeSingle();
      
      if (screenError || !screenData) {
        throw new Error('Failed to fetch current screen data');
      }
      
      // Store the terminated connection in the database
      const connectionData: CreateScreenConnectionParams = {
        element_ref: elementId,
        screen_ref: currentScreenId,
        widget_ref: screenData.widget_id || null,
        framework_type: null,
        framework_type_ref: null,
        nextScreen_Ref: null,
        is_screen_terminated: true,
        connection_context: `element_id_${elementId}`,
        source_value: "element_terminated",
        screen_name: screenData.name,
        screen_description: screenData.description,
        property_values: null
      };
      
      // Store in database
      const { error } = await supabase
        .from('connect_screens')
        .insert(connectionData);
      
      if (error) {
        throw new Error(`Failed to store terminated connection: ${error.message}`);
      }
      
      toast({
        title: "Connection Terminated",
        description: `Connection for element with ID: ${elementId} has been terminated`,
      });
      
      return true;
    } catch (error) {
      console.error('Error terminating element connection:', error);
      
      toast({
        title: "Termination Error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
      
      return false;
    }
  };

  return {
    handleNewScreenForElement,
    handleExistingScreenForElement,
    handleConnectWidgetForElement,
    handleTerminateForElement,
  };
}
