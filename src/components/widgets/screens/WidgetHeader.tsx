
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Widget } from "@/types/widget";

interface WidgetHeaderProps {
  widget: Widget | null;
  isLoading: boolean;
  onBack: () => void;
  onDelete: () => void;
  onAddScreen: () => void;
  hasActiveScreen: boolean;
}

export function WidgetHeader({
  widget,
  isLoading,
  onBack,
  onDelete,
  onAddScreen,
  hasActiveScreen
}: WidgetHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Widgets
        </Button>
        
        {isLoading ? (
          <Skeleton className="h-8 w-48" />
        ) : (
          <div>
            <h1 className="text-2xl font-bold">{widget?.name}</h1>
            {widget?.description && (
              <p className="text-sm text-gray-400">{widget.description}</p>
            )}
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        {hasActiveScreen && (
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="text-red-500 border-red-500 hover:bg-red-500/10"
          >
            <Trash2 size={16} className="mr-2" />
            Delete Screen
          </Button>
        )}
        <Button
          onClick={onAddScreen}
          className="bg-[#9b87f5] hover:bg-[#7E69AB]"
        >
          <Plus size={16} className="mr-2" />
          Add Screen
        </Button>
      </div>
    </div>
  );
}
