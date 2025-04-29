
import { Button } from "@/components/ui/button";

interface DeleteScreenDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export function DeleteScreenDialog({
  isOpen,
  isLoading,
  onClose,
  onDelete
}: DeleteScreenDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full border border-gray-800">
        <h3 className="text-xl font-semibold mb-4">Delete Screen</h3>
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete this screen? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={onDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete Screen"}
          </Button>
        </div>
      </div>
    </div>
  );
}
