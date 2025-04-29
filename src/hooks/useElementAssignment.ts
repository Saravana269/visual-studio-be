
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Element } from "@/types/element";

export const useElementAssignment = (coeId: string, onAssignmentChange: () => void) => {
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
  
  const handleDragEnd = () => {
    setDraggedElement(null);
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

  return {
    searchQuery,
    setSearchQuery,
    draggedElement,
    selectedElements,
    isLoading,
    filteredUnassigned,
    localAssignedElements,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    toggleElementSelection,
    selectAllVisible,
    clearSelection,
    handleAssignSelected
  };
};
