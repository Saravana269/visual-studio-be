
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useScreenManager } from "@/hooks/widgets/useScreenManager";
import { ScreenReviewPanel } from "@/components/widgets/screens/ScreenReviewPanel";
import { ScreenDefinePanel } from "@/components/widgets/screens/ScreenDefinePanel";
import { ScreenCarouselNav } from "@/components/widgets/screens/ScreenCarouselNav";
import { Widget } from "@/types/widget";
import { Skeleton } from "@/components/ui/skeleton";

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

  // Get screen manager hooks
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

  // Set default screen when screens load or change
  useEffect(() => {
    if (!isLoadingScreens && screens.length > 0 && !activeScreen) {
      goToScreen(screens[0].id);
    }
  }, [isLoadingScreens, screens, activeScreen, goToScreen]);

  const isLoading = isLoadingWidget || isLoadingScreens;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={handleBack} className="p-2">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Widgets
          </Button>
          
          {isLoadingWidget ? (
            <Skeleton className="h-8 w-48" />
          ) : (
            <div>
              <h1 className="text-2xl font-bold">{widget?.name}</h1>
              {widget?.description && (
                <p className="text-sm text-gray-400">{widget.description}</p>
              )}
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          {activeScreen && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="text-red-500 border-red-500 hover:bg-red-500/10"
            >
              <Trash2 size={16} className="mr-2" />
              Delete Screen
            </Button>
          )}
          <Button
            onClick={handleCreateEmptyScreen}
            className="bg-[#9b87f5] hover:bg-[#7E69AB]"
          >
            <Plus size={16} className="mr-2" />
            Add Screen
          </Button>
        </div>
      </div>

      {/* Empty state */}
      {!isLoading && screens.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-xl font-semibold mb-2">No Screens Found</h2>
            <p className="text-gray-400 mb-6">
              No screens have been added to this widget yet. Get started by creating your first screen.
            </p>
            <Button
              onClick={handleCreateEmptyScreen}
              className="bg-[#9b87f5] hover:bg-[#7E69AB]"
            >
              <Plus size={16} className="mr-2" />
              Create First Screen
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Main content */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-0">
            {/* Left panel */}
            <div className="lg:col-span-2 h-full">
              <ScreenReviewPanel screen={activeScreen} />
            </div>
            
            {/* Right panel */}
            <div className="lg:col-span-3 h-full">
              <ScreenDefinePanel
                totalSteps={screens.length}
                currentStep={activeScreenIndex}
                formData={formData}
                setFormData={setFormData}
                onSave={handleInlineUpdate}
                isEditing={!!activeScreen}
                isLoading={isActionLoading}
                autosave={true}
              />
            </div>
          </div>

          {/* Bottom navigation */}
          {screens.length > 0 && (
            <div className="mt-6 border-t border-gray-800 pt-4">
              <ScreenCarouselNav
                screens={screens}
                activeScreenId={activeScreen?.id || null}
                onScreenSelect={goToScreen}
                onAddScreen={handleCreateEmptyScreen}
              />
            </div>
          )}
        </>
      )}

      {/* Delete Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Delete Screen</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this screen? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteScreen}
                disabled={isActionLoading}
              >
                {isActionLoading ? "Deleting..." : "Delete Screen"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
