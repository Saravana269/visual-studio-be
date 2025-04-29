
import { useState, useEffect, useCallback } from "react";
import { GroupData, GroupMapping } from "@/types/group";
import { useToast } from "@/hooks/use-toast";
import { nanoid } from "@/lib/utils";

export const useGroupManagement = (coreSetId: string | null) => {
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [groupMapping, setGroupMapping] = useState<GroupMapping>({});
  const { toast } = useToast();

  // Load groups and mappings from localStorage
  useEffect(() => {
    if (!coreSetId) return;

    try {
      const storedGroups = localStorage.getItem(`coreset-${coreSetId}-groups`);
      const storedMapping = localStorage.getItem(`coreset-${coreSetId}-groupMapping`);

      if (storedGroups) {
        setGroups(JSON.parse(storedGroups));
      } else {
        // Initialize with a default "Ungrouped" group
        setGroups([{
          id: "default",
          name: "Ungrouped",
          color: "#64748b", // slate-500
          description: "Default group for unassigned COEs"
        }]);
      }

      if (storedMapping) {
        setGroupMapping(JSON.parse(storedMapping));
      }
    } catch (error) {
      console.error("Error loading groups from localStorage:", error);
    }
  }, [coreSetId]);

  // Save to localStorage when groups or mappings change
  useEffect(() => {
    if (!coreSetId) return;

    try {
      localStorage.setItem(`coreset-${coreSetId}-groups`, JSON.stringify(groups));
      localStorage.setItem(`coreset-${coreSetId}-groupMapping`, JSON.stringify(groupMapping));
    } catch (error) {
      console.error("Error saving groups to localStorage:", error);
    }
  }, [coreSetId, groups, groupMapping]);

  const addGroup = useCallback((name: string, color: string, description?: string) => {
    const newGroup: GroupData = {
      id: nanoid(),
      name,
      color,
      description,
      collapsed: false
    };

    setGroups(prev => [...prev, newGroup]);
    
    toast({
      title: "Group created",
      description: `Created group "${name}"`,
    });
    
    return newGroup.id;
  }, [toast]);

  const updateGroup = useCallback((groupId: string, updates: Partial<GroupData>) => {
    setGroups(prev => prev.map(group => 
      group.id === groupId ? { ...group, ...updates } : group
    ));
    
    toast({
      title: "Group updated",
      description: `Updated group settings`,
    });
  }, [toast]);

  const removeGroup = useCallback((groupId: string) => {
    // Don't allow removing the default group
    if (groupId === "default") {
      toast({
        title: "Cannot remove default group",
        description: "The default group cannot be removed",
        variant: "destructive"
      });
      return;
    }
    
    setGroups(prev => prev.filter(group => group.id !== groupId));
    
    // Move all COEs from this group back to default
    setGroupMapping(prev => {
      const newMapping = { ...prev };
      Object.keys(newMapping).forEach(coeId => {
        if (newMapping[coeId] === groupId) {
          newMapping[coeId] = "default";
        }
      });
      return newMapping;
    });
    
    toast({
      title: "Group removed",
      description: "Group has been removed and COEs moved to default group",
    });
  }, [toast]);

  const assignToGroup = useCallback((coeId: string, groupId: string) => {
    setGroupMapping(prev => ({
      ...prev,
      [coeId]: groupId
    }));
  }, []);

  const assignMultipleToGroup = useCallback((coeIds: string[], groupId: string) => {
    setGroupMapping(prev => {
      const newMapping = { ...prev };
      coeIds.forEach(coeId => {
        newMapping[coeId] = groupId;
      });
      return newMapping;
    });
    
    toast({
      title: "COEs grouped",
      description: `Assigned ${coeIds.length} COEs to group`,
    });
  }, [toast]);

  const removeFromGroup = useCallback((coeId: string) => {
    setGroupMapping(prev => {
      const newMapping = { ...prev };
      delete newMapping[coeId];
      return newMapping;
    });
  }, []);

  const getGroupForCOE = useCallback((coeId: string) => {
    return groupMapping[coeId] || "default";
  }, [groupMapping]);

  const getCOEsInGroup = useCallback((groupId: string, coes: any[]) => {
    if (groupId === "default") {
      // For the default group, return COEs that aren't explicitly mapped to any group
      return coes.filter(coe => !groupMapping[coe.id] || groupMapping[coe.id] === "default");
    }
    
    // For other groups, return COEs explicitly mapped to this group
    return coes.filter(coe => groupMapping[coe.id] === groupId);
  }, [groupMapping]);

  const toggleGroupCollapse = useCallback((groupId: string) => {
    setGroups(prev => prev.map(group => 
      group.id === groupId ? { ...group, collapsed: !group.collapsed } : group
    ));
  }, []);

  return {
    groups,
    groupMapping,
    addGroup,
    updateGroup,
    removeGroup,
    assignToGroup,
    assignMultipleToGroup,
    removeFromGroup,
    getGroupForCOE,
    getCOEsInGroup,
    toggleGroupCollapse
  };
};
