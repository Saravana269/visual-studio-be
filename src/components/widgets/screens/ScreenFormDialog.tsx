
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScreenFieldEditor } from "./ScreenFieldEditor";
import { ScreenFormData } from "@/types/screen";

interface ScreenFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ScreenFormData;
  setFormData: React.Dispatch<React.SetStateAction<ScreenFormData>>;
  onSave: () => void;
  isLoading: boolean;
  mode: "create" | "edit";
}

export function ScreenFormDialog({
  isOpen,
  onOpenChange,
  formData,
  setFormData,
  onSave,
  isLoading,
  mode
}: ScreenFormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-gray-950 border-gray-800">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create New Screen" : "Edit Screen"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <ScreenFieldEditor formData={formData} setFormData={setFormData} />
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={!formData.name || isLoading}
            className="bg-[#9b87f5] hover:bg-[#7E69AB]"
          >
            {isLoading
              ? "Saving..."
              : mode === "create"
                ? "Create Screen"
                : "Update Screen"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
