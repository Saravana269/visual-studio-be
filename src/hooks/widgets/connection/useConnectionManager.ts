
import { useState, useEffect } from "react";
import { useConnectionOperations } from "./useConnectionOperations";
import { useConnectionUIState } from "./useConnectionUIState";
import { supabase } from "@/integrations/supabase/client";
import { Screen } from "@/types/screen";

/**
 * Hook that manages screen connections
 */
export function useConnectionManager(widgetId?: string) {
  // Get connection UI state
  const {
    isExistingScreenDialogOpen,
    setIsExistingScreenDialogOpen,
    connectionContext,
    setConnectionContext,
    currentScreen,
    setCurrentScreen
  } = useConnectionUIState();
  
  // Get connection operations
  const {
    handleExistingScreenConnect,
    isConnecting
  } = useConnectionOperations(widgetId);
  
  // State for tracking if a given option has been connected
  const [connectedOptions, setConnectedOptions] = useState<Record<string, boolean>>({});
  
  // Handle connecting a value to a screen
  const handleConnect = async (value: any, context?: string) => {
    console.log("🔄 handleConnect called with value:", value, "context:", context);
    
    // Store the connection context in session storage
    try {
      // Extract the actual value object if it's wrapped
      const connectionValue = typeof value === 'object' && value !== null && value.value !== undefined
        ? value.value
        : value;
      
      // Create connection context
      const connectionContextObj = {
        value: value,
        context: context || "default",
        widgetId
      };
      
      // Store in session for later use
      window.sessionStorage.setItem('connectionContext', JSON.stringify(connectionContextObj));
      console.log("💾 Stored connection context in session storage:", connectionContextObj);
      
      setConnectionContext(connectionContextObj);
      
      // Determine current screen ID
      const currentScreenId = localStorage.getItem('current_screen_id');
      if (currentScreenId && !currentScreen) {
        fetchCurrentScreen(currentScreenId);
      }
      
      // Open the existing screen dialog after a small delay to ensure context is saved
      setTimeout(() => {
        setIsExistingScreenDialogOpen(true);
      }, 100);
    } catch (e) {
      console.error("Error storing connection context:", e);
    }
  };
  
  // Function to fetch current screen details
  const fetchCurrentScreen = async (screenId: string): Promise<Screen | null> => {
    if (!screenId) return null;
    
    try {
      const { data, error } = await supabase
        .from('screens')
        .select('*')
        .eq('id', screenId)
        .single();
      
      if (error || !data) {
        console.error("Error fetching screen:", error);
        return null;
      }
      
      setCurrentScreen(data);
      return data as Screen;
    } catch (e) {
      console.error("Error in fetchCurrentScreen:", e);
      return null;
    }
  };
  
  // Listen for connection established events to hide connect buttons
  useEffect(() => {
    const handleConnectionEstablished = (event: CustomEvent) => {
      console.log("✅ Connection established event received");
      
      // Close the dialog
      setIsExistingScreenDialogOpen(false);
      
      // Update the list of connected options
      const { value, context } = connectionContext || {};
      
      if (value) {
        // Extract the key to mark as connected
        const optionKey = Array.isArray(value) ? 
          JSON.stringify(value) : 
          typeof value === 'object' && value !== null ? 
            JSON.stringify(value.value || value) : 
            String(value);
        
        // Mark this option as connected
        setConnectedOptions(prev => ({
          ...prev,
          [optionKey]: true
        }));
      }
    };
    
    // Add event listener
    window.addEventListener('connectionEstablished', handleConnectionEstablished as EventListener);
    
    return () => {
      // Remove event listener
      window.removeEventListener('connectionEstablished', handleConnectionEstablished as EventListener);
    };
  }, [connectionContext, setIsExistingScreenDialogOpen]);

  return {
    handleConnect,
    isConnecting,
    isExistingScreenDialogOpen,
    setIsExistingScreenDialogOpen,
    currentScreen,
    handleExistingScreenConnect,
    fetchCurrentScreen,
    connectedOptions
  };
}
