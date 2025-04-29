
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
    description: ""
  });

  const handleCreate = () => {
    if (!formData.name.trim()) return;
    
    onAddGroup(formData.name, formData.color, formData.description || undefined);
    
    setFormData({
      name: "",
      color: generateRandomColor(),
      description: ""
    });
    
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
    setFormData({
      name: "",
      color: generateRandomColor(),
      description: ""
    });
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
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Group Management</h3>
        <Button 
          onClick={() => {
            setFormData({
              name: "",
              color: generateRandomColor(),
              description: ""
            });
            setIsCreateDialogOpen(true);
          }}
          size="sm"
          className="gap-1"
        >
          <Plus size={16} /> Add Group
        </Button>
      </div>
      
      {groups.length === 0 ? (
        <div className="p-8 text-center border rounded-md bg-muted/20">
          <p className="text-muted-foreground mb-4">No groups created yet</p>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            size="sm"
            variant="outline"
          >
            <Plus size={16} className="mr-1" /> Create your first group
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {groups.map(group => (
            <div 
              key={group.id}
              className="flex items-center justify-between p-3 border rounded-md"
              style={{ borderLeft: `4px solid ${group.color}` }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: group.color }}
                ></div>
                <div>
                  <p className="font-medium">{group.name}</p>
                  {group.description && (
                    <p className="text-xs text-muted-foreground">{group.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => handleStartEdit(group)}
                >
                  <Edit2 size={14} />
                </Button>
                {group.id !== "default" && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 hover:text-destructive"
                    onClick={() => onRemoveGroup(group.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Create Group Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create new group</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="group-name">Group Name</Label>
              <Input
                id="group-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter group name"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="group-color">Color</Label>
              <div className="flex gap-2 items-center">
                <div 
                  className="w-8 h-8 rounded-full border"
                  style={{ backgroundColor: formData.color }}
                ></div>
                <Input
                  id="group-color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-16 h-8"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData({ ...formData, color: generateRandomColor() })}
                >
                  Random
                </Button>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="group-description">Description (optional)</Label>
              <Textarea
                id="group-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this group..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleCreate}>
              Create Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Group Dialog */}
      <Dialog open={!!editingGroup} onOpenChange={(open) => !open && setEditingGroup(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit group</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-group-name">Group Name</Label>
              <Input
                id="edit-group-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter group name"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-group-color">Color</Label>
              <div className="flex gap-2 items-center">
                <div 
                  className="w-8 h-8 rounded-full border"
                  style={{ backgroundColor: formData.color }}
                ></div>
                <Input
                  id="edit-group-color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-16 h-8"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData({ ...formData, color: generateRandomColor() })}
                >
                  Random
                </Button>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-group-description">Description (optional)</Label>
              <Textarea
                id="edit-group-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this group..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditingGroup(null)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleUpdate}>
              Update Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
