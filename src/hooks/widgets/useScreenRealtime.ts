
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Screen } from "@/types/screen";
import { useToast } from "@/hooks/use-toast";

interface UseScreenRealtimeProps {
  widgetId?: string;
  enabled?: boolean;
}

/**
 * Hook to subscribe to real-time updates for screens
 */
export function useScreenRealtime({ widgetId, enabled = true }: UseScreenRealtimeProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    // Only set up the subscription if enabled and widgetId is provided
    if (!enabled || !widgetId) return;

    console.log("Setting up real-time subscription for screens with widget_id:", widgetId);

    // Create a channel for the screens table
    const channel = supabase
      .channel("db-screens-changes")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "screens",
          filter: `widget_id=eq.${widgetId}` // Only listen to events for this widget
        },
        (payload) => {
          console.log("Real-time update received:", payload);

          // Handle the different event types
          if (payload.eventType === "INSERT") {
            // Invalidate the screens query to fetch new data
            queryClient.invalidateQueries({ queryKey: ["widget-screens", widgetId] });
            
            toast({
              title: "New screen created",
              description: "A new screen has been added to this widget.",
              variant: "default"
            });
          } 
          else if (payload.eventType === "UPDATE") {
            // Extract the updated screen data
            const updatedScreen = payload.new as Screen;
            
            // Update the screen in the cache
            queryClient.setQueryData(
              ["widget-screens", widgetId],
              (oldData: Screen[] | undefined) => {
                if (!oldData) return [updatedScreen];
                
                return oldData.map((screen) => 
                  screen.id === updatedScreen.id ? updatedScreen : screen
                );
              }
            );
            
            // Also invalidate the query to ensure data consistency
            queryClient.invalidateQueries({ queryKey: ["widget-screens", widgetId] });
            
            // Only show toast if framework_type or metadata changed
            if (
              payload.old.framework_type !== payload.new.framework_type || 
              JSON.stringify(payload.old.metadata) !== JSON.stringify(payload.new.metadata)
            ) {
              toast({
                title: "Screen updated",
                description: `"${updatedScreen.name}" has been updated.`,
                variant: "default"
              });
            }
          } 
          else if (payload.eventType === "DELETE") {
            // Extract the deleted screen data
            const deletedScreen = payload.old as Screen;
            
            // Update the cache by removing the deleted screen
            queryClient.setQueryData(
              ["widget-screens", widgetId],
              (oldData: Screen[] | undefined) => {
                if (!oldData) return [];
                return oldData.filter((screen) => screen.id !== deletedScreen.id);
              }
            );
            
            // Also invalidate the query to ensure data consistency
            queryClient.invalidateQueries({ queryKey: ["widget-screens", widgetId] });
            
            toast({
              title: "Screen deleted",
              description: "A screen has been deleted from this widget.",
              variant: "default"
            });
          }
        }
      )
      .subscribe();

    // Clean up the subscription when the component unmounts
    return () => {
      console.log("Cleaning up real-time subscription for screens");
      supabase.removeChannel(channel);
    };
  }, [widgetId, enabled, queryClient, toast]);
}
