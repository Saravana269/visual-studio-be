
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface COE {
  id: string;
  name: string;
  description: string | null;
  image_url?: string | null;
  tags: string[] | null;
  primary_tag_id: string | null;
  element_count?: number;
}

interface COEListProps {
  coes: COE[];
  onEdit: (coe: COE) => void;
  onAssignTag?: (coe: COE) => void;
}

const COEList = ({ coes, onEdit, onAssignTag }: COEListProps) => {
  const navigate = useNavigate();

  // Fetch tag details for all primary tags
  const { data: tagDetails = {} } = useQuery({
    queryKey: ["coe-tag-details"],
    queryFn: async () => {
      try {
        // Create a list of all primary tag IDs
        const tagIds = coes
          .map(coe => coe.primary_tag_id)
          .filter((id): id is string => !!id);

        if (tagIds.length === 0) return {};

        const { data, error } = await supabase
          .from("tags")
          .select("id, label")
          .in("id", tagIds);

        if (error) {
          console.error("Error fetching tag details:", error);
          return {};
        }

        // Convert to a map for easy lookup
        return data.reduce((acc: Record<string, string>, tag) => {
          acc[tag.id] = tag.label;
          return acc;
        }, {});
      } catch (error) {
        console.error("Error fetching tag details:", error);
        return {};
      }
    },
    enabled: coes.some(coe => !!coe.primary_tag_id)
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {coes.map(coe => (
        <Card 
          key={coe.id} 
          className="element-card relative flex flex-col overflow-hidden cursor-pointer cyberpunk-card"
          onClick={() => navigate(`/coe/${coe.id}`)}
        >
          <div className="absolute top-2 left-2 z-10">
            <Badge variant="secondary" className="element-count-badge rounded-sm bg-orange-400">
              {coe.element_count || 0} Elements
            </Badge>
          </div>
          
          <div className="absolute top-2 right-2 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="action-menu-button">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem onClick={e => {
                  e.stopPropagation();
                  onEdit(coe);
                }}>
                  Edit
                </DropdownMenuItem>
                {onAssignTag && (
                  <DropdownMenuItem onClick={e => {
                    e.stopPropagation();
                    onAssignTag(coe);
                  }}>
                    Assign Tag
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={e => {
                  e.stopPropagation();
                  navigate(`/coe/${coe.id}`);
                }}>
                  View Details
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="h-32 bg-muted flex items-center justify-center overflow-hidden">
            {coe.image_url ? <img src={coe.image_url} alt={coe.name} className="w-full h-full object-cover" /> : <div className="text-muted-foreground text-sm">No image</div>}
          </div>
          
          <CardHeader className="pb-2 p-3">
            <h3 className="font-semibold text-base">{coe.name}</h3>
            {coe.description && <p className="text-xs text-muted-foreground line-clamp-2">
                {coe.description}
              </p>}
          </CardHeader>
          
          <CardContent className="pb-2 p-3 flex-1">
            {/* Primary Tag */}
            {coe.primary_tag_id && tagDetails[coe.primary_tag_id] && (
              <Badge variant="secondary" className="mb-2 bg-blue-100">
                {tagDetails[coe.primary_tag_id]}
              </Badge>
            )}
            
            {/* Additional Tags */}
            {coe.tags && coe.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {coe.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="tag-badge">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      
      {coes.length === 0 && (
        <div className="col-span-full flex justify-center items-center py-12 text-muted-foreground">
          No COEs found
        </div>
      )}
    </div>
  );
};

export default COEList;
