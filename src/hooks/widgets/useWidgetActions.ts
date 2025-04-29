
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Widget, WidgetFormData } from "@/types/widget";

interface UseWidgetActionsProps {
  refetch: () => void;
}

export function useWidgetActions({ refetch }: UseWidgetActionsProps) {
  const { toast } = useToast();

  // Create a new widget
  const createWidget = async (widgetFormData: WidgetFormData) => {
    try {
      if (!widgetFormData.name) {
        toast({
          title: "Error",
          description: "Widget name is required",
          variant: "destructive"
        });
        return false;
      }

      const { error } = await supabase
        .from("widgets")
        .insert({
          name: widgetFormData.name,
          description: widgetFormData.description,
          tags: widgetFormData.tags.length > 0 ? widgetFormData.tags : null
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Widget created successfully"
      });
      
      refetch();
      return true;
    } catch (error: any) {
      toast({
        title: "Error creating widget",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  // Update an existing widget
  const updateWidget = async (widgetId: string, widgetFormData: WidgetFormData) => {
    try {
      if (!widgetId || !widgetFormData.name) {
        toast({
          title: "Error",
          description: "Widget ID and name are required",
          variant: "destructive"
        });
        return false;
      }

      const { error } = await supabase
        .from("widgets")
        .update({
          name: widgetFormData.name,
          description: widgetFormData.description,
          tags: widgetFormData.tags.length > 0 ? widgetFormData.tags : null,
          updated_at: new Date().toISOString()
        })
        .eq("id", widgetId)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Widget updated successfully"
      });
      
      refetch();
      return true;
    } catch (error: any) {
      toast({
        title: "Error updating widget",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    createWidget,
    updateWidget
  };
}
