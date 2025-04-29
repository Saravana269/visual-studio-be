
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyScreensStateProps {
  onAddScreen: () => void;
}

export function EmptyScreensState({ onAddScreen }: EmptyScreensStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center p-8 max-w-md">
        <h2 className="text-xl font-semibold mb-2">No Screens Found</h2>
        <p className="text-gray-400 mb-6">
          No screens have been added to this widget yet. Get started by creating your first screen.
        </p>
        <Button
          onClick={onAddScreen}
          className="bg-[#9b87f5] hover:bg-[#7E69AB]"
        >
          <Plus size={16} className="mr-2" />
          Create First Screen
        </Button>
      </div>
    </div>
  );
}
