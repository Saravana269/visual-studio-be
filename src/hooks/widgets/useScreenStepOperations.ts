
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ScreenFormData } from "@/types/screen";
import { useFrameworkTypeActions } from "./useFrameworkTypeActions";

interface UseScreenStepOperationsProps {
  widgetId: string | undefined;
  onSuccess?: () => void;
}

export function useScreenStepOperations({ widgetId, onSuccess }: UseScreenStepOperationsProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { createFrameworkType, updateFrameworkType, getFrameworkTypeByScreenId } = useFrameworkTypeActions({ onSuccess });

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
      
      // Step 3: Update framework type and create/update framework record
      if (step === 3 && screenId && screenData.framework_type) {
        // First, get the current screen details to check for existing framework_id
        const { data: screenDetails, error: screenError } = await supabase
          .from("screens")
          .select("framework_id")
          .eq("id", screenId)
          .maybeSingle();
          
        if (screenError) throw screenError;
        
        if (createFramework) {
          if (screenDetails?.framework_id) {
            // If framework already exists, update it
            const success = await updateFrameworkType(
              screenDetails.framework_id,
              screenData.framework_type,
              screenData.metadata || {},
              screenId
            );
            
            if (!success) throw new Error("Failed to update framework type");
            
            // Also update the screen metadata
            const { error: updateError } = await supabase
              .from("screens")
              .update({ 
                framework_type: screenData.framework_type,
                metadata: screenData.metadata || null,
                updated_at: new Date().toISOString()
              })
              .eq("id", screenId);
              
            if (updateError) throw updateError;
            
            return { success: true, screenId, frameworkId: screenDetails.framework_id };
          } else {
            // Create new framework type record if none exists
            const frameworkData = await createFrameworkType(
              screenId,
              screenData.framework_type,
              screenData.metadata || {}
            );
            
            if (!frameworkData) throw new Error("Failed to create framework type");
            return { success: true, screenId, frameworkId: frameworkData.id };
          }
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

  return {
    updateScreenByStep,
    isStepLoading: isLoading
  };
}
