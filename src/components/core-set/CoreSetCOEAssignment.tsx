import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { CoreSet } from "@/hooks/useCoreSetData";
import type { COE } from "@/hooks/useCOEData";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { DraggableCard } from "./DraggableCard";
import { DropZone } from "./DropZone";

interface CoreSetCOEAssignmentProps {
  coreSet: CoreSet | null;
  open: boolean;
  onClose: () => void;
}

export const CoreSetCOEAssignment = ({ coreSet, open, onClose }: CoreSetCOEAssignmentProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [draggedCOE, setDraggedCOE] = useState<COE | null>(null);
  const [dragOverZone, setDragOverZone] = useState<"assign" | "unassign" | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedCOEs, setSelectedCOEs] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    if (!open) {
      setSelectedCOEs(new Set());
      setSearchQuery("");
    }
  }, [open, coreSet?.id]);
  
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
  
  const assignedCOEs = coes.filter(
    (coe) => coe.coreSet_id && coreSet && coe.coreSet_id.includes(coreSet.id)
  );
  
  const unassignedCOEs = coes.filter(
    (coe) => !coe.coreSet_id || !coreSet || !coe.coreSet_id.includes(coreSet.id)
  );
  
  const filteredUnassigned = searchQuery
    ? unassignedCOEs.filter(coe => 
        coe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (coe.description && coe.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (coe.tags && coe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    : unassignedCOEs;
  
  const handleDragStart = (coe: COE) => {
    setDraggedCOE(coe);
    setIsDragging(true);
  };
  
  const handleDragEnd = () => {
    setDraggedCOE(null);
    setIsDragging(false);
    setDragOverZone(null);
  };
  
  const handleDragOver = (e: React.DragEvent, zone: "assign" | "unassign") => {
    e.preventDefault();
    setDragOverZone(zone);
  };
  
  const handleDrop = async (e: React.DragEvent, targetType: "assign" | "unassign") => {
    e.preventDefault();
    
    if (!coreSet) return;
    
    const coesToUpdate: COE[] = [];
    
    if (draggedCOE) {
      coesToUpdate.push(draggedCOE);
    }
    
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
      
      setSelectedCOEs(new Set());
      setDraggedCOE(null);
      
      refetch();
      
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
  
  const toggleCOESelection = (coeId: string) => {
    const newSelected = new Set(selectedCOEs);
    if (newSelected.has(coeId)) {
      newSelected.delete(coeId);
    } else {
      newSelected.add(coeId);
    }
    setSelectedCOEs(newSelected);
  };
  
  const selectAllVisible = () => {
    const newSelected = new Set(selectedCOEs);
    filteredUnassigned.forEach(coe => newSelected.add(coe.id));
    setSelectedCOEs(newSelected);
  };
  
  const clearSelection = () => {
    setSelectedCOEs(new Set());
  };
  
  if (!coreSet) {
    return null;
  }
  
  return (
    <Sheet open={open && !!coreSet} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>{coreSet.name}</SheetTitle>
          <SheetDescription>
            Manage which Class of Elements (COEs) belong to this Core Set
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-1">Description</h3>
            <p className="text-sm text-muted-foreground">
              {coreSet.description || "No description available"}
            </p>
          </div>

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
            <DropZone
              isOver={dragOverZone === "unassign"}
              onDragOver={(e) => handleDragOver(e, "unassign")}
              onDrop={(e) => handleDrop(e, "unassign")}
            >
              <div className="text-xs font-medium text-muted-foreground mb-2 p-1 sticky top-0 bg-card">
                Available COEs ({filteredUnassigned.length})
              </div>
              
              <div className="space-y-2">
                {filteredUnassigned.map((coe) => (
                  <DraggableCard
                    key={coe.id}
                    coe={coe}
                    isSelected={selectedCOEs.has(coe.id)}
                    isDragging={draggedCOE?.id === coe.id}
                    onClick={() => toggleCOESelection(coe.id)}
                    onDragStart={() => handleDragStart(coe)}
                    onDragEnd={handleDragEnd}
                  />
                ))}
              </div>
            </DropZone>
            
            <DropZone
              isOver={dragOverZone === "assign"}
              onDragOver={(e) => handleDragOver(e, "assign")}
              onDrop={(e) => handleDrop(e, "assign")}
              className="border-dashed border-primary/50"
            >
              <div className="text-xs font-medium text-muted-foreground mb-2 p-1 sticky top-0 bg-card">
                Assigned to Core Set ({assignedCOEs.length})
                {selectedCOEs.size > 0 && (
                  <Badge className="ml-2 bg-primary">
                    Drag {selectedCOEs.size} COEs here
                  </Badge>
                )}
              </div>
              
              <div className="space-y-2">
                {assignedCOEs.map((coe) => (
                  <DraggableCard
                    key={coe.id}
                    coe={coe}
                    onRemove={async () => {
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
                  />
                ))}
              </div>
            </DropZone>
          </div>
          
          {selectedCOEs.size > 0 && (
            <div className="flex justify-end">
              <Button 
                size="sm"
                onClick={async () => {
                  if (!coreSet) return;
                  
                  try {
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
                    
                    setSelectedCOEs(new Set());
                    refetch();
                    
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
