
import { useScreenCreation } from "./useScreenCreation";
import { useScreenModification } from "./useScreenModification";

interface UseScreenCrudOperationsProps {
  widgetId: string | undefined;
  onSuccess?: () => void;
}

export function useScreenCrudOperations({ widgetId, onSuccess }: UseScreenCrudOperationsProps) {
  const { createScreen, isLoading: isCreating } = useScreenCreation({ 
    widgetId, 
    onSuccess 
  });
  
  const { updateScreen, deleteScreen, isLoading: isModifying } = useScreenModification({ 
    onSuccess 
  });

  // Combine loading states
  const isLoading = isCreating || isModifying;

  return {
    createScreen,
    updateScreen,
    deleteScreen,
    isLoading
  };
}
