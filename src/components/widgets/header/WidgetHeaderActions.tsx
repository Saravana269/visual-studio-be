
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface WidgetHeaderActionsProps {
  onCreateClick: () => void;
}

export function WidgetHeaderActions({ onCreateClick }: WidgetHeaderActionsProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Widget Manager</h1>
      <Button 
        onClick={onCreateClick}
        className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
      >
        <Plus size={16} className="mr-2" /> New Widget
      </Button>
    </div>
  );
}
