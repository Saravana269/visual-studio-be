
import { useState } from "react";
import { ScreenFormData } from "@/types/screen";
import { useScreenActions } from "./useScreenActions";
import { useToast } from "@/hooks/use-toast";

interface UseScreenCreationProps {
  widgetId: string | undefined;
  refetch: () => Promise<any>;
  goToScreenByIndex: (index: number) => void;
}

export function useScreenCreation({
  widgetId,
  refetch,
  goToScreenByIndex
}: UseScreenCreationProps) {
  const { createScreen } = useScreenActions({
    widgetId,
    onSuccess: refetch
  });
  
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // Handle creating a new empty screen directly
  const handleCreateEmptyScreen = async () => {
    setIsCreating(true);
    
    try {
      const emptyScreenData = {
        name: "Untitled",
        description: "",
        framework_type: "Multiple Options",
      };
      
      const result = await createScreen(emptyScreenData);
      if (result) {
        // Refetch screens and navigate to the newly created screen
        const updatedData = await refetch();
        if (updatedData?.length > 0) {
          goToScreenByIndex(updatedData.length - 1);
        }
      }
    } catch (error) {
      console.error("Error creating empty screen:", error);
      toast({
        title: "Error",
        description: "Failed to create a new screen",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return {
    handleCreateEmptyScreen,
    isCreating
  };
}
