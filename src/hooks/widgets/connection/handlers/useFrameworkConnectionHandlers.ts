
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useConnectionDialogs } from "@/context/connection";
import { ConnectionValueContext, CreateScreenConnectionParams } from "@/types/connection";

export function useFrameworkConnectionHandlers(widgetId?: string) {
  const { toast } = useToast();
  const { openExistingScreenDialog } = useConnectionDialogs();

  /**
   * Framework-specific connection handlers
   */
  // Handle creating a new screen for a framework
  const handleNewScreenForFramework = async (frameworkType: string) => {
    try {
      // For now, just show a toast notification
      toast({
        title: "Create New Screen",
        description: `Create a new screen for ${frameworkType}`,
      });
      
      // In a real implementation, navigate to screen creation with context
      return true;
    } catch (error) {
      console.error('Error handling new screen creation for framework:', error);
      return false;
    }
  };
  
  // Handle connecting to an existing screen for a framework
  const handleExistingScreenForFramework = async (context: string, frameworkType: string, value: any) => {
    try {
      console.log("Opening dialog to select existing screen for framework", { context, frameworkType, value });
      
      // Create a connection context object for the openExistingScreenDialog
      const connectionContext: ConnectionValueContext = {
        value,
        context,
        widgetId
      };
      
      // Use the openExistingScreenDialog function with the context object
      openExistingScreenDialog(connectionContext);
      
      return true;
    } catch (error) {
      console.error('Error handling existing screen connection for framework:', error);
      return false;
    }
  };
  
  // Handle connecting to another widget for a framework
  const handleConnectWidgetForFramework = async (frameworkType: string) => {
    try {
      // For now, just show a toast notification
      toast({
        title: "Connect to Widget",
        description: `Connect ${frameworkType} to another widget`,
      });
      
      return true;
    } catch (error) {
      console.error('Error handling widget connection for framework:', error);
      return false;
    }
  };
  
  // Handle terminating connection for a framework
  const handleTerminateForFramework = async (frameworkType: string) => {
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
        element_ref: null,
        screen_ref: null,
        widget_ref: screenData.widget_id || null,
        framework_type: frameworkType,
        framework_type_ref: null,
        nextScreen_Ref: null,
        is_screen_terminated: true,
        connection_context: frameworkType,
        source_value: "framework_terminated",
        screen_name: null,
        screen_description: null,
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
        description: `Connection for ${frameworkType} has been terminated`,
      });
      
      return true;
    } catch (error) {
      console.error('Error terminating framework connection:', error);
      
      toast({
        title: "Termination Error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
      
      return false;
    }
  };

  return {
    handleNewScreenForFramework,
    handleExistingScreenForFramework,
    handleConnectWidgetForFramework,
    handleTerminateForFramework,
  };
}
