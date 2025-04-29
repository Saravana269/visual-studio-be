
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

export default function WidgetScreenManager() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

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
    handleInlineUpdate,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDeleteScreen
  } = useScreenManager(id);

  // Handle back navigation
  const handleBack = () => {
    navigate("/widgets");
  };

  const isLoading = isLoadingWidget || isLoadingScreens;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* Header */}
      <WidgetHeader
        widget={widget}
        isLoading={isLoadingWidget}
        onBack={handleBack}
        onDelete={() => setIsDeleteDialogOpen(true)}
        onAddScreen={handleCreateEmptyScreen}
        hasActiveScreen={!!activeScreen}
      />

      {/* Empty state */}
      {!isLoading && screens.length === 0 ? (
        <EmptyScreensState onAddScreen={handleCreateEmptyScreen} />
      ) : (
        <ScreenContent
          screens={screens}
          activeScreen={activeScreen}
          activeScreenIndex={activeScreenIndex}
          formData={formData}
          setFormData={setFormData}
          onScreenSelect={goToScreen}
          onAddScreen={handleCreateEmptyScreen}
          onUpdateScreen={handleInlineUpdate}
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
