
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { TagSelector } from "@/components/elements/TagSelector";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Edit, X, Save, Plus, Trash2 } from "lucide-react";
import { ElementsAssignment } from "@/components/coe/ElementsAssignment";

interface COE {
  id: string;
  name: string;
  description: string | null;
  tags: string[] | null;
  image_url?: string | null;
  element_count?: number;
}

interface Element {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  coe_ids: string[] | null;
  primary_tag_id?: string | null;
}

interface COESidebarProps {
  isOpen: boolean;
  onClose: () => void;
  coe: COE | null;
  onUpdate: () => void;
  onSave: (updatedCOE: COE) => void;
}

const COESidebar = ({ isOpen, onClose, coe, onUpdate, onSave }: COESidebarProps) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    description: string | null;
    tags: string[] | null;
  }>({
    name: "",
    description: "",
    tags: [],
  });
  
  // Reset form and edit mode when sidebar opens/closes
  useEffect(() => {
    if (isOpen && coe) {
      setFormData({
        name: coe.name,
        description: coe.description,
        tags: coe.tags,
      });
    }
    setEditMode(false);
  }, [isOpen, coe]);
  
  // Fetch elements assigned to this COE
  const { data: assignedElements = [], refetch: refetchElements } = useQuery({
    queryKey: ["coe-elements", coe?.id],
    queryFn: async () => {
      if (!coe?.id) return [];
      
      const { data, error } = await supabase
        .from("elements")
        .select("*")
        .contains("coe_ids", [coe.id]);
      
      if (error) {
        console.error("Error fetching assigned elements:", error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!coe?.id
  });
  
  const handleSave = () => {
    if (coe && formData.name.trim()) {
      onSave({
        ...coe,
        name: formData.name,
        description: formData.description,
        tags: formData.tags,
      });
      setEditMode(false);
    }
  };
  
  const handleRemoveElement = async (elementId: string) => {
    if (!coe?.id) return;
    
    try {
      // Get current element data
      const { data: elementData, error: getError } = await supabase
        .from("elements")
        .select("coe_ids")
        .eq("id", elementId)
        .single();
      
      if (getError || !elementData) {
        console.error("Error getting element:", getError);
        return;
      }
      
      // Remove current COE id from the list
      const updatedCoeIds = (elementData.coe_ids || []).filter(id => id !== coe.id);
      
      // Update the element
      const { error: updateError } = await supabase
        .from("elements")
        .update({ coe_ids: updatedCoeIds })
        .eq("id", elementId);
      
      if (updateError) {
        console.error("Error updating element:", updateError);
        return;
      }
      
      // Refetch assigned elements
      refetchElements();
    } catch (error) {
      console.error("Error removing element:", error);
    }
  };
  
  if (!coe) return null;
  
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md w-[90vw] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex justify-between items-center">
            {editMode ? (
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="font-semibold"
              />
            ) : (
              <span>{coe.name}</span>
            )}
            <div className="flex gap-2">
              {editMode ? (
                <>
                  <Button size="sm" variant="ghost" onClick={() => setEditMode(false)}>
                    <X size={16} />
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    <Save size={16} />
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="ghost" onClick={() => setEditMode(true)}>
                  <Edit size={16} />
                </Button>
              )}
            </div>
          </SheetTitle>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Description</h3>
            {editMode ? (
              <Textarea
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter a description"
                rows={3}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                {coe.description || "No description provided."}
              </p>
            )}
          </div>
          
          {/* Tags */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Tags</h3>
            {editMode ? (
              <TagSelector
                value={formData.tags}
                onChange={(tags) => setFormData({ ...formData, tags })}
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {coe.tags && coe.tags.length > 0 ? (
                  coe.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No tags.</p>
                )}
              </div>
            )}
          </div>
          
          {/* Elements Assignment */}
          <ElementsAssignment coeId={coe.id} onAssignmentChange={refetchElements} />
          
          {/* Assigned Elements */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Assigned Elements ({assignedElements.length})</h3>
            </div>
            
            {assignedElements.length > 0 ? (
              <div className="space-y-3">
                {assignedElements.map((element) => (
                  <Card key={element.id} className="overflow-hidden">
                    <div className="flex">
                      {element.image_url && (
                        <div className="w-16 h-16 bg-muted flex-shrink-0">
                          <img 
                            src={element.image_url} 
                            alt={element.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 p-3">
                        <h4 className="font-medium text-sm">{element.name}</h4>
                        <CardDescription className="text-xs line-clamp-1">
                          {element.description || "No description"}
                        </CardDescription>
                        
                        {element.primary_tag_id && (
                          <div className="mt-1">
                            <Badge variant="outline" className="text-xs">
                              Has tag
                            </Badge>
                          </div>
                        )}
                      </div>
                      <CardFooter className="p-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleRemoveElement(element.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </CardFooter>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border rounded-md bg-card">
                <p className="text-sm text-muted-foreground">No elements assigned</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Use the drag and drop interface above to assign elements
                </p>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default COESidebar;
