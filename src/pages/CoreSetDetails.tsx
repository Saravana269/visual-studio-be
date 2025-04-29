import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCOEAssignment } from "@/hooks/useCOEAssignment";
import { useCoreSetDetail } from "@/hooks/useCoreSetDetail";
import { CoreSetDetailHeader } from "@/components/core-set/detail/CoreSetDetailHeader";
import { GroupManagement } from "@/components/core-set/GroupManagement";
import { COESearchControls } from "@/components/core-set/COESearchControls";
import { COEDropZoneList } from "@/components/core-set/COEDropZoneList";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
const CoreSetDetails = () => {
  const navigate = useNavigate();
  const {
    coreSet,
    isLoading: isLoadingCoreSet
  } = useCoreSetDetail();
  const [activeTab, setActiveTab] = useState<string>("assignment");
  const {
    searchQuery,
    setSearchQuery,
    draggedCOE,
    dragOverZone,
    isDragging,
    selectedCOEs,
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
    moveToGroup,
    toggleGroupCollapse
  } = useCOEAssignment(coreSet);
  useEffect(() => {
    if (!isLoadingCoreSet && !coreSet) {
      navigate("/core-set");
    }
  }, [coreSet, isLoadingCoreSet, navigate]);
  if (isLoadingCoreSet) {
    return <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <Button variant="outline" className="gap-2" disabled>
            <ArrowLeft className="h-4 w-4" />
            Back to Core Sets
          </Button>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex justify-between mt-6">
            <Skeleton className="h-32 w-1/3" />
            <Skeleton className="h-32 w-32" />
          </div>
        </div>
      </div>;
  }
  if (!coreSet) {
    return <div className="p-6 text-center">
        <p>Core Set not found. It may have been deleted or you don't have permission to view it.</p>
        <Button className="mt-4" onClick={() => navigate("/core-set")}>
          Go to Core Sets
        </Button>
      </div>;
  }
  return <div className="space-y-6 p-6">
      <div className="flex items-center">
        <Button onClick={() => navigate("/core-set")} variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Core Sets
        </Button>
      </div>
      
      <CoreSetDetailHeader coreSet={coreSet} />
      
      
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        
        
        <TabsContent value="assignment" className="space-y-4 pt-4">
          <COESearchControls searchQuery={searchQuery} onSearchChange={setSearchQuery} selectedCount={selectedCOEs.size} onSelectAll={selectAllVisible} onClearSelection={clearSelection} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {isLoading ? <>
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
              </> : <>
                <COEDropZoneList zone="unassign" title="Available COEs" coes={filteredUnassigned} isOver={dragOverZone === "unassign"} selectedCOEs={selectedCOEs} onDragOver={handleDragOver("unassign")} onDrop={() => handleDrop("unassign")} onSelect={toggleCOESelection} onDragStart={handleDragStart} onDragEnd={handleDragEnd} coreSet={coreSet} refetch={refetch} />
                
                <COEDropZoneList zone="assign" title="Assigned COEs" coes={[]} // Not used when groups are provided
            isOver={dragOverZone === "assign" && !draggedCOE} selectedCOEs={selectedCOEs} onDragOver={handleDragOver("assign")} onDrop={() => handleDrop("assign")} onSelect={toggleCOESelection} onDragStart={handleDragStart} onDragEnd={handleDragEnd} coreSet={coreSet} refetch={refetch}
            // Group related props
            groups={groups} groupedCOEs={groupedAssignedCOEs} onToggleGroupCollapse={toggleGroupCollapse} />
              </>}
          </div>
        </TabsContent>
        
        <TabsContent value="groups" className="space-y-6 pt-4">
          <GroupManagement groups={groups} onAddGroup={addGroup} onUpdateGroup={updateGroup} onRemoveGroup={removeGroup} />
          
          {selectedCOEs.size > 0 && <div className="p-4 border rounded-md bg-muted/20">
              <h3 className="text-sm font-medium mb-2">Move Selected COEs to Group</h3>
              <div className="flex flex-wrap gap-2">
                {groups.map(group => <Button key={group.id} size="sm" variant="outline" className="flex items-center gap-2" style={{
              borderColor: group.color,
              color: group.color
            }} onClick={() => {
              const selectedIds = Array.from(selectedCOEs);
              moveToGroup(selectedIds, group.id);
            }}>
                    <div className="w-2 h-2 rounded-full" style={{
                backgroundColor: group.color
              }} />
                    <span>{group.name}</span>
                  </Button>)}
              </div>
            </div>}
        </TabsContent>
      </Tabs>
    </div>;
};
export default CoreSetDetails;