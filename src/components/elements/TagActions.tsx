
import { Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface TagActionsProps {
  onAddTagClick: () => void;
  onManageTagsClick?: () => void;
}

export function TagActions({ onAddTagClick, onManageTagsClick }: TagActionsProps) {
  return (
    <div className="flex items-center border border-[#FFA130] rounded-md px-3 py-1 flex-shrink-0 bg-[#FFA13010]">
      <Button 
        onClick={onAddTagClick} 
        className="flex items-center gap-2 bg-transparent hover:bg-[#FFA13033] text-[#FFA130] whitespace-nowrap" 
        size="sm" 
        variant="ghost"
      >
        <Plus size={16} />
        Tag
      </Button>
      
      {/* Divider between buttons */}
      <Separator className="mx-2 h-6 bg-[#FFA13030]" orientation="vertical" />
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onManageTagsClick} 
        className="flex items-center justify-center w-9 h-9 flex-shrink-0 text-[#FFA130] hover:bg-[#FFA13033] bg-transparent"
      >
        <Settings size={18} />
      </Button>
    </div>
  );
}
