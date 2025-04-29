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
  return;
}