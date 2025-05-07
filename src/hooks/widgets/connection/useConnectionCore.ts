
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Screen } from "@/types/screen";
import { supabase } from "@/integrations/supabase/client";
import { ConnectionValueContext } from "@/types/connection";

/**
 * Core hook for connection management that handles state and common utilities
 */
export function useConnectionCore(widgetId?: string) {
  // Basic state for connection operations
  const [isConnecting, setIsConnecting] = useState(false);
  const [isExistingScreenDialogOpen, setIsExistingScreenDialogOpen] = useState(false);
  const [connectionContext, setConnectionContext] = useState<ConnectionValueContext | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen | null>(null);
  const { toast } = useToast();
  
  // Store connection context in session storage for component communication
  const storeConnectionContext = (ctx: ConnectionValueContext | null) => {
    if (ctx) {
      try {
        console.log("💾 Storing connection context:", ctx);
        
        // Make sure we have the current screen ID
        const currentScreenId = localStorage.getItem('current_screen_id');
        if (currentScreenId) {
          // Add screenId to context if it's not already there
          if (!ctx.screenId) {
            ctx = { ...ctx, screenId: currentScreenId };
          }
          console.log("🔍 Added current screenId to context:", currentScreenId);
        }
        
        window.sessionStorage.setItem('connectionContext', JSON.stringify(ctx));
      } catch (e) {
        console.error("Error storing connection context in session storage:", e);
      }
    } else {
      try {
        window.sessionStorage.removeItem('connectionContext');
      } catch (e) {
        console.error("Error removing connection context from session storage:", e);
      }
    }
    
    setConnectionContext(ctx);
  };
  
  // Fetch current screen data when needed
  const fetchCurrentScreen = async (screenId?: string) => {
    try {
      // Try to get screen ID from param first, then localStorage
      const currentScreenId = screenId || localStorage.getItem('current_screen_id');
      console.log("🔍 Fetching current screen with ID:", currentScreenId);
      
      if (!currentScreenId) {
        console.warn("⚠️ No current screen ID found");
        return null;
      }
      
      const { data, error } = await supabase
        .from('screens')
        .select('*')
        .eq('id', currentScreenId)
        .single();
        
      if (error) {
        console.error("❌ Error fetching current screen:", error);
        throw error;
      }
      
      if (data) {
        console.log("✅ Current screen data retrieved:", data);
        setCurrentScreen(data);
        
        // Store the screen ID in localStorage for safety
        try {
          localStorage.setItem('current_screen_id', currentScreenId);
          
          // Also store widget_id to ensure we have both pieces of information available
          if (data.widget_id) {
            localStorage.setItem('current_widget_id', data.widget_id);
          }
        } catch (e) {
          console.error("Error storing screen ID in localStorage:", e);
        }
        
        return data;
      }
      
      return null;
    } catch (error) {
      console.error("❌ Error in fetchCurrentScreen:", error);
      toast({
        title: "Error",
        description: "Failed to load current screen information",
        variant: "destructive"
      });
      return null;
    }
  };

  return {
    isConnecting,
    setIsConnecting,
    isExistingScreenDialogOpen,
    setIsExistingScreenDialogOpen,
    connectionContext,
    setConnectionContext: storeConnectionContext,
    currentScreen,
    setCurrentScreen,
    fetchCurrentScreen,
    toast
  };
}
