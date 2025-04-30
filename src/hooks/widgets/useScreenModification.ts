
import { useState } from "react";
import { useScreenUpdate } from "./useScreenUpdate";
import { useScreenDelete } from "./useScreenDelete";

interface UseScreenModificationProps {
  onSuccess?: () => void;
}

export function useScreenModification({ onSuccess }: UseScreenModificationProps = {}) {
  const { updateScreen, isLoading: isUpdating } = useScreenUpdate({ onSuccess });
  const { deleteScreen, isLoading: isDeleting } = useScreenDelete({ onSuccess });
  
  // Combine loading states
  const isLoading = isUpdating || isDeleting;

  return {
    updateScreen,
    deleteScreen,
    isLoading
  };
}
