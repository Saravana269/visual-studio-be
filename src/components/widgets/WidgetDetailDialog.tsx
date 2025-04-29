
import { WidgetDetail } from "@/types/widget";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WidgetDetailSkeleton } from "./detail/WidgetDetailSkeleton";
import { WidgetImage } from "./detail/WidgetImage";
import { WidgetScreensTab } from "./detail/WidgetScreensTab";
import { WidgetInfoTab } from "./detail/WidgetInfoTab";
import { WidgetTagsTab } from "./detail/WidgetTagsTab";

interface WidgetDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedWidget: { id: string } | null;
  onEditClick: (widget: WidgetDetail) => void;
  tagDetails: Record<string, string>;
}

export function WidgetDetailDialog({ 
  isOpen, 
  onOpenChange, 
  selectedWidget, 
  onEditClick,
  tagDetails
}: WidgetDetailDialogProps) {
  const { toast } = useToast();

  // Fetch widget details including screens
  const { data: widgetDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["widget-detail", selectedWidget?.id],
    queryFn: async () => {
      if (!selectedWidget?.id) return null;

      try {
        // Fetch widget data
        const { data: widgetData, error: widgetError } = await supabase
          .from("widgets")
          .select("*")
          .eq("id", selectedWidget.id)
          .single();

        if (widgetError) throw widgetError;

        // Fetch screens associated with this widget
        const { data: screensData, error: screensError } = await supabase
          .from("screens")
          .select("*")
          .eq("widget_id", selectedWidget.id);

        if (screensError) throw screensError;

        return {
          ...widgetData,
          screens: screensData || []
        } as WidgetDetail;
      } catch (error: any) {
        toast({
          title: "Error fetching widget details",
          description: error.message,
          variant: "destructive"
        });
        return null;
      }
    },
    enabled: !!selectedWidget?.id && isOpen
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        {isLoadingDetail || !widgetDetail ? (
          <WidgetDetailSkeleton />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{widgetDetail.name}</DialogTitle>
              {widgetDetail.description && (
                <DialogDescription>{widgetDetail.description}</DialogDescription>
              )}
            </DialogHeader>
            
            <WidgetImage imageUrl={widgetDetail.image_url} altText={widgetDetail.name} />
            
            {/* Widget Details Tabs */}
            <Tabs defaultValue="screens">
              <TabsList className="w-full">
                <TabsTrigger value="screens" className="flex-1">Screens</TabsTrigger>
                <TabsTrigger value="info" className="flex-1">Info</TabsTrigger>
                <TabsTrigger value="tags" className="flex-1">Tags</TabsTrigger>
              </TabsList>
              
              <TabsContent value="screens">
                <WidgetScreensTab 
                  screens={widgetDetail.screens} 
                  widgetId={widgetDetail.id} 
                  onClose={() => onOpenChange(false)} 
                />
              </TabsContent>
              
              <TabsContent value="info">
                <WidgetInfoTab 
                  createdAt={widgetDetail.created_at}
                  updatedAt={widgetDetail.updated_at}
                  id={widgetDetail.id}
                />
              </TabsContent>
              
              <TabsContent value="tags">
                <WidgetTagsTab 
                  tagIds={widgetDetail.tags}
                  tagDetails={tagDetails}
                  widget={widgetDetail}
                  onEdit={onEditClick}
                  onClose={() => onOpenChange(false)}
                />
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button 
                onClick={() => {
                  onOpenChange(false);
                  onEditClick(widgetDetail);
                }}
                className="bg-[#9b87f5] hover:bg-[#7E69AB]"
              >
                Edit Widget
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
