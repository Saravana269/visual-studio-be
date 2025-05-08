
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { ActiveConnections } from "./ActiveConnections";
import { useScreenConnections } from "@/hooks/widgets/connection/useScreenConnections";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ChooseScreenPanel } from "../choose/ChooseScreenPanel";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Screen } from "@/types/screen";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export interface ConnectionsPanelProps {
  screenId: string;
}

export function ConnectionsPanel({ screenId }: ConnectionsPanelProps) {
  const [showChooseScreen, setShowChooseScreen] = useState(false);
  const [selectedScreenId, setSelectedScreenId] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Fetch current screen information
  const { data: currentScreen, isLoading: isLoadingCurrentScreen } = useQuery({
    queryKey: ["screen", screenId],
    queryFn: async () => {
      if (!screenId) return null;
      const { data, error } = await supabase
        .from("screens")
        .select("*")
        .eq("id", screenId)
        .single();
      
      if (error) throw error;
      return data as Screen;
    },
    enabled: !!screenId
  });

  // Get connections data
  const { connections, isLoading, refetchConnections } = useScreenConnections({
    screenId,
    enabled: !!screenId && !showChooseScreen,
  });

  // Handle panel navigation
  const handleShowChooseScreen = () => {
    setShowChooseScreen(true);
  };

  const handleBackToConnections = () => {
    setShowChooseScreen(false);
  };

  // Handle screen selection
  const handleScreenSelect = (screenId: string) => {
    setSelectedScreenId(screenId);
    refetchConnections();
    setShowChooseScreen(false);
    
    toast({
      title: "Screen Connected",
      description: "Connection established successfully",
    });
  };

  return (
    <div className="flex flex-col h-full border border-gray-800 rounded-lg overflow-hidden">
      {showChooseScreen ? (
        // Choose Existing Screen Panel
        <ChooseScreenPanel
          currentScreen={currentScreen || null}
          widgetId={currentScreen?.widget_id}
          onScreenSelect={handleScreenSelect}
          onClose={handleBackToConnections}
          isConnectionMode={true}
        />
      ) : (
        // Regular Connections Panel
        <>
          <div className="bg-[#00FF00] p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-black font-medium text-lg">Screen Connections</h2>
              <Button 
                onClick={handleShowChooseScreen}
                className="bg-black/20 hover:bg-black/30 text-black"
                size="sm"
              >
                Connect Screen
              </Button>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-auto">
            <Card className="border-gray-700 bg-black/20">
              <ActiveConnections
                screenId={screenId}
                refetch={refetchConnections}
                isLoading={isLoading}
              />
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
