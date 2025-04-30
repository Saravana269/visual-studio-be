
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useScreenManager } from "@/hooks/widgets/useScreenManager";
import { Widget } from "@/types/widget";
import { WidgetHeader } from "@/components/widgets/screens/WidgetHeader";
import { EmptyScreensState } from "@/components/widgets/screens/EmptyScreensState";
import { ScreenContent } from "@/components/widgets/screens/ScreenContent";
import { DeleteScreenDialog } from "@/components/widgets/screens/DeleteScreenDialog";
import { ScreenCardList } from "@/components/widgets/screens/ScreenCardList";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function WidgetScreenManager() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDetailView, setIsDetailView] = useState(false);

  // Get widget details
  const { data: widget, isLoading: isLoadingWidget } = useQuery({
    queryKey: ["widget", id],
    queryFn: async () => {
      if (!id) return null;
      
      try {
        const { data, error } = await supabase
          .from("widgets")
          .select("*")
          .eq("id", id)
          .single();
        
        if (error) throw error;
        
        return data as Widget;
      } catch (error: any) {
        toast({
          title: "Error fetching widget details",
          description: error.message,
          variant: "destructive"
        });
        return null;
      }
    },
    enabled: !!id
  });

  // Get screen manager hooks with all the refactored functionality
  const {
    screens,
    isLoading: isLoadingScreens,
    isActionLoading,
    activeScreen,
    activeScreenIndex,
    goToScreen,
    formData,
    setFormData,
    handleCreateEmptyScreen,
    handleUpdateScreen,
    handleStepSave,
    handleInlineUpdate,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDeleteScreen
  } = useScreenManager(id);

  // Handle back navigation to widgets list
  const handleBackToWidgets = () => {
    navigate("/widgets");
  };
  
  // Handle back navigation to screen list
  const handleBackToScreens = () => {
    setIsDetailView(false);
  };
  
  // Handle selecting a screen to view details
  const handleScreenSelect = (screenId: string) => {
    goToScreen(screenId);
    setIsDetailView(true);
  };

  const isLoading = isLoadingWidget || isLoadingScreens;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* Header */}
      {isDetailView ? (
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={handleBackToScreens} className="p-2">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Screens
            </Button>
            
            {isLoadingWidget ? (
              <div className="h-8 w-48 bg-gray-800 animate-pulse rounded"></div>
            ) : (
              <div>
                <h1 className="text-2xl font-bold">{activeScreen?.name || "Screen Details"}</h1>
              </div>
            )}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-red-500 border-red-500 hover:bg-red-500/10"
          >
            Delete Screen
          </Button>
        </div>
      ) : (
        <WidgetHeader
          widget={widget}
          isLoading={isLoadingWidget}
          onBack={handleBackToWidgets}
          onDelete={() => {}}
          onAddScreen={handleCreateEmptyScreen}
          hasActiveScreen={false}
        />
      )}

      {/* Content */}
      {!isLoading && screens.length === 0 ? (
        <EmptyScreensState onAddScreen={handleCreateEmptyScreen} />
      ) : !isDetailView ? (
        <ScreenCardList 
          screens={screens} 
          isLoading={isLoading}
          onScreenSelect={handleScreenSelect}
          onAddScreen={handleCreateEmptyScreen}
        />
      ) : (
        <ScreenContent
          screens={screens}
          activeScreen={activeScreen}
          activeScreenIndex={activeScreenIndex}
          formData={formData}
          setFormData={setFormData}
          onScreenSelect={goToScreen}
          onAddScreen={handleCreateEmptyScreen}
          onUpdateScreen={handleUpdateScreen}
          onStepSave={handleStepSave}
          isActionLoading={isActionLoading}
        />
      )}

      {/* Delete Dialog */}
      <DeleteScreenDialog
        isOpen={isDeleteDialogOpen}
        isLoading={isActionLoading}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={handleDeleteScreen}
      />
    </div>
  );
}
