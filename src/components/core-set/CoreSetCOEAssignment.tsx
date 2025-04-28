
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { CoreSet } from "@/hooks/useCoreSetData";
import type { COE } from "@/hooks/useCOEData";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

interface CoreSetCOEAssignmentProps {
  coreSet: CoreSet | null;
  open: boolean;
  onClose: () => void;
}

export const CoreSetCOEAssignment = ({ coreSet, open, onClose }: CoreSetCOEAssignmentProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [draggedCOE, setDraggedCOE] = useState<COE | null>(null);
  const [selectedCOEs, setSelectedCOEs] = useState<Set<string>>(new Set());
  
  // Reset selected COEs when modal closes or core set changes
  useEffect(() => {
    if (!open) {
      setSelectedCOEs(new Set());
      setSearchQuery("");
    }
  }, [open, coreSet?.id]);
  
  // Fetch all COEs
  const { data: coes = [], isLoading, refetch } = useQuery({
    queryKey: ["coes-for-coreset", coreSet?.id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("class_of_elements")
          .select("*");
        
        if (error) {
          console.error("Error fetching COEs:", error);
          return [];
        }
        
        return data || [];
      } catch (error) {
        console.error("Unexpected error in COE query:", error);
        return [];
      }
    },
    enabled: open && !!coreSet,
  });
  
  // Filter COEs into assigned and unassigned based on coreSet_id
  const assignedCOEs = coes.filter(
    (coe) => coe.coreSet_id && coreSet && coe.coreSet_id.includes(coreSet.id)
  );
  
  const unassignedCOEs = coes.filter(
    (coe) => !coe.coreSet_id || !coreSet || !coe.coreSet_id.includes(coreSet.id)
  );
  
  // Filter COEs based on search query
  const filteredUnassigned = searchQuery
    ? unassignedCOEs.filter(coe => 
        coe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (coe.description && coe.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (coe.tags && coe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    : unassignedCOEs;
  
  // Handle drag events
  const handleDragStart = (coe: COE) => {
    setDraggedCOE(coe);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  // Handle dropping COEs to assign them to the CoreSet
  const handleDrop = async (e: React.DragEvent, targetType: "assign" | "unassign") => {
    e.preventDefault();
    
    if (!coreSet) return;
    
    const coesToUpdate: COE[] = [];
    
    // If COE is being dragged, add it to the array
    if (draggedCOE) {
      coesToUpdate.push(draggedCOE);
    }
    
    // Add all selected COEs
    if (selectedCOEs.size > 0) {
      coes
        .filter(coe => selectedCOEs.has(coe.id))
        .forEach(coe => {
          if (!coesToUpdate.some(c => c.id === coe.id)) {
            coesToUpdate.push(coe);
          }
        });
    }
    
    if (coesToUpdate.length === 0) return;
    
    try {
      // Update each COE's coreSet_id
      for (const coe of coesToUpdate) {
        let updatedCoreSetIds = coe.coreSet_id || [];
        
        if (targetType === "assign" && !updatedCoreSetIds.includes(coreSet.id)) {
          updatedCoreSetIds = [...updatedCoreSetIds, coreSet.id];
        } else if (targetType === "unassign") {
          updatedCoreSetIds = updatedCoreSetIds.filter(id => id !== coreSet.id);
        }
        
        const { error } = await supabase
          .from("class_of_elements")
          .update({ coreSet_id: updatedCoreSetIds })
          .eq("id", coe.id);
          
        if (error) {
          console.error(`Error updating COE ${coe.id}:`, error);
          throw new Error(error.message);
        }
      }
      
      // Clear selection and dragged COE
      setSelectedCOEs(new Set());
      setDraggedCOE(null);
      
      // Refetch data
      refetch();
      
      // Show success toast
      toast({
        title: `${coesToUpdate.length} COE${coesToUpdate.length !== 1 ? 's' : ''} ${targetType === "assign" ? "assigned" : "unassigned"}`,
        description: `Successfully ${targetType === "assign" ? "added to" : "removed from"} this Core Set`
      });
    } catch (error: any) {
      console.error(`Error ${targetType}ing COEs:`, error);
      toast({
        title: "Error",
        description: `Failed to ${targetType} COEs: ${error.message || "Unknown error"}`,
        variant: "destructive"
      });
    }
  };
  
  // Handle clicking on a COE to select/deselect it
  const toggleCOESelection = (coeId: string) => {
    const newSelected = new Set(selectedCOEs);
    if (newSelected.has(coeId)) {
      newSelected.delete(coeId);
    } else {
      newSelected.add(coeId);
    }
    setSelectedCOEs(newSelected);
  };
  
  // Handle selecting all visible COEs
  const selectAllVisible = () => {
    const newSelected = new Set(selectedCOEs);
    filteredUnassigned.forEach(coe => newSelected.add(coe.id));
    setSelectedCOEs(newSelected);
  };
  
  // Handle deselecting all COEs
  const clearSelection = () => {
    setSelectedCOEs(new Set());
  };
  
  // Don't render anything if coreSet is null
  if (!coreSet) {
    return null;
  }
  
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>{coreSet.name}</SheetTitle>
          <SheetDescription>
            Manage which Class of Elements (COEs) belong to this Core Set
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-4">
          {/* Description */}
          <div>
            <h3 className="text-sm font-medium mb-1">Description</h3>
            <p className="text-sm text-muted-foreground">
              {coreSet.description || "No description available"}
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex justify-between items-center">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search COEs..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              {selectedCOEs.size > 0 ? (
                <Button size="sm" variant="ghost" onClick={clearSelection}>
                  Clear ({selectedCOEs.size})
                </Button>
              ) : (
                <Button size="sm" variant="ghost" onClick={selectAllVisible}>
                  Select All
                </Button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Unassigned COEs */}
            <div
              className="border rounded-md p-2 bg-card min-h-[200px] max-h-[400px] overflow-y-auto"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, "unassign")}
            >
              <div className="text-xs font-medium text-muted-foreground mb-2 p-1 sticky top-0 bg-card">
                Available COEs ({filteredUnassigned.length})
              </div>
              
              {isLoading ? (
                <div className="text-center py-4">Loading COEs...</div>
              ) : filteredUnassigned.length > 0 ? (
                <div className="space-y-2">
                  {filteredUnassigned.map((coe) => (
                    <Card
                      key={coe.id}
                      className={`cursor-pointer transition-all p-2 ${
                        selectedCOEs.has(coe.id) ? "border-primary bg-primary/5" : ""
                      }`}
                      draggable
                      onDragStart={() => handleDragStart(coe)}
                      onClick={() => toggleCOESelection(coe.id)}
                    >
                      <div className="flex items-center gap-2">
                        {coe.image_url && (
                          <div className="w-8 h-8 bg-muted flex-shrink-0">
                            <img 
                              src={coe.image_url} 
                              alt={coe.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{coe.name}</p>
                          {coe.tags && coe.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {coe.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs py-0 px-1">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  No COEs found
                </div>
              )}
            </div>
            
            {/* Assigned COEs Drop Zone */}
            <div
              className="border rounded-md p-2 bg-card min-h-[200px] max-h-[400px] overflow-y-auto border-dashed border-primary/50"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, "assign")}
            >
              <div className="text-xs font-medium text-muted-foreground mb-2 p-1 sticky top-0 bg-card">
                Assigned to Core Set ({assignedCOEs.length})
                {selectedCOEs.size > 0 && (
                  <Badge className="ml-2 bg-primary">Drag {selectedCOEs.size} COEs here</Badge>
                )}
              </div>
              
              {isLoading ? (
                <div className="text-center py-4">Loading COEs...</div>
              ) : assignedCOEs.length > 0 ? (
                <div className="space-y-2">
                  {assignedCOEs.map((coe) => (
                    <Card
                      key={coe.id}
                      className="p-2 group"
                      draggable
                      onDragStart={() => handleDragStart(coe)}
                    >
                      <div className="flex items-center gap-2">
                        {coe.image_url && (
                          <div className="w-8 h-8 bg-muted flex-shrink-0">
                            <img 
                              src={coe.image_url} 
                              alt={coe.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{coe.name}</p>
                          {coe.tags && coe.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {coe.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs py-0 px-1">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0" 
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (!coreSet) return;
                            try {
                              const updatedCoreSetIds = (coe.coreSet_id || []).filter(id => id !== coreSet.id);
                              await supabase
                                .from("class_of_elements")
                                .update({ coreSet_id: updatedCoreSetIds })
                                .eq("id", coe.id);
                              
                              refetch();
                              
                              toast({
                                title: "COE removed",
                                description: `${coe.name} has been removed from this Core Set`
                              });
                            } catch (error: any) {
                              console.error("Error removing COE:", error);
                              toast({
                                title: "Error",
                                description: `Failed to remove COE: ${error.message || "Unknown error"}`,
                                variant: "destructive"
                              });
                            }
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-4 text-muted-foreground text-sm">
                  <p>Drag COEs here to assign</p>
                  <p className="text-xs mt-1">Or select multiple and drag them as a group</p>
                </div>
              )}
            </div>
          </div>
          
          {selectedCOEs.size > 0 && (
            <div className="flex justify-end">
              <Button 
                size="sm"
                onClick={async () => {
                  if (!coreSet) return;
                  
                  try {
                    // Update all selected COEs
                    for (const coeId of selectedCOEs) {
                      const coe = coes.find(c => c.id === coeId);
                      if (coe) {
                        const updatedCoreSetIds = [...(coe.coreSet_id || [])];
                        if (!updatedCoreSetIds.includes(coreSet.id)) {
                          updatedCoreSetIds.push(coreSet.id);
                          await supabase
                            .from("class_of_elements")
                            .update({ coreSet_id: updatedCoreSetIds })
                            .eq("id", coeId);
                        }
                      }
                    }
                    
                    // Clear selection
                    setSelectedCOEs(new Set());
                    
                    // Refetch data
                    refetch();
                    
                    // Show success toast
                    toast({
                      title: `${selectedCOEs.size} COEs assigned`,
                      description: "Successfully added to this Core Set"
                    });
                  } catch (error: any) {
                    console.error("Error assigning COEs:", error);
                    toast({
                      title: "Error",
                      description: `Failed to assign COEs: ${error.message || "Unknown error"}`,
                      variant: "destructive"
                    });
                  }
                }}
              >
                Assign {selectedCOEs.size} Selected
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
