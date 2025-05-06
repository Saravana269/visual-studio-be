
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
import { Loader2 } from "lucide-react";

interface ExistingScreenDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (screenId: string) => void;
  currentScreen: Screen | null;
  widgetId: string;
  isConnecting?: boolean;
}

export function ExistingScreenDialog({
  isOpen,
  onClose,
  onConnect,
  currentScreen,
  widgetId,
  isConnecting = false
}: ExistingScreenDialogProps) {
  const [selectedScreenId, setSelectedScreenId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Use custom hooks for data fetching
  const { screens, isLoading: isLoadingScreens } = useExistingScreensQuery({ 
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
      
      // Check if currentScreen is available, if not try to fetch it
      if (!currentScreen) {
        const fetchCurrentScreen = async () => {
          const currentScreenId = localStorage.getItem('current_screen_id');
          if (currentScreenId) {
            try {
              const { data, error } = await supabase
                .from('screens')
                .select('*')
                .eq('id', currentScreenId)
                .single();
                
              if (error || !data) {
                toast({
                  title: "Warning",
                  description: "Could not load current screen information",
                  variant: "warning"
                });
              }
            } catch (e) {
              console.error("Error fetching current screen:", e);
            }
          }
        };
        
        fetchCurrentScreen();
      }
    }
  }, [isOpen, currentScreen, toast]);

  // Handle connection
  const handleConnect = async () => {
    if (selectedScreenId && currentScreen) {
      onConnect(selectedScreenId);
    } else if (!currentScreen) {
      toast({
        title: "Connection Error",
        description: "Current screen information not available",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] bg-black border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-lg">Connect to Existing Screen</DialogTitle>
        </DialogHeader>
        
        {/* Current Screen Info */}
        {!currentScreen ? (
          <div className="p-3 border border-red-500/30 rounded-md bg-red-500/10 text-center">
            <p className="text-red-400">Current screen information not available</p>
            <p className="text-xs text-gray-400 mt-1">Please try refreshing the page and try again</p>
          </div>
        ) : (
          <CurrentScreenInfo currentScreen={currentScreen} />
        )}
        
        {/* Screen Selection - Only show if current screen is available */}
        {currentScreen && (
          <div className="border border-gray-800 rounded-md p-4 mb-4 bg-black/30">
            <h3 className="text-sm font-medium text-gray-200 mb-3">Select a Screen to Connect:</h3>
            
            <ScreenSelectionList 
              screens={screens}
              isLoading={isLoadingScreens}
              selectedScreenId={selectedScreenId}
              onSelectScreen={setSelectedScreenId}
            />
          </div>
        )}
        
        {/* Preview Section */}
        {currentScreen && selectedScreenId && (
          <ScreenPreviewSection 
            selectedScreenId={selectedScreenId}
            selectedScreen={selectedScreen}
            isLoading={isLoadingSelectedScreen}
          />
        )}
        
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
            disabled={!selectedScreenId || isConnecting || !currentScreen}
            className="bg-[#00FF00] text-black hover:bg-[#00DD00]"
          >
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : "Connect"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
