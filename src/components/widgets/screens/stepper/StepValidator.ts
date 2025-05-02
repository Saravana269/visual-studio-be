
import { ScreenFormData } from "@/types/screen";

export interface ValidationError {
  field: string;
  message: string;
}

export function validateStep(step: number, formData: ScreenFormData): ValidationError[] {
  const errors: ValidationError[] = [];
  
  switch (step) {
    case 1: // Screen Name
      if (!formData.name?.trim()) {
        errors.push({
          field: "name",
          message: "Screen name is required"
        });
      }
      break;
      
    case 2: // Description
      if (!formData.description?.trim()) {
        errors.push({
          field: "description",
          message: "Description is required"
        });
      }
      break;
      
    case 3: // Framework Type
      // For COE Manager, require a selected COE
      if (formData.framework_type === "COE Manager" && !formData.metadata?.coe_id) {
        errors.push({
          field: "coe_id",
          message: "Please select a class of elements"
        });
      }
      break;

    case 4: // Output
      // No validation needed for the output step
      break;
  }
  
  return errors;
}
