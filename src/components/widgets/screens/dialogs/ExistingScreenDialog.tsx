
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Screen } from "@/types/screen";
import { CurrentScreenInfo } from "./components/CurrentScreenInfo";
import { ScreenSelectionList } from "./components/ScreenSelectionList";
import { ScreenPreviewSection } from "./components/ScreenPreviewSection";
import { useExistingScreensQuery } from "@/hooks/widgets/useExistingScreensQuery";
import { useSelectedScreenQuery } from "@/hooks/widgets/useSelectedScreenQuery";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ExistingScreenDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (screenId: string) => void;
  currentScreen: Screen | null;
  widgetId: string;
}

export function ExistingScreenDialog({
  isOpen,
  onClose,
  onConnect,
  currentScreen,
  widgetId
}: ExistingScreenDialogProps) {
  const [selectedScreenId, setSelectedScreenId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  // Use custom hooks for data fetching
  const { screens, isLoading } = useExistingScreensQuery({ 
    widgetId, 
    currentScreenId: currentScreen?.id || null,
    enabled: isOpen
  });
  
  const { selectedScreen, isLoading: isLoadingSelectedScreen } = useSelectedScreenQuery({
    screenId: selectedScreenId
  });
  
  // Reset selection when dialog opens
  useEffect(() => {
    if (isOpen) {
      setSelectedScreenId(null);
    }
  }, [isOpen]);

  // Handle connection
  const handleConnect = async () => {
    if (selectedScreenId && currentScreen) {
      setIsConnecting(true);
      try {
        // Get the framework type data to retrieve property values
        const { data: frameworkData } = await supabase
          .from('framework_types')
          .select('property_values, framework_Type')
          .eq('screen_id', currentScreen.id)
          .single();
        
        // Get connection context from session storage if available
        let connectionContext: any = null;
        let sourceValue: any = null;
        
        try {
          const rawContext = window.sessionStorage.getItem('connectionContext');
          if (rawContext) {
            const parsedContext = JSON.parse(rawContext);
            connectionContext = parsedContext.context || null;
            sourceValue = parsedContext.value || null;
          }
        } catch (e) {
          console.error("Error parsing connection context:", e);
        }
        
        // Prepare connection data
        const connectionData = {
          nextScreen_Ref: selectedScreenId,
          framework_type: currentScreen.framework_type,
          widget_ref: currentScreen.widget_id,
          screen_ref: currentScreen.id,
          screen_name: currentScreen.name,
          screen_description: currentScreen.description,
          property_values: frameworkData?.property_values || {},
          framework_type_ref: currentScreen.framework_id,
          connection_context: connectionContext,
          source_value: sourceValue ? String(sourceValue) : null
        };
        
        // Insert the connection data into connect_screens table
        const { error } = await supabase
          .from('connect_screens')
          .insert(connectionData);
          
        if (error) {
          throw new Error(`Failed to create connection: ${error.message}`);
        }
        
        toast({
          title: "Connection created",
          description: "Screen connection has been successfully created",
        });
        
        // Call the onConnect callback and close the dialog
        onConnect(selectedScreenId);
        onClose();
      } catch (error) {
        console.error("Error creating connection:", error);
        toast({
          title: "Connection failed",
          description: error instanceof Error ? error.message : "An unknown error occurred",
          variant: "destructive"
        });
      } finally {
        setIsConnecting(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] bg-black border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-lg">Connect to Existing Screen</DialogTitle>
        </DialogHeader>
        
        {/* Current Screen Info */}
        <CurrentScreenInfo currentScreen={currentScreen} />
        
        {/* Screen Selection */}
        <div className="border border-gray-800 rounded-md p-4 mb-4 bg-black/30">
          <h3 className="text-sm font-medium text-gray-200 mb-3">Select a Screen to Connect:</h3>
          
          <ScreenSelectionList 
            screens={screens}
            isLoading={isLoading}
            selectedScreenId={selectedScreenId}
            onSelectScreen={setSelectedScreenId}
          />
        </div>
        
        {/* Preview Section */}
        <ScreenPreviewSection 
          selectedScreenId={selectedScreenId}
          selectedScreen={selectedScreen}
          isLoading={isLoadingSelectedScreen}
        />
        
        <DialogFooter className="mt-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-gray-700"
            disabled={isConnecting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConnect}
            disabled={!selectedScreenId || isConnecting}
            className="bg-[#00FF00] text-black hover:bg-[#00DD00]"
          >
            {isConnecting ? "Connecting..." : "Connect"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
