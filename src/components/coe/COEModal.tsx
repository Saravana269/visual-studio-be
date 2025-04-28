
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface COE {
  id?: string;
  name: string;
  description: string | null;
}

interface COEModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (coe: COE) => void;
  coe: COE | null;
}

const COEModal = ({ isOpen, onClose, onSave, coe }: COEModalProps) => {
  const [formData, setFormData] = useState<COE>({
    name: "",
    description: "",
  });
  
  const [errors, setErrors] = useState<{
    name?: string;
  }>({});
  
  useEffect(() => {
    if (isOpen && coe) {
      setFormData({
        name: coe.name || "",
        description: coe.description || "",
      });
    } else if (isOpen) {
      setFormData({
        name: "",
        description: "",
      });
    }
    
    setErrors({});
  }, [isOpen, coe]);
  
  const handleChange = (field: keyof COE, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{coe ? "Edit" : "Create"} Class of Elements</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter COE name"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter a description"
              rows={4}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {coe ? "Update" : "Create"} COE
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default COEModal;
