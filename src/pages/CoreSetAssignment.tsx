
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CoreSetCOEAssignment } from "@/components/core-set/CoreSetCOEAssignment";
import { useToast } from "@/hooks/use-toast";
import type { CoreSet } from "@/hooks/useCoreSetData";

const CoreSetAssignment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: coreSet, isLoading } = useQuery({
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00B86B]" />
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
            <p className="text-muted-foreground">{coreSet.description}</p>
          )}
        </div>

        {/* COE Assignment Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">COE Assignment</h3>
          <CoreSetCOEAssignment
            open={true}
            onClose={() => navigate("/core-set")}
            coreSet={coreSet}
          />
        </div>
      </div>
    </div>
  );
};

export default CoreSetAssignment;
