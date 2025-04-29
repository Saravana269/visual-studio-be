import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ListFilter, Tag, LayoutGrid } from "lucide-react";
import { TagManagementRow } from "@/components/elements/TagManagementRow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import TagManager from "@/components/TagManager";

// Define Widget type
interface Widget {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

// Define WidgetDetail type to include screens
interface WidgetDetail extends Widget {
  screens: Screen[];
}

// Define Screen type
interface Screen {
  id: string;
  name: string;
  description: string | null;
  framework_type: string | null;
  widget_id: string;
}

const WidgetManager = () => {
  const { toast } = useToast();
  const { session } = useAuth();
  const userId = session?.user?.id;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [widgetFormData, setWidgetFormData] = useState({
    name: "",
    description: "",
    tags: [] as string[]
  });

  // Fetch widgets
  const { data: widgets = [], isLoading, refetch } = useQuery({
    queryKey: ["widgets", userId, searchQuery, selectedTagIds],
    queryFn: async () => {
      try {
        let query = supabase
          .from("widgets")
          .select("*");

        // Filter by search query if provided
        if (searchQuery) {
          query = query.ilike("name", `%${searchQuery}%`);
        }

        // Filter by tags if selected
        if (selectedTagIds.length > 0) {
          query = query.contains("tags", selectedTagIds);
        }

        const { data, error } = await query.order("created_at", { ascending: false });

        if (error) {
          toast({
            title: "Error fetching widgets",
            description: error.message,
            variant: "destructive"
          });
          return [];
        }

        return data as Widget[];
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to fetch widgets",
          variant: "destructive"
        });
        return [];
      }
    },
    enabled: !!userId
  });

  // Fetch widget details including screens
  const { data: widgetDetail, isLoading: isLoadingDetail, refetch: refetchDetail } = useQuery({
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
    enabled: !!selectedWidget?.id
  });

  // Fetch tag details to display tag names instead of IDs
  const { data: tagDetails = {} } = useQuery({
    queryKey: ["tag-details", userId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("tags")
          .select("id, label")
          .eq("entity_type", "Widget");

        if (error) throw error;

        // Convert to dictionary for easy lookup
        const tagDict: Record<string, string> = {};
        data?.forEach(tag => {
          tagDict[tag.id] = tag.label;
        });

        return tagDict;
      } catch (error: any) {
        console.error("Error fetching tag details:", error);
        return {};
      }
    },
    enabled: !!userId
  });

  // Handle viewing widget details
  const handleViewDetails = (widget: Widget) => {
    setSelectedWidget(widget);
    setIsDetailDialogOpen(true);
  };

  // Handle creating a new widget
  const handleCreateWidget = async () => {
    try {
      if (!widgetFormData.name) {
        toast({
          title: "Error",
          description: "Widget name is required",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase
        .from("widgets")
        .insert({
          name: widgetFormData.name,
          description: widgetFormData.description,
          tags: widgetFormData.tags.length > 0 ? widgetFormData.tags : null
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Widget created successfully"
      });

      // Reset form and close dialog
      setWidgetFormData({ name: "", description: "", tags: [] });
      setIsCreateDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast({
        title: "Error creating widget",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Handle updating a widget
  const handleUpdateWidget = async () => {
    try {
      if (!selectedWidget?.id || !widgetFormData.name) {
        toast({
          title: "Error",
          description: "Widget ID and name are required",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase
        .from("widgets")
        .update({
          name: widgetFormData.name,
          description: widgetFormData.description,
          tags: widgetFormData.tags.length > 0 ? widgetFormData.tags : null,
          updated_at: new Date().toISOString()
        })
        .eq("id", selectedWidget.id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Widget updated successfully"
      });

      // Reset form and close dialog
      setIsEditDialogOpen(false);
      refetch();
      
      // If detail dialog is open, refetch the details
      if (isDetailDialogOpen) {
        refetchDetail();
      }
    } catch (error: any) {
      toast({
        title: "Error updating widget",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Handle editing a widget
  const handleEditClick = (widget: Widget) => {
    setSelectedWidget(widget);
    setWidgetFormData({
      name: widget.name,
      description: widget.description || "",
      tags: widget.tags || []
    });
    setIsEditDialogOpen(true);
  };

  // Handle tag selection for filtering
  const handleTagSelect = (tagId: string) => {
    if (!selectedTagIds.includes(tagId)) {
      setSelectedTagIds([...selectedTagIds, tagId]);
    }
  };

  // Handle tag removal for filtering
  const handleTagRemove = (tagId: string) => {
    setSelectedTagIds(selectedTagIds.filter(id => id !== tagId));
  };

  // Handle clearing all selected tags
  const handleTagClear = () => {
    setSelectedTagIds([]);
  };

  // Get tags to display on widgets
  const getTagLabels = (tagIds: string[] | null): string[] => {
    if (!tagIds) return [];
    return tagIds.map(id => tagDetails[id] || "Unknown Tag").filter(Boolean);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Widget Manager</h1>
        <Button 
          onClick={() => {
            setWidgetFormData({ name: "", description: "", tags: [] });
            setIsCreateDialogOpen(true);
          }}
          className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
        >
          <Plus size={16} className="mr-2" /> New Widget
        </Button>
      </div>

      {/* Search and filter options */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search widgets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
            <ListFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="flex-shrink-0"
          >
            {viewMode === "grid" ? <LayoutGrid size={16} /> : <ListFilter size={16} />}
          </Button>
        </div>
        
        {/* Tag management row */}
        <TagManagementRow
          selectedTags={selectedTagIds}
          tagDetails={tagDetails}
          onTagSearch={setSearchQuery}
          onTagSelect={handleTagSelect}
          onTagRemove={handleTagRemove}
          onTagClear={handleTagClear}
          onAddTagClick={() => {}}
          entityType="widget"
        />
      </div>

      {/* Widgets display - either grid or list */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-64 w-full rounded-md" />
          ))}
        </div>
      ) : widgets.length === 0 ? (
        <div className="bg-muted p-8 rounded-md text-center">
          <h2 className="text-xl font-medium text-muted-foreground mb-2">
            No widgets found
          </h2>
          <p className="text-muted-foreground mb-4">
            Get started by creating your first widget
          </p>
          <Button 
            onClick={() => {
              setWidgetFormData({ name: "", description: "", tags: [] });
              setIsCreateDialogOpen(true);
            }}
            className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
          >
            <Plus size={16} className="mr-2" /> Create Widget
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {widgets.map(widget => (
            <Card 
              key={widget.id} 
              className="cursor-pointer hover:border-[#9b87f5] transition-all"
              onClick={() => handleViewDetails(widget)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{widget.name}</CardTitle>
                {widget.description && (
                  <CardDescription className="line-clamp-2">{widget.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {widget.image_url ? (
                  <div className="w-full h-32 bg-muted rounded-md mb-3 overflow-hidden">
                    <img 
                      src={widget.image_url} 
                      alt={widget.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                ) : (
                  <div className="w-full h-32 bg-muted rounded-md mb-3 flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">No preview available</p>
                  </div>
                )}
                
                {/* Tags display */}
                {widget.tags && widget.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {getTagLabels(widget.tags).map((tagLabel, idx) => (
                      <div 
                        key={idx} 
                        className="bg-[#E5DEFF] text-[#6E59A5] text-xs px-2 py-1 rounded-sm flex items-center"
                      >
                        <Tag size={10} className="mr-1" /> {tagLabel}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0 flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(widget);
                  }}
                >
                  Edit
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(widget);
                  }}
                >
                  Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {widgets.map(widget => (
                <TableRow key={widget.id}>
                  <TableCell className="font-medium">{widget.name}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {widget.description || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {getTagLabels(widget.tags).map((tag, idx) => (
                        <div 
                          key={idx} 
                          className="bg-[#E5DEFF] text-[#6E59A5] text-xs px-2 py-1 rounded-sm flex items-center"
                        >
                          <Tag size={10} className="mr-1" /> {tag}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(widget.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditClick(widget)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleViewDetails(widget)}
                      >
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create Widget Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Create New Widget</DialogTitle>
            <DialogDescription>
              Add a new widget to your application.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="widget-name">Name</Label>
              <Input
                id="widget-name"
                value={widgetFormData.name}
                onChange={(e) => setWidgetFormData({...widgetFormData, name: e.target.value})}
                placeholder="Widget Name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="widget-description">Description</Label>
              <Textarea
                id="widget-description"
                value={widgetFormData.description}
                onChange={(e) => setWidgetFormData({...widgetFormData, description: e.target.value})}
                placeholder="Describe the purpose of this widget"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label>Tags</Label>
              <TagManager
                initialTags={widgetFormData.tags}
                onChange={(tags) => setWidgetFormData({...widgetFormData, tags: tags})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateWidget} className="bg-[#9b87f5] hover:bg-[#7E69AB]">
              Create Widget
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Widget Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Widget</DialogTitle>
            <DialogDescription>
              Make changes to your widget.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-widget-name">Name</Label>
              <Input
                id="edit-widget-name"
                value={widgetFormData.name}
                onChange={(e) => setWidgetFormData({...widgetFormData, name: e.target.value})}
                placeholder="Widget Name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-widget-description">Description</Label>
              <Textarea
                id="edit-widget-description"
                value={widgetFormData.description}
                onChange={(e) => setWidgetFormData({...widgetFormData, description: e.target.value})}
                placeholder="Describe the purpose of this widget"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label>Tags</Label>
              <TagManager
                initialTags={widgetFormData.tags}
                onChange={(tags) => setWidgetFormData({...widgetFormData, tags: tags})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateWidget} className="bg-[#9b87f5] hover:bg-[#7E69AB]">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Widget Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
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
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <p className="text-muted-foreground">No screens have been added to this widget yet.</p>
                      <Button className="mt-4 bg-[#9b87f5] hover:bg-[#7E69AB]">
                        <Plus size={16} className="mr-2" /> Add Screen
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
                        setIsDetailDialogOpen(false);
                        handleEditClick(widgetDetail);
                      }}
                      className="mt-2"
                    >
                      Manage Tags
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    setIsDetailDialogOpen(false);
                    handleEditClick(widgetDetail);
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
    </div>
  );
};

export default WidgetManager;
