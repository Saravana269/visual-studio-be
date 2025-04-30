
import { useState } from "react";
import { useScreenActions } from "./useScreenActions";
import { useToast } from "@/hooks/use-toast";

interface UseScreenDeletionProps {
  widgetId: string | undefined;
  refetch: () => Promise<any>;
  goToScreenByIndex: (index: number) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
}

export function useScreenDeletion({
  widgetId,
  refetch,
  goToScreenByIndex,
  setIsDeleteDialogOpen
}: UseScreenDeletionProps) {
  const { deleteScreen } = useScreenActions({
    widgetId,
    onSuccess: refetch
  });
  
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Handle deleting a screen
  const handleDeleteScreen = async (activeScreenId: string | null, screens: any[], activeScreenIndex: number) => {
    if (!activeScreenId) return;
    
    setIsDeleting(true);
    
    try {
      const success = await deleteScreen(activeScreenId);
      if (success) {
        setIsDeleteDialogOpen(false);
        await refetch();
        // Navigate to previous or first screen
        if (screens.length > 0) {
          if (activeScreenIndex > 0) {
            goToScreenByIndex(activeScreenIndex - 1);
          } else {
            goToScreenByIndex(0);
          }
        }
      }
    } catch (error) {
      console.error("Error deleting screen:", error);
      toast({
        title: "Error",
        description: "Failed to delete the screen",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  return {
    handleDeleteScreen,
    isDeleting
  };
}
