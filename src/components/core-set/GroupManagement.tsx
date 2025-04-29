
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { GroupData } from "@/types/group";
import { generateRandomColor } from "@/lib/utils";
import { Plus, Edit2, Trash2, MoveVertical } from "lucide-react";

interface GroupManagementProps {
  groups: GroupData[];
  onAddGroup: (name: string, color: string, description?: string) => string;
  onUpdateGroup: (groupId: string, updates: Partial<GroupData>) => void;
  onRemoveGroup: (groupId: string) => void;
  onReorderGroups?: (groups: GroupData[]) => void;
}

export function GroupManagement({ 
  groups,
  onAddGroup,
  onUpdateGroup,
  onRemoveGroup,
  onReorderGroups
}: GroupManagementProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupData | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    color: generateRandomColor(),
    description: "",
  });
  
  const handleCreate = () => {
    if (!formData.name.trim()) return;
    
    onAddGroup(formData.name, formData.color, formData.description || undefined);
    setFormData({ name: "", color: generateRandomColor(), description: "" });
    setIsCreateDialogOpen(false);
  };
  
  const handleUpdate = () => {
    if (!editingGroup || !formData.name.trim()) return;
    
    onUpdateGroup(editingGroup.id, {
      name: formData.name,
      color: formData.color,
      description: formData.description || undefined
    });
    
    setEditingGroup(null);
    setFormData({ name: "", color: generateRandomColor(), description: "" });
  };
  
  const handleStartEdit = (group: GroupData) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      color: group.color,
      description: group.description || ""
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Groups</h3>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span>Add Group</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Group</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="group-name">Name</Label>
                <Input
                  id="group-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Group name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="group-color">Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="group-color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-8 h-8 p-0 border rounded cursor-pointer"
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="#RRGGBB"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="group-description">Description (Optional)</Label>
                <Textarea
                  id="group-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Group description"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={!formData.name.trim()}>
                Create Group
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-2">
        {groups.map((group) => (
          <div 
            key={group.id}
            className="flex items-center justify-between p-2 border rounded-md"
            style={{ 
              borderLeftWidth: "4px", 
              borderLeftColor: group.color 
            }}
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: group.color }}
              />
              <span className="font-medium">{group.name}</span>
              {group.description && (
                <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                  {group.description}
                </span>
              )}
            </div>
            
            <div className="flex items-center">
              {/* Edit Group */}
              <Dialog open={editingGroup?.id === group.id} onOpenChange={(open) => !open && setEditingGroup(null)}>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={() => handleStartEdit(group)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit Group</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-group-name">Name</Label>
                      <Input
                        id="edit-group-name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Group name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-group-color">Color</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          id="edit-group-color"
                          value={formData.color}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                          className="w-8 h-8 p-0 border rounded cursor-pointer"
                        />
                        <Input
                          value={formData.color}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                          placeholder="#RRGGBB"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-group-description">Description (Optional)</Label>
                      <Textarea
                        id="edit-group-description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Group description"
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEditingGroup(null)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpdate} disabled={!formData.name.trim()}>
                      Update Group
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              {/* Don't allow deleting the default group */}
              {group.id !== "default" && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-destructive hover:text-destructive h-8 w-8 p-0" 
                  onClick={() => onRemoveGroup(group.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
