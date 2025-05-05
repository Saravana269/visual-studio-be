
/**
 * Helper function to render metadata preview based on framework type
 */
export function renderMetadataPreview(frameworkType: string | null, metadata: Record<string, any>): string {
  if (!frameworkType || !metadata) return "No metadata";
  
  switch(frameworkType) {
    case "Multiple Options":
    case "Radio Button":
      return `Options: ${(metadata.options || []).join(", ")}`;
    case "Slider":
      return `Range: ${metadata.min || 0} to ${metadata.max || 100}`;
    case "Yes / No":
      return `Default: ${metadata.value === true ? "Yes" : "No"}`;
    case "Information":
      return metadata.text ? `Text available` : "No text";
    case "Image Upload":
      return metadata.image_url ? "Image set" : "No image";
    case "COE Manager":
      return metadata.coe_id ? `COE ID: ${metadata.coe_id}` : "No COE selected";
    default:
      return "Custom metadata";
  }
}
