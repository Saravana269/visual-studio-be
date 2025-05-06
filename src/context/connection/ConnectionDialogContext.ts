
import { createContext } from "react";
import { Screen } from "@/types/screen";

// Define the context type
export interface ConnectionDialogContextType {
  isExistingScreenDialogOpen: boolean;
  openExistingScreenDialog: (value: any, context?: string, widgetId?: string) => void;
  closeExistingScreenDialog: () => void;
  handleExistingScreenConnect: (selectedScreenId: string) => void;
}

// Create the context with a default value
export const ConnectionDialogContext = createContext<ConnectionDialogContextType | undefined>(undefined);
