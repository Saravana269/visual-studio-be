
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ScreenFormData } from "@/types/screen";

interface UseScreenActionsProps {
  widgetId: string | undefined;
  onSuccess?: () => void;
}

export function useScreenActions({ widgetId, onSuccess }: UseScreenActionsProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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
  const updateScreen = async (screenId: string, screenData: Partial<ScreenFormData>) => {
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
      
      const { error } = await supabase
        .from("screens")
        .update({
          name: screenData.name,
          description: screenData.description,
          framework_type: screenData.framework_type,
          metadata: screenData.metadata,
          updated_at: new Date().toISOString(),
        })
        .eq("id", screenId);
      
      if (error) throw error;
      
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
