
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { CoreSet } from "@/hooks/useCoreSetData";
import { useCOEAssignment } from "@/hooks/useCOEAssignment";
import { COESearchControls } from "@/components/core-set/COESearchControls";
import { COEDropZoneList } from "@/components/core-set/COEDropZoneList";
import { MoveHorizontal } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const CoreSetAssignment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: coreSet, isLoading: coreSetLoading } = useQuery({
    queryKey: ["core-set", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("core_sets")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        toast({
          title: "Error fetching Core Set",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }

      return data as CoreSet;
    },
  });

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
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    toggleCOESelection,
    selectAllVisible,
    clearSelection,
    refetch
  } = useCOEAssignment(coreSet);

  if (coreSetLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00B86B]" />
        </div>
      </div>
    );
  }

  if (!coreSet) {
    return (
      <div className="p-6">
        <Button onClick={() => navigate("/core-set")} variant="outline" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Core Set List
        </Button>
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold mb-2">Core Set Not Found</h2>
          <p className="text-muted-foreground">The requested Core Set could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Button onClick={() => navigate("/core-set")} variant="outline" className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Core Set List
      </Button>

      <div className="space-y-6">
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{coreSet.name}</h1>
          {coreSet.description && (
            <p className="text-muted-foreground mb-2">{coreSet.description}</p>
          )}
          <Separator className="my-4" />
        </div>

        {/* COE Assignment Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">COE Assignment</h3>
          <p className="text-muted-foreground">
            Manage which Class of Elements (COEs) belong to this Core Set
          </p>
          
          <div className="space-y-4 mt-6">
            <COESearchControls
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCount={selectedCOEs.size}
              onSelectAll={selectAllVisible}
              onClearSelection={clearSelection}
            />
            
            {isDragging && (
              <div className="flex items-center justify-center p-3 mb-2 bg-primary/10 rounded-md animate-pulse border border-primary/30">
                <MoveHorizontal className="mr-2 h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Drag to {dragOverZone || ""}</span>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isLoading ? (
                <>
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </>
              ) : (
                <>
                  <COEDropZoneList
                    zone="unassign"
                    title={`Available COEs (${filteredUnassigned.length})`}
                    coes={filteredUnassigned}
                    isOver={dragOverZone === "unassign"}
                    selectedCOEs={selectedCOEs}
                    onDragOver={(e) => {
                      e.preventDefault();
                      handleDragOver("unassign")(e);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleDrop("unassign");
                    }}
                    onSelect={toggleCOESelection}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    refetch={refetch}
                  />
                  
                  <COEDropZoneList
                    zone="assign"
                    title={`Assigned to Core Set (${assignedCOEs.length})`}
                    coes={assignedCOEs}
                    isOver={dragOverZone === "assign"}
                    selectedCOEs={selectedCOEs}
                    onDragOver={(e) => {
                      e.preventDefault();
                      handleDragOver("assign")(e);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleDrop("assign");
                    }}
                    coreSet={coreSet}
                    refetch={refetch}
                  />
                </>
              )}
            </div>
            
            {selectedCOEs.size > 0 && !isDragging && (
              <div className="flex justify-end">
                <Button 
                  size="sm"
                  className="animate-in fade-in slide-in-from-bottom-2"
                  onClick={() => handleDrop("assign")}
                >
                  Assign {selectedCOEs.size} Selected
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoreSetAssignment;
