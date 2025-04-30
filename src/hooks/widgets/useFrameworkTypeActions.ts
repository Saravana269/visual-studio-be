
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseFrameworkTypeActionsProps {
  onSuccess?: () => void;
}

export function useFrameworkTypeActions({ onSuccess }: UseFrameworkTypeActionsProps = {}) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Create a new framework type record
  const createFrameworkType = async (screenId: string, frameworkType: string, propertyValues: Record<string, any> = {}) => {
    if (!screenId) {
      toast({
        title: "Error",
        description: "Screen ID is required",
        variant: "destructive"
      });
      return null;
    }

    try {
      setIsLoading(true);
      
      // Create the framework type record
      const { data, error } = await supabase
        .from("framework_types")
        .insert({
          screen_id: screenId,
          framework_Type: frameworkType, // Note: This matches the actual column name in the DB
          property_values: propertyValues,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Update the screen with the framework type and framework id
      const { error: updateError } = await supabase
        .from("screens")
        .update({
          framework_type: frameworkType,
          framework_id: data.id,
          updated_at: new Date().toISOString()
        })
        .eq("id", screenId);
      
      if (updateError) throw updateError;
      
      if (onSuccess) onSuccess();
      return data;
    } catch (error: any) {
      toast({
        title: "Error creating framework type",
        description: error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing framework type
  const updateFrameworkType = async (
    frameworkId: string, 
    frameworkType: string, 
    propertyValues: Record<string, any> = {},
    screenId?: string
  ) => {
    if (!frameworkId) {
      toast({
        title: "Error",
        description: "Framework ID is required",
        variant: "destructive"
      });
      return false;
    }

    try {
      setIsLoading(true);
      
      // Update the framework type record
      const { error } = await supabase
        .from("framework_types")
        .update({
          framework_Type: frameworkType,
          property_values: propertyValues,
          updated_at: new Date().toISOString()
        })
        .eq("id", frameworkId);
      
      if (error) throw error;
      
      // If a screen ID is provided, update the screen's framework type
      if (screenId) {
        const { error: updateError } = await supabase
          .from("screens")
          .update({
            framework_type: frameworkType,
            updated_at: new Date().toISOString()
          })
          .eq("id", screenId);
        
        if (updateError) throw updateError;
      }
      
      if (onSuccess) onSuccess();
      return true;
    } catch (error: any) {
      toast({
        title: "Error updating framework type",
        description: error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Get framework type by screen ID
  const getFrameworkTypeByScreenId = async (screenId: string) => {
    if (!screenId) return null;
    
    try {
      const { data, error } = await supabase
        .from("framework_types")
        .select("*")
        .eq("screen_id", screenId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error("Error fetching framework type:", error.message);
      return null;
    }
  };

  return {
    createFrameworkType,
    updateFrameworkType,
    getFrameworkTypeByScreenId,
    isLoading
  };
}
