
import React from "react";
import { Screen } from "@/types/screen";
import { ExistingScreenDialog } from "@/components/widgets/screens/dialogs/ExistingScreenDialog";

interface ConnectionDialogContentProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (screenId: string) => void;
  currentScreen: Screen | null;
  widgetId: string | null;
  isConnecting: boolean;
}

export const ConnectionDialogContent: React.FC<ConnectionDialogContentProps> = ({
  isOpen,
  onClose,
  onConnect,
  currentScreen,
  widgetId,
  isConnecting
}) => {
  // Only render the dialog if it's open and we have a widgetId
  if (!isOpen || !widgetId) return null;

  return (
    <ExistingScreenDialog
      isOpen={isOpen}
      onClose={onClose}
      onConnect={onConnect}
      currentScreen={currentScreen}
      widgetId={widgetId}
      isConnecting={isConnecting}
    />
  );
};
