import { Widget, WidgetFormData } from "@/types/widget";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import TagManager from "@/components/TagManager";
interface WidgetFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: WidgetFormData;
  setFormData: (data: WidgetFormData) => void;
  onSave: () => void;
  mode: "create" | "edit";
}
export function WidgetFormDialog({
  isOpen,
  onOpenChange,
  formData,
  setFormData,
  onSave,
  mode
}: WidgetFormDialogProps) {
  const isCreate = mode === "create";
  return <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{isCreate ? "Create New Widget" : "Edit Widget"}</DialogTitle>
          <DialogDescription>
            {isCreate ? "Add a new widget to your application." : "Make changes to your widget."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="widget-name">Name</Label>
            <Input id="widget-name" value={formData.name} onChange={e => setFormData({
            ...formData,
            name: e.target.value
          })} placeholder="Widget Name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="widget-description">Description</Label>
            <Textarea id="widget-description" value={formData.description} onChange={e => setFormData({
            ...formData,
            description: e.target.value
          })} placeholder="Describe the purpose of this widget" rows={3} />
          </div>
          <div className="grid gap-2">
            
            <TagManager initialTags={formData.tags} onChange={tags => setFormData({
            ...formData,
            tags: tags
          })} entityType="Widget" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave} className="bg-[#9b87f5] hover:bg-[#7E69AB]">
            {isCreate ? "Create Widget" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
}