
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCOEAssignment } from "@/hooks/useCOEAssignment";
import { useCoreSetData } from "@/hooks/useCoreSetData";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GroupManagement } from "@/components/core-set/GroupManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { COESearchControls } from "@/components/core-set/COESearchControls";
import { COEDropZoneList } from "@/components/core-set/COEDropZoneList";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

const CoreSetAssignment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("assignment");

  const { data: coreSets = [], isLoading: isLoadingCoreSets } = useCoreSetData();
  const coreSet = coreSets.find(cs => cs.id === id) || null;

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
    if (!isLoadingCoreSets && !coreSet) {
      navigate("/core-set");
    }
  }, [coreSet, isLoadingCoreSets, navigate]);

  if (isLoadingCoreSets || !coreSet) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Button onClick={() => navigate("/core-set")} variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Core Sets
        </Button>
        <h1 className="text-2xl font-bold">{coreSet.name}</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="assignment">COE Assignment</TabsTrigger>
          <TabsTrigger value="groups">Group Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="assignment" className="space-y-4 pt-4">
          <COESearchControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCount={selectedCOEs.size}
            onSelectAll={selectAllVisible}
            onClearSelection={clearSelection}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <COEDropZoneList
              zone="unassign"
              title="Available COEs"
              coes={filteredUnassigned}
              isOver={dragOverZone === "unassign"}
              selectedCOEs={selectedCOEs}
              onDragOver={handleDragOver("unassign")}
              onDrop={() => handleDrop("unassign")}
              onSelect={toggleCOESelection}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              coreSet={coreSet}
              refetch={refetch}
            />
            
            <COEDropZoneList
              zone="assign"
              title="Assigned COEs"
              coes={[]} // Not used when groups are provided
              isOver={dragOverZone === "assign" && !draggedCOE}
              selectedCOEs={selectedCOEs}
              onDragOver={handleDragOver("assign")}
              onDrop={() => handleDrop("assign")}
              onSelect={toggleCOESelection}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              coreSet={coreSet}
              refetch={refetch}
              // Group related props
              groups={groups}
              groupedCOEs={groupedAssignedCOEs}
              onToggleGroupCollapse={toggleGroupCollapse}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="groups" className="space-y-6 pt-4">
          <GroupManagement
            groups={groups}
            onAddGroup={addGroup}
            onUpdateGroup={updateGroup}
            onRemoveGroup={removeGroup}
          />
          
          {selectedCOEs.size > 0 && (
            <div className="p-4 border rounded-md bg-muted/20">
              <h3 className="text-sm font-medium mb-2">Move Selected COEs to Group</h3>
              <div className="flex flex-wrap gap-2">
                {groups.map(group => (
                  <Button
                    key={group.id}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                    style={{
                      borderColor: group.color,
                      color: group.color
                    }}
                    onClick={() => {
                      const selectedIds = Array.from(selectedCOEs);
                      moveToGroup(selectedIds, group.id);
                    }}
                  >
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: group.color }}
                    />
                    <span>{group.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CoreSetAssignment;
