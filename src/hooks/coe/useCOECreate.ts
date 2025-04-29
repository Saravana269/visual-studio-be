
import { useState } from "react";
import type { COE } from "@/hooks/useCOEData";

export const useCOECreate = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCOE, setSelectedCOE] = useState<COE | null>(null);
  const [isCreateTagDialogOpen, setIsCreateTagDialogOpen] = useState(false);

  return {
    isCreateModalOpen,
    setIsCreateModalOpen,
    selectedCOE,
    setSelectedCOE,
    isCreateTagDialogOpen,
    setIsCreateTagDialogOpen,
  };
};
