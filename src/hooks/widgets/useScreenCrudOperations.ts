
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ScreenFormData } from "@/types/screen";
import { useFrameworkTypeActions } from "./useFrameworkTypeActions";

interface UseScreenCrudOperationsProps {
  widgetId: string | undefined;
  onSuccess?: () => void;
}

export function useScreenCrudOperations({ widgetId, onSuccess }: UseScreenCrudOperationsProps) {
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
    deleteScreen,
    isLoading
  };
}
