
import { Screen } from "@/types/screen";
import { MultipleOptionsContent } from "./MultipleOptionsContent";
import { RadioButtonContent } from "./RadioButtonContent";
import { YesNoContent } from "./YesNoContent";
import { SliderContent } from "./SliderContent";
import { InformationContent } from "./InformationContent";
import { ImageUploadContent } from "./ImageUploadContent";
import { COEManagerContent } from "./COEManagerContent";

interface FrameworkContentRendererProps {
  screen: Screen;
}

export function FrameworkContentRenderer({ screen }: FrameworkContentRendererProps) {
  const metadata = screen.metadata || {};
  
  // If no framework type is specified, show empty state
  if (!screen.framework_type) {
    return (
      <div className="text-gray-500 text-center py-8">
        <p>No framework type selected for this screen.</p>
        <p className="mt-2">Choose a framework type in the define area to add content.</p>
      </div>
    );
  }

  // Render framework-specific content based on the type
  switch (screen.framework_type) {
    case "Multiple Options":
      return <MultipleOptionsContent metadata={metadata} />;
      
    case "Radio Button":
      return <RadioButtonContent metadata={metadata} />;
      
    case "Yes / No":
      return <YesNoContent />;
      
    case "Slider":
      return <SliderContent metadata={metadata} />;
      
    case "Information":
      return <InformationContent metadata={metadata} />;
      
    case "Image Upload":
      return <ImageUploadContent metadata={metadata} />;
      
    case "COE Manager":
      return <COEManagerContent metadata={metadata} />;
      
    default:
      return (
        <div className="p-4 mt-4 border border-dashed border-gray-600 rounded bg-black/20">
          <p className="text-gray-500 text-center">Preview for {screen.framework_type}</p>
        </div>
      );
  }
}
