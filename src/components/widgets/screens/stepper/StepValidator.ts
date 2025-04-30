
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
      // Framework type is optional
      break;

    case 4: // Output
      // No validation needed for the output step
      break;
  }
  
  return errors;
}
