
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [newTag, setNewTag] = useState("");
  const { toast } = useToast();

  const { data: tags, isLoading, refetch } = useQuery({
    queryKey: ["global-tags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("elements")
        .select("tags")
        .not("tags", "is", null);
      
      if (error) {
        toast({
          title: "Error fetching tags",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      
      // Extract all tags and remove duplicates
      const allTags = data.flatMap(item => item.tags || []);
      return [...new Set(allTags)].sort();
    }
  });

  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    
    toast({
      title: "Feature coming soon",
      description: "Adding global tags will be available in a future update.",
    });
    
    setNewTag("");
  };

  const handleDeleteTag = async (tag: string) => {
    toast({
      title: "Feature coming soon",
      description: "Deleting global tags will be available in a future update.",
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Tag Management</CardTitle>
          <CardDescription>
            Manage global tags that can be used across all modules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2 items-center">
              <Input 
                placeholder="Add new tag..." 
                value={newTag} 
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddTag();
                  }
                }}
                className="flex-1"
              />
              <Button onClick={handleAddTag}>
                <Plus size={16} className="mr-1" /> Add Tag
              </Button>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 mt-4">
                {tags && tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="px-2 py-1 flex items-center gap-1">
                    {tag}
                    <X 
                      size={14} 
                      className="cursor-pointer" 
                      onClick={() => handleDeleteTag(tag)} 
                    />
                  </Badge>
                ))}
                {!tags?.length && (
                  <p className="text-muted-foreground text-sm">No tags available</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Additional Settings</CardTitle>
          <CardDescription>More settings will be available soon</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Additional configuration options will be added in future updates.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
