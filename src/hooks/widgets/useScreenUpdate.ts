
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ScreenFormData } from "@/types/screen";
import { useFrameworkTypeActions } from "./useFrameworkTypeActions";

interface UseScreenUpdateProps {
  onSuccess?: () => void;
}

export function useScreenUpdate({ onSuccess }: UseScreenUpdateProps = {}) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { createFrameworkType, updateFrameworkType } = useFrameworkTypeActions({ onSuccess });

  // Update an existing screen
  const updateScreen = async (screenId: string, screenData: Partial<ScreenFormData>, createFramework: boolean = false): Promise<boolean> => {
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

  return {
    updateScreen,
    isLoading
  };
}
