
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

// Utility function for removing connections
export const useConnectionRemoval = () => {
  const { toast } = useToast();
  const [isRemoving, setIsRemoving] = useState(false);
  
  const removeConnection = async (connectionId: string, onSuccess?: () => Promise<void>) => {
    setIsRemoving(true);
    try {
      // Update the connection to mark it as terminated
      const { error } = await supabase
        .from('connect_screens')
        .update({ is_screen_terminated: true })
        .eq('id', connectionId);
        
      if (error) {
        console.error("Error removing connection:", error);
        toast({
          title: "Error",
          description: "Failed to remove connection",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Connection Removed",
        description: "The connection has been terminated",
      });
      
      // Call the onSuccess callback if provided
      if (onSuccess) {
        await onSuccess();
      }
    } catch (error) {
      console.error("Error removing connection:", error);
      toast({
        title: "Error",
        description: "Failed to remove connection",
        variant: "destructive"
      });
    } finally {
      setIsRemoving(false);
    }
  };
  
  return {
    removeConnection,
    isRemoving
  };
};
