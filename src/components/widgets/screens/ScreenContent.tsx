
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScreenDefinePanel } from "./ScreenDefinePanel";
import { ScreenReviewPanel } from "./ScreenReviewPanel";
import { ConnectionsPanel } from "./connections/ConnectionsPanel";
import { ScreenFormData, Screen } from "@/types/screen";
import { useOptionConnections } from "@/hooks/widgets/connection/useOptionConnections";

interface ScreenContentProps {
  screens: Screen[];
  activeScreen: Screen | null;
  activeScreenIndex: number;
  formData: ScreenFormData;
  setFormData: React.Dispatch<React.SetStateAction<ScreenFormData>>;
  onScreenSelect: (screenId: string) => void;
  onAddScreen: () => void;
  onUpdateScreen: (data: ScreenFormData) => void;
  onStepSave: (step: number, data: Partial<ScreenFormData>, createFramework?: boolean) => Promise<boolean>;
  isActionLoading: boolean;
}

export function ScreenContent({
  screens,
  activeScreen,
  activeScreenIndex,
  formData,
  setFormData,
  onScreenSelect,
  onAddScreen,
  onUpdateScreen,
  onStepSave,
  isActionLoading
}: ScreenContentProps) {
  const [activeTab, setActiveTab] = useState("define");
  const { clearSelectedValues } = useOptionConnections();

  // Clear selected values when changing tabs
  const handleTabChange = (tab: string) => {
    clearSelectedValues();
    setActiveTab(tab);
  };

  // Clear selections when activeScreen changes
  useEffect(() => {
    clearSelectedValues();
  }, [activeScreen]);

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="mt-6 h-full flex flex-col"
    >
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="define">Define</TabsTrigger>
        <TabsTrigger value="review">Review</TabsTrigger>
        <TabsTrigger value="connections">Connections</TabsTrigger>
      </TabsList>

      <div className="flex-1 flex-col flex">
        <TabsContent value="define" className="flex-1 mt-0 border-none p-0 flex flex-col">
          <ScreenDefinePanel
            totalSteps={4}
            currentStep={1}
            formData={formData}
            setFormData={setFormData}
            onSave={onUpdateScreen}
            onStepSave={onStepSave}
            isEditing={!!activeScreen}
            isLoading={isActionLoading}
            autosave={false}
            screenId={activeScreen?.id}
          />
        </TabsContent>

        <TabsContent value="review" className="flex-1 mt-0 border-none p-0 flex flex-col">
          <ScreenReviewPanel 
            screen={activeScreen} 
            onShowConnections={() => handleTabChange("connections")}
          />
        </TabsContent>

        <TabsContent value="connections" className="flex-1 mt-0 border-none p-0 flex flex-col">
          <ConnectionsPanel 
            screen={activeScreen} 
          />
        </TabsContent>
      </div>
    </Tabs>
  );
}
