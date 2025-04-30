
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ScreenFormData } from "@/types/screen";
import { useScreenCrudOperations } from "./useScreenCrudOperations";
import { useScreenStepOperations } from "./useScreenStepOperations";

interface UseScreenActionsProps {
  widgetId: string | undefined;
  onSuccess?: () => void;
}

export function useScreenActions({ widgetId, onSuccess }: UseScreenActionsProps) {
  const [isActionLoading, setIsActionLoading] = useState(false);
  
  // Get screen operations
  const { createScreen, updateScreen, deleteScreen, isLoading: isCrudLoading } = useScreenCrudOperations({ 
    widgetId, 
    onSuccess 
  });
  
  const { updateScreenByStep, isStepLoading } = useScreenStepOperations({
    widgetId,
    onSuccess
  });

  // Combine loading states
  const isLoading = isActionLoading || isCrudLoading || isStepLoading;

  return {
    createScreen,
    updateScreen,
    updateScreenByStep,
    deleteScreen,
    isActionLoading: isLoading
  };
}
