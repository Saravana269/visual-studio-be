
import { createContext } from "react";
import { ConnectionValueContext } from "@/types/connection";

interface ConnectionDialogContextType {
  isExistingScreenDialogOpen: boolean;
  setIsExistingScreenDialogOpen: (isOpen: boolean) => void;
  
  selectedScreenId: string | null;
  setSelectedScreenId: (screenId: string | null) => void;
  
  connectionContext: ConnectionValueContext | null;
  setConnectionContext: (context: ConnectionValueContext | null) => void;
}

export const ConnectionDialogContext = createContext<ConnectionDialogContextType | undefined>(undefined);
