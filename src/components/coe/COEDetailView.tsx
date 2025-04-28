
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { ElementsAssignment } from "@/components/coe/ElementsAssignment";
import { useToast } from "@/hooks/use-toast";
import type { COE } from "@/hooks/useCOEData";

const COEDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: coe, isLoading } = useQuery({
    queryKey: ["coe", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("class_of_elements")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        toast({
          title: "Error fetching COE",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }

      return data as COE;
    },
  });

  const { data: assignedElements = [] } = useQuery({
    queryKey: ["coe-elements", id],
    queryFn: async () => {
      if (!id) return [];
      
      const { data, error } = await supabase
        .from("elements")
        .select("*")
        .contains("coe_ids", [id]);
      
      if (error) {
        console.error("Error fetching assigned elements:", error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!id
  });

  // Add this function to handle assignment changes
  const handleAssignmentChange = () => {
    // Refetch elements data when assignments change
    queryClient.invalidateQueries({ queryKey: ["coe-elements", id] });
  };

  if (isLoading) {
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
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{coe.name}</h1>
            {coe.description && (
              <p className="text-muted-foreground">{coe.description}</p>
            )}
          </div>
          {coe.image_url && (
            <img 
              src={coe.image_url} 
              alt={coe.name}
              className="w-32 h-32 object-cover rounded-lg"
            />
          )}
        </div>

        {/* Tags Section */}
        {coe.tags && coe.tags.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {coe.tags.map(tag => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignedElements.map((element) => (
              <Card key={element.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {element.image_url && (
                      <img 
                        src={element.image_url} 
                        alt={element.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div>
                      <h4 className="font-medium">{element.name}</h4>
                      {element.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {element.description}
                        </p>
                      )}
                      {element.tags && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {element.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {assignedElements.length === 0 && (
              <div className="col-span-full text-center py-8 border rounded-lg bg-muted">
                <p className="text-muted-foreground">No elements assigned yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default COEDetailView;
