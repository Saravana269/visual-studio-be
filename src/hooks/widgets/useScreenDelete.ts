
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseScreenDeleteProps {
  onSuccess?: () => void;
}

export function useScreenDelete({ onSuccess }: UseScreenDeleteProps = {}) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Delete a screen
  const deleteScreen = async (screenId: string): Promise<boolean> => {
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
    deleteScreen,
    isLoading
  };
}
