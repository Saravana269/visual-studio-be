
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ScreenFormData } from "@/types/screen";
import { useFrameworkTypeActions } from "./useFrameworkTypeActions";

interface UseScreenActionsProps {
  widgetId: string | undefined;
  onSuccess?: () => void;
}

export function useScreenActions({ widgetId, onSuccess }: UseScreenActionsProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { createFrameworkType, updateFrameworkType } = useFrameworkTypeActions({ onSuccess });

  // Create a new screen
  const createScreen = async (screenData: ScreenFormData) => {
    if (!widgetId) {
      toast({
        title: "Error",
        description: "Widget ID is required",
        variant: "destructive"
      });
      return null;
    }

    try {
      setIsLoading(true);
      
      // Create initial screen record
      const { data, error } = await supabase
        .from("screens")
        .insert({
          name: screenData.name,
          description: screenData.description || null,
          framework_type: screenData.framework_type || null,
          widget_id: widgetId,
          metadata: screenData.metadata || null,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Create framework type record if framework_type is specified
      if (data && screenData.framework_type) {
        await createFrameworkType(
          data.id,
          screenData.framework_type,
          screenData.metadata || {}
        );
      }
      
      toast({
        title: "Success",
        description: "Screen created successfully"
      });
      
      if (onSuccess) onSuccess();
      return data;
    } catch (error: any) {
      toast({
        title: "Error creating screen",
        description: error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing screen
  const updateScreen = async (screenId: string, screenData: Partial<ScreenFormData>, createFramework: boolean = false) => {
    if (!screenId) {
      toast({
        title: "Error",
        description: "Screen ID is required",
        variant: "destructive"
      });
      return false;
    }

    try {
      setIsLoading(true);
      
      // Get current screen data to check if framework exists
      const { data: currentScreen, error: fetchError } = await supabase
        .from("screens")
        .select("*")
        .eq("id", screenId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Regular screen update
      const { error } = await supabase
        .from("screens")
        .update({
          name: screenData.name !== undefined ? screenData.name : currentScreen.name,
          description: screenData.description !== undefined ? screenData.description : currentScreen.description,
          framework_type: screenData.framework_type !== undefined ? screenData.framework_type : currentScreen.framework_type,
          metadata: screenData.metadata !== undefined ? screenData.metadata : currentScreen.metadata,
          updated_at: new Date().toISOString(),
        })
        .eq("id", screenId);
      
      if (error) throw error;
      
      // Handle framework type updates
      if (screenData.framework_type !== undefined || screenData.metadata !== undefined) {
        if (createFramework || currentScreen.framework_id) {
          const frameworkType = screenData.framework_type || currentScreen.framework_type;
          const metadata = screenData.metadata || currentScreen.metadata || {};
          
          if (currentScreen.framework_id) {
            // Update existing framework
            await updateFrameworkType(
              currentScreen.framework_id,
              frameworkType,
              metadata,
              screenId
            );
          } else if (createFramework) {
            // Create new framework
            await createFrameworkType(
              screenId,
              frameworkType,
              metadata
            );
          }
        }
      }
      
      toast({
        title: "Success",
        description: "Screen updated successfully"
      });
      
      if (onSuccess) onSuccess();
      return true;
    } catch (error: any) {
      toast({
        title: "Error updating screen",
        description: error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Create or update screen for specific step
  const updateScreenByStep = async (
    screenId: string | null,
    step: number,
    screenData: Partial<ScreenFormData>,
    createFramework: boolean = false
  ) => {
    try {
      setIsLoading(true);
      
      // Step 1: Create or update name
      if (step === 1) {
        if (!screenId) {
          // Create new screen with just name
          const { data, error } = await supabase
            .from("screens")
            .insert({
              name: screenData.name || "Untitled",
              widget_id: widgetId
            })
            .select()
            .single();
            
          if (error) throw error;
          return { success: true, screenId: data.id };
        } else {
          // Update existing screen name
          const { error } = await supabase
            .from("screens")
            .update({ name: screenData.name })
            .eq("id", screenId);
            
          if (error) throw error;
          return { success: true, screenId };
        }
      }
      
      // Step 2: Update description
      if (step === 2 && screenId) {
        const { error } = await supabase
          .from("screens")
          .update({ description: screenData.description || null })
          .eq("id", screenId);
          
        if (error) throw error;
        return { success: true, screenId };
      }
      
      // Step 3: Update framework type and create framework record
      if (step === 3 && screenId && screenData.framework_type) {
        if (createFramework) {
          // Create framework type record
          const frameworkData = await createFrameworkType(
            screenId,
            screenData.framework_type,
            screenData.metadata || {}
          );
          
          if (!frameworkData) throw new Error("Failed to create framework type");
          return { success: true, screenId, frameworkId: frameworkData.id };
        } else {
          // Just update framework type on screen
          const { error } = await supabase
            .from("screens")
            .update({ 
              framework_type: screenData.framework_type,
              metadata: screenData.metadata || null
            })
            .eq("id", screenId);
            
          if (error) throw error;
          return { success: true, screenId };
        }
      }
      
      return { success: false };
    } catch (error: any) {
      console.error("Error updating screen by step:", error);
      toast({
        title: `Error updating screen (Step ${step})`,
        description: error.message,
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a screen
  const deleteScreen = async (screenId: string) => {
    if (!screenId) {
      toast({
        title: "Error",
        description: "Screen ID is required",
        variant: "destructive"
      });
      return false;
    }

    try {
      setIsLoading(true);
      
      // First delete any associated framework types
      await supabase
        .from("framework_types")
        .delete()
        .eq("screen_id", screenId);
      
      // Then delete the screen
      const { error } = await supabase
        .from("screens")
        .delete()
        .eq("id", screenId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Screen deleted successfully"
      });
      
      if (onSuccess) onSuccess();
      return true;
    } catch (error: any) {
      toast({
        title: "Error deleting screen",
        description: error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createScreen,
    updateScreen,
    updateScreenByStep,
    deleteScreen,
    isActionLoading: isLoading
  };
}
