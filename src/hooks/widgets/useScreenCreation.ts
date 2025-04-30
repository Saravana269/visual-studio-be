
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ScreenFormData } from "@/types/screen";
import { useFrameworkTypeActions } from "./useFrameworkTypeActions";

interface UseScreenCreationProps {
  widgetId: string | undefined;
  onSuccess?: () => void;
}

export function useScreenCreation({ widgetId, onSuccess }: UseScreenCreationProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { createFrameworkType } = useFrameworkTypeActions({ onSuccess });

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

  return {
    createScreen,
    isLoading
  };
}
