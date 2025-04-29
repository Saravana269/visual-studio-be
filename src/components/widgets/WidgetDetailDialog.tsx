import { WidgetDetail } from "@/types/widget";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Tag, Layout } from "lucide-react";

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
  const navigate = useNavigate();

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

  // Get tags to display on widgets
  const getTagLabels = (tagIds: string[] | null): string[] => {
    if (!tagIds) return [];
    return tagIds.map(id => tagDetails[id] || "Unknown Tag").filter(Boolean);
  };

  const handleManageScreens = () => {
    if (widgetDetail) {
      onOpenChange(false);
      navigate(`/widgets/${widgetDetail.id}/screens`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        {isLoadingDetail || !widgetDetail ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{widgetDetail.name}</DialogTitle>
              {widgetDetail.description && (
                <DialogDescription>
                  {widgetDetail.description}
                </DialogDescription>
              )}
            </DialogHeader>
            
            {widgetDetail.image_url && (
              <div className="w-full h-48 bg-muted rounded-md overflow-hidden">
                <img 
                  src={widgetDetail.image_url} 
                  alt={widgetDetail.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
            )}
            
            {/* Widget Details Tabs */}
            <Tabs defaultValue="screens">
              <TabsList className="w-full">
                <TabsTrigger value="screens" className="flex-1">Screens</TabsTrigger>
                <TabsTrigger value="info" className="flex-1">Info</TabsTrigger>
                <TabsTrigger value="tags" className="flex-1">Tags</TabsTrigger>
              </TabsList>
              
              <TabsContent value="screens">
                {widgetDetail.screens?.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Description</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {widgetDetail.screens.map((screen) => (
                          <TableRow key={screen.id}>
                            <TableCell className="font-medium">{screen.name}</TableCell>
                            <TableCell>{screen.framework_type || "Not specified"}</TableCell>
                            <TableCell>{screen.description || "-"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="p-4 flex justify-end">
                      <Button 
                        onClick={handleManageScreens} 
                        className="bg-[#9b87f5] hover:bg-[#7E69AB] gap-2"
                      >
                        <Layout size={16} />
                        Manage Screens
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <p className="text-muted-foreground">No screens have been added to this widget yet.</p>
                    <Button 
                      className="mt-4 bg-[#9b87f5] hover:bg-[#7E69AB] gap-2"
                      onClick={handleManageScreens}
                    >
                      <Plus size={16} />
                      Add Screens
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="info">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Created</h4>
                    <p className="text-muted-foreground">
                      {new Date(widgetDetail.created_at).toLocaleDateString()} at{" "}
                      {new Date(widgetDetail.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Last Updated</h4>
                    <p className="text-muted-foreground">
                      {new Date(widgetDetail.updated_at).toLocaleDateString()} at{" "}
                      {new Date(widgetDetail.updated_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">ID</h4>
                    <p className="text-muted-foreground text-xs font-mono">
                      {widgetDetail.id}
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="tags">
                <div className="space-y-4">
                  {widgetDetail.tags && widgetDetail.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {getTagLabels(widgetDetail.tags).map((tag, idx) => (
                        <div 
                          key={idx} 
                          className="bg-[#E5DEFF] text-[#6E59A5] px-3 py-2 rounded-md flex items-center"
                        >
                          <Tag size={14} className="mr-2" /> {tag}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No tags have been added to this widget yet.</p>
                  )}
                  <Button 
                    variant="outline"
                    onClick={() => {
                      onOpenChange(false);
                      onEditClick(widgetDetail);
                    }}
                    className="mt-2"
                  >
                    Manage Tags
                  </Button>
                </div>
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
