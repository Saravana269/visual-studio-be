
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useGroupManagement } from "@/hooks/useGroupManagement";
import type { COE } from "@/hooks/useCOEData";
import type { CoreSet } from "@/hooks/useCoreSetData";

export const useCOEAssignment = (coreSet: CoreSet | null) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [draggedCOE, setDraggedCOE] = useState<COE | null>(null);
  const [dragOverZone, setDragOverZone] = useState<"assign" | "unassign" | null>(null);
  const [dragOverGroupId, setDragOverGroupId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedCOEs, setSelectedCOEs] = useState<Set<string>>(new Set());
  
  // Initialize group management
  const {
    groups,
    addGroup,
    updateGroup,
    removeGroup,
    assignToGroup,
    assignMultipleToGroup,
    removeFromGroup,
    getGroupForCOE,
    getCOEsInGroup,
    toggleGroupCollapse
  } = useGroupManagement(coreSet?.id || null);

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
        
        console.log("Fetched COEs:", data?.length || 0);
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

  // Create a grouped version of assigned COEs
  const groupedAssignedCOEs = groups.reduce((acc, group) => {
    acc[group.id] = getCOEsInGroup(group.id, assignedCOEs);
    return acc;
  }, {} as Record<string, COE[]>);

  const filteredUnassigned = searchQuery
    ? unassignedCOEs.filter(coe => 
        coe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (coe.description && coe.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (coe.tags && coe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    : unassignedCOEs;

  const handleDragStart = useCallback((coe: COE) => {
    console.log("Drag started:", coe.name);
    setDraggedCOE(coe);
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(() => {
    console.log("Drag ended");
    setDraggedCOE(null);
    setIsDragging(false);
    setDragOverZone(null);
    setDragOverGroupId(null);
  }, []);

  const handleDragOver = useCallback((zone: "assign" | "unassign", groupId?: string) => (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverZone(zone);
    
    if (zone === "assign" && groupId) {
      setDragOverGroupId(groupId);
    } else {
      setDragOverGroupId(null);
    }
  }, []);

  const handleDrop = useCallback(async (targetType: "assign" | "unassign", groupId?: string) => {
    console.log("Drop in zone:", targetType);
    console.log("Drop in group:", groupId);
    console.log("Dragged COE:", draggedCOE?.name);
    console.log("Selected COEs count:", selectedCOEs.size);
    
    if (!coreSet || (!draggedCOE && selectedCOEs.size === 0)) {
      console.log("No CoreSet or no COEs to update");
      return;
    }
    
    const coesToUpdate: COE[] = [];
    
    if (draggedCOE) {
      coesToUpdate.push(draggedCOE);
      console.log("Adding dragged COE to update list:", draggedCOE.name);
    }
    
    if (selectedCOEs.size > 0) {
      coes
        .filter(coe => selectedCOEs.has(coe.id))
        .forEach(coe => {
          if (!coesToUpdate.some(c => c.id === coe.id)) {
            coesToUpdate.push(coe);
            console.log("Adding selected COE to update list:", coe.name);
          }
        });
    }
    
    if (coesToUpdate.length === 0) {
      console.log("No COEs to update after filtering");
      return;
    }
    
    try {
      console.log("Updating COEs:", coesToUpdate.length);
      for (const coe of coesToUpdate) {
        let updatedCoreSetIds = coe.coreSet_id || [];
        
        if (targetType === "assign" && !updatedCoreSetIds.includes(coreSet.id)) {
          updatedCoreSetIds = [...updatedCoreSetIds, coreSet.id];
          console.log(`Adding CoreSet ID ${coreSet.id} to COE ${coe.name}`);
          
          // Assign to the specified group (or default if not specified)
          if (groupId) {
            assignToGroup(coe.id, groupId);
          } else {
            assignToGroup(coe.id, "default");
          }
        } else if (targetType === "unassign") {
          updatedCoreSetIds = updatedCoreSetIds.filter(id => id !== coreSet.id);
          console.log(`Removing CoreSet ID ${coreSet.id} from COE ${coe.name}`);
          
          // Remove from any group
          removeFromGroup(coe.id);
        }
        
        const { error } = await supabase
          .from("class_of_elements")
          .update({ coreSet_id: updatedCoreSetIds })
          .eq("id", coe.id);
          
        if (error) {
          console.error("Error updating COE:", error);
          throw new Error(error.message);
        }
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
  }, [coreSet, draggedCOE, selectedCOEs, coes, refetch, toast, assignToGroup, removeFromGroup]);

  const moveToGroup = useCallback(async (coeIds: string[], groupId: string) => {
    if (!coreSet) return;
    
    try {
      // First ensure all COEs are assigned to this CoreSet
      for (const coeId of coeIds) {
        const coe = coes.find(c => c.id === coeId);
        if (!coe) continue;
        
        if (!coe.coreSet_id || !coe.coreSet_id.includes(coreSet.id)) {
          const updatedCoreSetIds = [...(coe.coreSet_id || []), coreSet.id];
          
          await supabase
            .from("class_of_elements")
            .update({ coreSet_id: updatedCoreSetIds })
            .eq("id", coeId);
        }
      }
      
      // Then assign them to the specified group
      assignMultipleToGroup(coeIds, groupId);
      
      refetch();
      
      toast({
        title: "COEs moved",
        description: `Successfully moved ${coeIds.length} COEs to group`,
      });
    } catch (error: any) {
      console.error("Error moving COEs to group:", error);
      toast({
        title: "Error",
        description: `Failed to move COEs to group: ${error.message || "Unknown error"}`,
        variant: "destructive"
      });
    }
  }, [coreSet, coes, assignMultipleToGroup, refetch, toast]);

  const toggleCOESelection = useCallback((coeId: string) => {
    setSelectedCOEs(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(coeId)) {
        newSelected.delete(coeId);
      } else {
        newSelected.add(coeId);
      }
      return newSelected;
    });
  }, []);

  const selectAllVisible = useCallback(() => {
    setSelectedCOEs(prev => {
      const newSelected = new Set(prev);
      filteredUnassigned.forEach(coe => newSelected.add(coe.id));
      return newSelected;
    });
  }, [filteredUnassigned]);

  const clearSelection = useCallback(() => {
    setSelectedCOEs(new Set());
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    draggedCOE,
    dragOverZone,
    dragOverGroupId,
    isDragging,
    selectedCOEs,
    coes,
    isLoading,
    assignedCOEs,
    filteredUnassigned,
    groupedAssignedCOEs,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    toggleCOESelection,
    selectAllVisible,
    clearSelection,
    refetch,
    // Group related
    groups,
    addGroup,
    updateGroup,
    removeGroup,
    getGroupForCOE,
    moveToGroup,
    toggleGroupCollapse
  };
};
