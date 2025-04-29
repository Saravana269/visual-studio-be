
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { MoveHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { GroupManagement } from "@/components/core-set/GroupManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CoreSet } from "@/hooks/useCoreSetData";
import { useCOEAssignment } from "@/hooks/useCOEAssignment";
import { COESearchControls } from "./COESearchControls";
import { COEDropZoneList } from "./COEDropZoneList";
import { useNavigate } from "react-router-dom";

interface CoreSetCOEAssignmentProps {
  coreSet: CoreSet | null;
  open: boolean;
  onClose: () => void;
}

export const CoreSetCOEAssignment = ({ coreSet, open, onClose }: CoreSetCOEAssignmentProps) => {
  const navigate = useNavigate();
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
    // If the component is opened and we have a valid coreSet, redirect to the full page view
    if (open && coreSet?.id) {
      navigate(`/core-set/${coreSet.id}/assignment`);
      onClose();
    }

    if (!open) {
      clearSelection();
      setSearchQuery("");
    }
  }, [open, coreSet?.id, navigate, onClose, clearSelection, setSearchQuery]);
  
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>Assign COEs to {coreSet?.name || "Core Set"}</SheetTitle>
          <SheetDescription>
            Drag and drop COEs to assign them to this Core Set. You can also create groups to organize your COEs.
          </SheetDescription>
        </SheetHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="assignment">Assignment</TabsTrigger>
            <TabsTrigger value="groups">Group Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="assignment" className="space-y-4">
            <COESearchControls
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCount={selectedCOEs.size}
              onSelectAll={selectAllVisible}
              onClearSelection={clearSelection}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {isLoading ? (
                <>
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="groups" className="space-y-6">
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
      </SheetContent>
    </Sheet>
  );
}
