import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DropZone } from "../core-set/DropZone";
import { DraggableCard } from "../core-set/DraggableCard";

interface Element {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  coe_ids: string[] | null;
  tags: string[] | null;
  primary_tag_id?: string | null;
}

interface ElementsAssignmentProps {
  coeId: string;
  onAssignmentChange: () => void;
}

export const ElementsAssignment = ({ coeId, onAssignmentChange }: ElementsAssignmentProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [draggedElement, setDraggedElement] = useState<Element | null>(null);
  const [selectedElements, setSelectedElements] = useState<Set<string>>(new Set());
  
  const { data: elements = [], isLoading, refetch } = useQuery({
    queryKey: ["elements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("elements")
        .select("*");
      
      if (error) {
        console.error("Error fetching elements:", error);
        return [];
      }
      
      return data || [];
    },
  });
  
  const [localAssignedElements, setLocalAssignedElements] = useState<Element[]>([]);
  const [localUnassignedElements, setLocalUnassignedElements] = useState<Element[]>([]);
  
  useEffect(() => {
    if (elements && elements.length > 0) {
      const assigned = elements.filter(
        (element) => element.coe_ids && element.coe_ids.includes(coeId)
      );
      
      const unassigned = elements.filter(
        (element) => !element.coe_ids || !element.coe_ids.includes(coeId)
      );
      
      setLocalAssignedElements(assigned);
      setLocalUnassignedElements(unassigned);
    }
  }, [elements, coeId]);
  
  const filteredUnassigned = searchQuery
    ? localUnassignedElements.filter(element => 
        element.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (element.description && element.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (element.tags && element.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    : localUnassignedElements;
  
  const handleDragStart = (element: Element) => {
    setDraggedElement(element);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = async (e: React.DragEvent, targetType: "assign" | "unassign") => {
    e.preventDefault();
    
    const elementsToUpdate: Element[] = [];
    
    if (draggedElement) {
      elementsToUpdate.push(draggedElement);
    }
    
    if (selectedElements.size > 0) {
      elements
        .filter(element => selectedElements.has(element.id))
        .forEach(element => {
          if (!elementsToUpdate.some(e => e.id === element.id)) {
            elementsToUpdate.push(element);
          }
        });
    }
    
    if (elementsToUpdate.length === 0) return;
    
    try {
      const updatedElements: Element[] = [];
      
      for (const element of elementsToUpdate) {
        let updatedCoeIds: string[] = element.coe_ids || [];
        
        if (targetType === "assign" && !updatedCoeIds.includes(coeId)) {
          updatedCoeIds = [...updatedCoeIds, coeId];
        } else if (targetType === "unassign") {
          updatedCoeIds = updatedCoeIds.filter(id => id !== coeId);
        }
        
        await supabase
          .from("elements")
          .update({ coe_ids: updatedCoeIds })
          .eq("id", element.id);
        
        updatedElements.push({
          ...element,
          coe_ids: updatedCoeIds
        });
      }
      
      setLocalAssignedElements(prev => {
        const remaining = prev.filter(element => 
          !updatedElements.some(updated => 
            updated.id === element.id && targetType === "unassign"
          )
        );
        
        const newlyAssigned = updatedElements.filter(element => 
          targetType === "assign" && element.coe_ids?.includes(coeId)
        );
        
        return [...remaining, ...newlyAssigned];
      });
      
      setLocalUnassignedElements(prev => {
        const remaining = prev.filter(element => 
          !updatedElements.some(updated => 
            updated.id === element.id && targetType === "assign"
          )
        );
        
        const newlyUnassigned = updatedElements.filter(element => 
          targetType === "unassign" && (!element.coe_ids || !element.coe_ids.includes(coeId))
        );
        
        return [...remaining, ...newlyUnassigned];
      });
      
      setSelectedElements(new Set());
      setDraggedElement(null);
      
      queryClient.invalidateQueries({ queryKey: ["elements"] });
      queryClient.invalidateQueries({ queryKey: ["coe-elements", coeId] });
      
      onAssignmentChange();
      
      toast({
        title: `${elementsToUpdate.length} element${elementsToUpdate.length !== 1 ? 's' : ''} ${targetType === "assign" ? "assigned" : "unassigned"}`,
        description: `Successfully ${targetType === "assign" ? "added to" : "removed from"} this COE`
      });
    } catch (error) {
      console.error(`Error ${targetType}ing elements:`, error);
      toast({
        title: "Error",
        description: `Failed to ${targetType} elements. Please try again.`,
        variant: "destructive"
      });
    }
  };
  
  const toggleElementSelection = (elementId: string) => {
    const newSelected = new Set(selectedElements);
    if (newSelected.has(elementId)) {
      newSelected.delete(elementId);
    } else {
      newSelected.add(elementId);
    }
    setSelectedElements(newSelected);
  };
  
  const selectAllVisible = () => {
    const newSelected = new Set(selectedElements);
    filteredUnassigned.forEach(element => newSelected.add(element.id));
    setSelectedElements(newSelected);
  };
  
  const clearSelection = () => {
    setSelectedElements(new Set());
  };

  const handleDragEnd = () => {
    setDraggedElement(null);
  };
  
  const handleAssignSelected = async () => {
    try {
      const elementsToAssign = elements.filter(element => selectedElements.has(element.id));
      const updatedElements: Element[] = [];
      
      for (const element of elementsToAssign) {
        const updatedCoeIds = [...(element.coe_ids || []), coeId];
        await supabase
          .from("elements")
          .update({ coe_ids: updatedCoeIds })
          .eq("id", element.id);
        
        updatedElements.push({
          ...element,
          coe_ids: updatedCoeIds
        });
      }
      
      setLocalAssignedElements(prev => {
        const newAssigned = [...prev];
        updatedElements.forEach(element => {
          if (!newAssigned.some(e => e.id === element.id)) {
            newAssigned.push(element);
          }
        });
        return newAssigned;
      });
      
      setLocalUnassignedElements(prev => 
        prev.filter(element => !selectedElements.has(element.id))
      );
      
      setSelectedElements(new Set());
      
      queryClient.invalidateQueries({ queryKey: ["elements"] });
      queryClient.invalidateQueries({ queryKey: ["coe-elements", coeId] });
      
      onAssignmentChange();
      
      toast({
        title: `${selectedElements.size} elements assigned`,
        description: "Successfully added to this COE"
      });
    } catch (error) {
      console.error("Error assigning elements:", error);
      toast({
        title: "Error",
        description: "Failed to assign elements. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  if (isLoading) {
    return <div className="text-center py-4">Loading elements...</div>;
  }
  
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Element Assignment</h3>
      
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search elements..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          {selectedElements.size > 0 ? (
            <Button size="sm" variant="ghost" onClick={clearSelection}>
              Clear ({selectedElements.size})
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
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "unassign")}
          zone="unassign"
          className="bg-background border-dashed"
        >
          <div className="text-xs font-medium text-muted-foreground mb-2 p-1 sticky top-0 bg-card">
            Available Elements ({filteredUnassigned.length})
          </div>
          
          {filteredUnassigned.length > 0 ? (
            <div className="space-y-2">
              {filteredUnassigned.map((element) => (
                <DraggableCard
                  key={element.id}
                  coe={element}
                  isSelected={selectedElements.has(element.id)}
                  onClick={() => toggleElementSelection(element.id)}
                  onDragStart={() => handleDragStart(element)}
                  onDragEnd={handleDragEnd}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No elements found
            </div>
          )}
        </DropZone>
        
        <DropZone
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "assign")}
          zone="assign"
          className="bg-background border-primary/20 hover:border-primary/40 transition-colors"
        >
          <div className="text-xs font-medium text-muted-foreground mb-2 p-1 sticky top-0 bg-card">
            Assigned to COE ({localAssignedElements.length})
            {selectedElements.size > 0 && (
              <Badge className="ml-2 bg-primary">Drag {selectedElements.size} elements here</Badge>
            )}
          </div>
          
          {localAssignedElements.length > 0 ? (
            <div className="space-y-2">
              {localAssignedElements.map((element) => (
                <DraggableCard
                  key={element.id}
                  coe={element}
                  isSelected={selectedElements.has(element.id)}
                  onClick={() => toggleElementSelection(element.id)}
                  onDragStart={() => handleDragStart(element)}
                  onDragEnd={handleDragEnd}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-4 text-muted-foreground text-sm">
              <p>Drag elements here to assign</p>
              <p className="text-xs mt-1">Or select multiple and drag them as a group</p>
            </div>
          )}
        </DropZone>
      </div>
      
      {selectedElements.size > 0 && (
        <div className="flex justify-end">
          <Button 
            size="sm"
            onClick={handleAssignSelected}
          >
            Assign {selectedElements.size} Selected
          </Button>
        </div>
      )}
    </div>
  );
};
