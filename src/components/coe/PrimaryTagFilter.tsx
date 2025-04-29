
import { useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PrimaryTagFilterProps {
  selectedTagId: string | null;
  onTagSelect: (tagId: string) => void;
}

const PrimaryTagFilter = ({ selectedTagId, onTagSelect }: PrimaryTagFilterProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const { data: primaryTags = [] } = useQuery({
    queryKey: ["primary-coe-tags"],
    queryFn: async () => {
      try {
        setIsLoading(true);
        const { data: tagsData, error } = await supabase
          .from("tags")
          .select("id, label")
          .eq("entity_type", "COE");
          
        if (error) {
          toast({
            title: "Error fetching primary tags",
            description: error.message,
            variant: "destructive"
          });
          return [];
        }
        
        return tagsData || [];
      } catch (error: any) {
        console.error("Error fetching primary tags:", error);
        return [];
      } finally {
        setIsLoading(false);
      }
    }
  });
  
  if (primaryTags.length === 0 && !isLoading) {
    return null; // Don't show section if no primary tags available
  }

  return (
    <div className="border-t border-b py-3 border-border">
      <div className="flex items-center mb-2">
        <Tag size={16} className="mr-2 text-muted-foreground" />
        <h3 className="text-sm font-medium">Filter by Primary Tag</h3>
      </div>
      
      <ScrollArea className="w-full pb-2">
        <div className="flex items-center gap-2">
          <Badge
            key="all-tags"
            variant={selectedTagId === null ? "default" : "outline"}
            className={`cursor-pointer whitespace-nowrap px-3 py-1 ${
              selectedTagId === null 
                ? "bg-[#FFA130] hover:bg-[#FFA130] text-white" 
                : "hover:border-[#FFA130] hover:text-[#FFA130]"
            }`}
            onClick={() => onTagSelect(selectedTagId === null ? selectedTagId : null)}
          >
            All COEs
          </Badge>
          
          {primaryTags.map((tag) => (
            <Badge
              key={tag.id}
              variant={selectedTagId === tag.id ? "default" : "outline"}
              className={`cursor-pointer whitespace-nowrap px-3 py-1 ${
                selectedTagId === tag.id 
                  ? "bg-[#FFA130] hover:bg-[#FFA130] text-white" 
                  : "hover:border-[#FFA130] hover:text-[#FFA130]"
              }`}
              onClick={() => onTagSelect(tag.id)}
            >
              {tag.label}
            </Badge>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default PrimaryTagFilter;
