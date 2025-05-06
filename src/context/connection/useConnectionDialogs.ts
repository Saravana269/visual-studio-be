
import { useContext } from "react";
import { ConnectionDialogContext } from "./ConnectionDialogContext";

// Custom hook to use the connection dialog context
export const useConnectionDialogs = () => {
  const context = useContext(ConnectionDialogContext);
  if (context === undefined) {
    throw new Error('useConnectionDialogs must be used within a ConnectionDialogProvider');
  }
  return context;
};
