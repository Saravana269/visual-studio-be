
import { useState } from "react";
import { Widget, WidgetFormData } from "@/types/widget";

export function useWidgetState() {
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Dialog state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Selected widget and form data
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
  const [widgetFormData, setWidgetFormData] = useState<WidgetFormData>({
    name: "",
    description: "",
    tags: []
  });

  return {
    // Search and filter state
    searchQuery,
    setSearchQuery,
    selectedTagIds,
    setSelectedTagIds,
    viewMode,
    setViewMode,
    
    // Dialog state
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    
    // Selected widget and form data
    selectedWidget,
    setSelectedWidget,
    widgetFormData,
    setWidgetFormData
  };
}
