
import React, { useState, useEffect } from "react";
import { Screen } from "@/types/screen";
import { useExistingScreensQuery } from "@/hooks/widgets/useExistingScreensQuery";
import { ScreenSelectionList } from "@/components/widgets/screens/dialogs/components/ScreenSelectionList";
import { ScreenPreviewSection } from "@/components/widgets/screens/dialogs/components/ScreenPreviewSection";
import { Button } from "@/components/ui/button";
import { useSelectedScreenQuery } from "@/hooks/widgets/useSelectedScreenQuery";
import { CurrentScreenInfo } from "../dialogs/components/CurrentScreenInfo";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ChooseScreenPanelProps {
  currentScreen: Screen | null;
  widgetId: string | undefined;
  onScreenSelect: (screenId: string) => void;
  onClose: () => void;
  isConnectionMode?: boolean;
}

export function ChooseScreenPanel({
  currentScreen,
  widgetId,
  onScreenSelect,
  onClose,
  isConnectionMode = false
}: ChooseScreenPanelProps) {
  const [selectedScreenId, setSelectedScreenId] = useState<string | null>(null);
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

  // Use custom hooks for data fetching
  const { screens, isLoading } = useExistingScreensQuery({ 
    widgetId: widgetId || '', 
    currentScreenId: currentScreen?.id || null,
    enabled: !!widgetId
  });
  
  const { selectedScreen, isLoading: isLoadingSelectedScreen } = useSelectedScreenQuery({
    screenId: selectedScreenId
  });

  // Handle connect button click
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
        
        // Get the selected option or combination from localStorage
        const selectedOption = localStorage.getItem('selected_option_value');
        const selectedCombination = localStorage.getItem('selected_combination_value');
        
        // Initialize property values
        let propertyValues: Record<string, any> = frameworkData?.property_values || {};
        
        // Add the selected option or combination if it exists
        if (selectedOption) {
          propertyValues.selectedOption = selectedOption;
        }
        
        if (selectedCombination) {
          propertyValues.selectedOptions = selectedCombination.split(', ');
          propertyValues.combinationString = selectedCombination;
        }
        
        // Ensure we have a source_value
        const sourceValue = selectedOption || selectedCombination || "connection";
        
        // Prepare connection data
        const connectionData = {
          nextScreen_Ref: selectedScreenId,
          framework_type: currentScreen.framework_type,
          widget_ref: currentScreen.widget_id,
          screen_ref: currentScreen.id,
          screen_name: currentScreen.name,
          screen_description: currentScreen.description,
          property_values: propertyValues,
          framework_type_ref: currentScreen.framework_id,
          source_value: sourceValue
        };
        
        console.log("Inserting connection data:", connectionData);
        
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
        
        // Dispatch event to notify that connection was established
        const connectionEvent = new CustomEvent('connectionEstablished', { 
          detail: { screenId: selectedScreenId } 
        });
        window.dispatchEvent(connectionEvent);
        
        // Clear localStorage
        localStorage.removeItem('selected_option_value');
        localStorage.removeItem('selected_combination_value');
        
        // Call the onScreenSelect callback
        onScreenSelect(selectedScreenId);
        
        // Close the panel
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

  // Clear selection when the panel opens
  useEffect(() => {
    setSelectedScreenId(null);
  }, [isConnectionMode]);

  return (
    <div className="flex flex-col h-full border border-gray-800 rounded-lg overflow-hidden">
      {/* Fixed header */}
      <div className="bg-[#00FF00] p-4 border-b border-[#00FF00]/30">
        <h2 className="text-black text-lg font-medium">
          {isConnectionMode ? "Choose Existing Screen to Connect" : "Choose Screen"}
        </h2>
      </div>
      
      {/* Scrollable content area */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-4">
          {/* Current Screen */}
          <div className="border border-gray-800 rounded-md p-4 bg-black/30">
            <h3 className="text-sm font-medium text-gray-200 mb-3">Current Screen:</h3>
            <CurrentScreenInfo currentScreen={currentScreen} />
          </div>
          
          {/* Screen Selection */}
          <div className="border border-gray-800 rounded-md p-4 bg-black/30">
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
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-800">
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
          </div>
        </div>
      </div>
    </div>
  );
}
