
import { Button } from "@/components/ui/button";
import { useElementAssignment } from "@/hooks/useElementAssignment";
import { ElementSearchBar } from "./assignment/ElementSearchBar";
import { DropContainer } from "./assignment/DropContainer";

interface ElementsAssignmentProps {
  coeId: string;
  onAssignmentChange: () => void;
}

export const ElementsAssignment = ({ coeId, onAssignmentChange }: ElementsAssignmentProps) => {
  const {
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
  } = useElementAssignment(coeId, onAssignmentChange);
  
  if (isLoading) {
    return <div className="text-center py-4">Loading elements...</div>;
  }
  
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Element Assignment</h3>
      
      <ElementSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCount={selectedElements.size}
        onSelectAll={selectAllVisible}
        onClearSelection={clearSelection}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <DropContainer
          title="Available Elements"
          elements={filteredUnassigned}
          zone="unassign"
          selectedElements={selectedElements}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "unassign")}
          onElementSelect={toggleElementSelection}
          onElementDragStart={handleDragStart}
          onElementDragEnd={handleDragEnd}
        />
        
        <DropContainer
          title="Assigned to COE"
          elements={localAssignedElements}
          zone="assign"
          selectedElements={selectedElements}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "assign")}
          onElementSelect={toggleElementSelection}
          onElementDragStart={handleDragStart}
          onElementDragEnd={handleDragEnd}
        />
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
