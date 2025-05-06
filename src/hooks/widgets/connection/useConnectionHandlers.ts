
import { useToast } from "@/hooks/use-toast";
import { useConnectionUIState } from "./useConnectionUIState";
import { useScreenConnection } from "./useScreenConnection";
import { useConnectionStorage } from "./useConnectionStorage";
import { CreateScreenConnectionParams } from "@/types/connection";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

/**
 * Hook for handling option-specific connection logic
 */
export const useConnectionHandlers = (widgetId?: string) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { 
    setIsExistingScreenDialogOpen, 
    setCurrentScreen, 
    setConnectionContext 
  } = useConnectionUIState();
  
  const { 
    createNewScreen, 
    fetchCurrentScreen 
  } = useScreenConnection(widgetId);
  
  const { 
    storeNewScreenConnectionInfo, 
    storeFrameworkConnectionInfo
  } = useConnectionStorage();

  // Handle "new_screen" option for an element
  const handleNewScreenForElement = async (elementId: string) => {
    setIsProcessing(true);
    try {
      toast({
        title: "Creating New Screen",
        description: `Creating new screen connected to element: ${elementId}`,
      });
      
      const newScreen = await createNewScreen();
      
      if (newScreen) {
        // Store connection in Supabase
        await storeNewScreenConnectionInfo(
          newScreen.id, 
          elementId, 
          widgetId
        );
        
        // Create element connection record
        const connectionData: CreateScreenConnectionParams = {
          element_ref: elementId,
          screen_ref: newScreen.id,
          widget_ref: widgetId || null,
          framework_type: null,
          framework_type_ref: null,
          is_screen_terminated: false,
          previous_connected_screen_ref: null,
          next_connected_screen_ref: null,
          coe_ref: null,
          connection_context: "element_to_screen",
          source_value: elementId
        };
        
        const { error } = await supabase
          .from('connect_screens')
          .insert(connectionData);
          
        if (error) {
          console.error("Error storing element connection:", error);
        }
      }
    } catch (error) {
      console.error("Error creating new screen for element:", error);
      toast({
        title: "Error",
        description: "Failed to create new screen",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle "existing_screen" option for an element
  const handleExistingScreenForElement = async (elementId: string) => {
    setIsProcessing(true);
    try {
      console.log("🔍 Handling existing screen for element", { elementId, widgetId });
      
      if (!widgetId) {
        console.error("❌ Widget ID not available for existing screen selection");
        toast({
          title: "Error",
          description: "Widget ID not available",
          variant: "destructive"
        });
        return;
      }
      
      const currentScreenId = localStorage.getItem('current_screen_id');
      console.log("📋 Current screen ID from localStorage:", currentScreenId);
      
      try {
        const screenData = await fetchCurrentScreen(currentScreenId);
        console.log("📊 Current screen data:", screenData);
        
        if (screenData) {
          setCurrentScreen(screenData);
          setConnectionContext({ 
            value: elementId, 
            context: `element_id_${elementId}`,
          });
          setIsExistingScreenDialogOpen(true);
        } else {
          console.error("❌ Failed to fetch current screen data");
          toast({
            title: "Error",
            description: "Could not load current screen information",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("❌ Error fetching current screen:", error);
        toast({
          title: "Error",
          description: "Failed to load screen information",
          variant: "destructive"
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle "connect_widget" option for an element
  const handleConnectWidgetForElement = async (elementId: string) => {
    setIsProcessing(true);
    try {
      toast({
        title: "Widget Connection",
        description: `Connecting to another widget from element: ${elementId}`,
      });
      
      // For demonstration purposes, just store a placeholder connection
      const connectionData: CreateScreenConnectionParams = {
        element_ref: elementId,
        screen_ref: null,
        widget_ref: widgetId || null,
        framework_type: null,
        framework_type_ref: null,
        is_screen_terminated: false,
        previous_connected_screen_ref: null,
        next_connected_screen_ref: null,
        coe_ref: null,
        connection_context: "element_to_widget",
        source_value: elementId
      };
      
      const { error } = await supabase
        .from('connect_screens')
        .insert(connectionData);
        
      if (error) {
        console.error("Error storing widget connection:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error connecting element to widget:", error);
      toast({
        title: "Error",
        description: "Failed to connect to widget",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle "terminate" option for an element
  const handleTerminateForElement = async (elementId: string) => {
    setIsProcessing(true);
    try {
      // Find any existing connections for this element
      const { data: existingConnections, error: fetchError } = await supabase
        .from('connect_screens')
        .select('*')
        .eq('element_ref', elementId);
        
      if (fetchError) {
        console.error("Error fetching element connections:", fetchError);
        throw fetchError;
      }
      
      if (existingConnections && existingConnections.length > 0) {
        // Update connections to mark as terminated
        const { error } = await supabase
          .from('connect_screens')
          .update({ is_screen_terminated: true })
          .eq('element_ref', elementId);
          
        if (error) {
          console.error("Error terminating connections:", error);
          throw error;
        }
      } else {
        // Create a terminated connection record
        const connectionData: CreateScreenConnectionParams = {
          element_ref: elementId,
          screen_ref: null,
          widget_ref: widgetId || null,
          framework_type: null,
          framework_type_ref: null,
          is_screen_terminated: true,
          previous_connected_screen_ref: null,
          next_connected_screen_ref: null,
          coe_ref: null,
          connection_context: "terminated",
          source_value: elementId
        };
        
        const { error } = await supabase
          .from('connect_screens')
          .insert(connectionData);
          
        if (error) {
          console.error("Error creating terminated connection:", error);
          throw error;
        }
      }
      
      toast({
        title: "Connection Terminated",
        description: `Removed connection for element: ${elementId}`,
      });
    } catch (error) {
      console.error("Error terminating element connection:", error);
      toast({
        title: "Error",
        description: "Failed to terminate connection",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle new screen creation for framework
  const handleNewScreenForFramework = async (frameworkType: string) => {
    setIsProcessing(true);
    try {
      toast({
        title: "Creating New Screen",
        description: `Creating new screen connection for ${frameworkType}`,
      });
      
      const newScreen = await createNewScreen();
      
      if (newScreen) {
        // Store framework connection info
        await storeFrameworkConnectionInfo(newScreen.id, frameworkType, widgetId);
        
        // Create framework connection record
        const connectionData: CreateScreenConnectionParams = {
          element_ref: null,
          screen_ref: newScreen.id,
          widget_ref: widgetId || null,
          framework_type: frameworkType,
          framework_type_ref: null,
          is_screen_terminated: false,
          previous_connected_screen_ref: null,
          next_connected_screen_ref: null,
          coe_ref: null,
          connection_context: "framework_to_screen",
          source_value: frameworkType
        };
        
        const { error } = await supabase
          .from('connect_screens')
          .insert(connectionData);
          
        if (error) {
          console.error("Error storing framework connection:", error);
          throw error;
        }
      }
    } catch (error) {
      console.error("Error creating new screen for framework:", error);
      toast({
        title: "Error",
        description: "Failed to create new screen",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle existing screen selection for framework
  const handleExistingScreenForFramework = async (baseContext: string, frameworkType: string, value: any) => {
    setIsProcessing(true);
    try {
      console.log("🔍 Handling existing screen for framework", { baseContext, frameworkType, value, widgetId });
      
      if (!widgetId) {
        console.error("❌ Widget ID not available for existing screen selection");
        toast({
          title: "Error",
          description: "Widget ID not available",
          variant: "destructive"
        });
        return;
      }
      
      const currentScreenId = localStorage.getItem('current_screen_id');
      console.log("📋 Current screen ID from localStorage:", currentScreenId);
      
      try {
        const screenData = await fetchCurrentScreen(currentScreenId);
        console.log("📊 Current screen data:", screenData);
        
        if (screenData) {
          setCurrentScreen(screenData);
          setConnectionContext({ 
            value, 
            context: baseContext,
            frameType: frameworkType
          });
          setIsExistingScreenDialogOpen(true);
        } else {
          console.error("❌ Failed to fetch current screen data");
          toast({
            title: "Error",
            description: "Could not load current screen information",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("❌ Error fetching current screen:", error);
        toast({
          title: "Error",
          description: "Failed to load screen information",
          variant: "destructive"
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle connecting framework to another widget
  const handleConnectWidgetForFramework = async (frameworkType: string) => {
    setIsProcessing(true);
    try {
      toast({
        title: "Widget Connection",
        description: `Connecting to another widget for ${frameworkType}`,
      });
      
      // For demonstration purposes, just store a placeholder connection
      const connectionData: CreateScreenConnectionParams = {
        element_ref: null,
        screen_ref: null,
        widget_ref: widgetId || null,
        framework_type: frameworkType,
        framework_type_ref: null,
        is_screen_terminated: false,
        previous_connected_screen_ref: null,
        next_connected_screen_ref: null,
        coe_ref: null,
        connection_context: "framework_to_widget",
        source_value: frameworkType
      };
      
      const { error } = await supabase
        .from('connect_screens')
        .insert(connectionData);
        
      if (error) {
        console.error("Error storing framework-to-widget connection:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error connecting framework to widget:", error);
      toast({
        title: "Error",
        description: "Failed to connect to widget",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle terminating framework connection
  const handleTerminateForFramework = async (frameworkType: string) => {
    setIsProcessing(true);
    try {
      // Find any existing connections for this framework
      const { data: existingConnections, error: fetchError } = await supabase
        .from('connect_screens')
        .select('*')
        .eq('framework_type', frameworkType);
        
      if (fetchError) {
        console.error("Error fetching framework connections:", fetchError);
        throw fetchError;
      }
      
      if (existingConnections && existingConnections.length > 0) {
        // Update connections to mark as terminated
        const { error } = await supabase
          .from('connect_screens')
          .update({ is_screen_terminated: true })
          .eq('framework_type', frameworkType);
          
        if (error) {
          console.error("Error terminating framework connections:", error);
          throw error;
        }
      } else {
        // Create a terminated connection record
        const connectionData: CreateScreenConnectionParams = {
          element_ref: null,
          screen_ref: null,
          widget_ref: widgetId || null,
          framework_type: frameworkType,
          framework_type_ref: null,
          is_screen_terminated: true,
          previous_connected_screen_ref: null,
          next_connected_screen_ref: null,
          coe_ref: null,
          connection_context: "terminated",
          source_value: frameworkType
        };
        
        const { error } = await supabase
          .from('connect_screens')
          .insert(connectionData);
          
        if (error) {
          console.error("Error creating terminated connection:", error);
          throw error;
        }
      }
      
      toast({
        title: "Connection Terminated",
        description: `Removed connection for ${frameworkType}`,
      });
    } catch (error) {
      console.error("Error terminating framework connection:", error);
      toast({
        title: "Error",
        description: "Failed to terminate connection",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    handleNewScreenForElement,
    handleExistingScreenForElement,
    handleConnectWidgetForElement,
    handleTerminateForElement,
    handleNewScreenForFramework,
    handleExistingScreenForFramework,
    handleConnectWidgetForFramework,
    handleTerminateForFramework,
    isProcessing
  };
};
