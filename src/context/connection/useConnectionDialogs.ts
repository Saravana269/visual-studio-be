
import { useContext } from "react";
import { ConnectionDialogContext } from "./ConnectionDialogContext";
import { ConnectionValueContext } from "@/types/connection";

export const useConnectionDialogs = () => {
  const context = useContext(ConnectionDialogContext);
  
  if (!context) {
    throw new Error("useConnectionDialogs must be used within a ConnectionDialogProvider");
  }
  
  return {
    isExistingScreenDialogOpen: context.isExistingScreenDialogOpen,
    selectedScreenId: context.selectedScreenId,
    connectionContext: context.connectionContext,
    
    openExistingScreenDialog: (connectionValueContext: ConnectionValueContext) => {
      context.setConnectionContext(connectionValueContext);
      context.setIsExistingScreenDialogOpen(true);
    },
    
    closeExistingScreenDialog: () => {
      context.setIsExistingScreenDialogOpen(false);
    },
    
    handleExistingScreenConnect: (screenId: string) => {
      context.setSelectedScreenId(screenId);
    }
  };
};
