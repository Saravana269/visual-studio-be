
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ElementsAssignment } from "@/components/coe/ElementsAssignment";
import { useQueryClient } from "@tanstack/react-query";
import { useCOEDetail } from "@/hooks/coe/useCOEDetail";
import { COEDetailHeader } from "@/components/coe/detail/COEDetailHeader";
import { AssignedElementsList } from "@/components/coe/detail/AssignedElementsList";

const COEDetailView = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { coe, tagDetail, assignedElements, isCOELoading, id } = useCOEDetail();

  // Add this function to handle assignment changes
  const handleAssignmentChange = () => {
    // Refetch elements data when assignments change
    queryClient.invalidateQueries({ queryKey: ["coe-elements", id] });
  };

  if (isCOELoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00B86B]" />
      </div>
    );
  }

  if (!coe) {
    return (
      <div className="p-6">
        <Button onClick={() => navigate("/coe")} variant="outline" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to COE List
        </Button>
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold mb-2">COE Not Found</h2>
          <p className="text-muted-foreground">The requested COE could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Button onClick={() => navigate("/coe")} variant="outline" className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to COE List
      </Button>

      <div className="space-y-6">
        <COEDetailHeader coe={coe} tagDetail={tagDetail} />

        {/* Elements Assignment Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Element Assignment</h3>
          <ElementsAssignment coeId={coe.id} onAssignmentChange={handleAssignmentChange} />
        </div>

        {/* Assigned Elements Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Assigned Elements ({assignedElements.length})
          </h3>
          <AssignedElementsList assignedElements={assignedElements} />
        </div>
      </div>
    </div>
  );
};

export default COEDetailView;
