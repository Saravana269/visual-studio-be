
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { COE } from "@/hooks/useCOEData";
import type { CoreSet } from "@/hooks/useCoreSetData";

export const useCOEAssignment = (coreSet: CoreSet | null) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [draggedCOE, setDraggedCOE] = useState<COE | null>(null);
  const [dragOverZone, setDragOverZone] = useState<"assign" | "unassign" | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedCOEs, setSelectedCOEs] = useState<Set<string>>(new Set());

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
    enabled: !!coreSet,
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

  const handleDragOver = (zone: "assign" | "unassign") => {
    setDragOverZone(zone);
  };

  const handleDrop = async (targetType: "assign" | "unassign") => {
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
          
        if (error) throw new Error(error.message);
      }
      
      setSelectedCOEs(new Set());
      setDraggedCOE(null);
      
      refetch();
      
      toast({
        title: `${coesToUpdate.length} COE${coesToUpdate.length !== 1 ? 's' : ''} ${targetType === "assign" ? "assigned" : "unassigned"}`,
        description: `Successfully ${targetType === "assign" ? "added to" : "removed from"} this Core Set`,
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

  return {
    searchQuery,
    setSearchQuery,
    draggedCOE,
    dragOverZone,
    isDragging,
    selectedCOEs,
    coes,
    isLoading,
    assignedCOEs,
    filteredUnassigned,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    toggleCOESelection,
    selectAllVisible,
    clearSelection,
    refetch
  };
};
