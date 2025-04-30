
import { Screen } from "@/types/screen";
import { Badge } from "@/components/ui/badge";
import { MultipleOptionsContent } from "./MultipleOptionsContent";
import { RadioButtonContent } from "./RadioButtonContent";
import { YesNoContent } from "./YesNoContent";
import { SliderContent } from "./SliderContent";
import { InformationContent } from "./InformationContent";
import { ImageUploadContent } from "./ImageUploadContent";
import { COEManagerContent } from "./COEManagerContent";

interface FrameworkContentProps {
  screen: Screen;
}

export function FrameworkContent({ screen }: FrameworkContentProps) {
  const metadata = screen.metadata || {};
  const frameworkType = screen.framework_type || "Not specified";

  return (
    <>
      {screen.framework_type && (
        <div className="mb-3">
          <Badge className="bg-[#00FF00]/20 text-[#00FF00] border-[#00FF00]/30">
            {frameworkType}
          </Badge>
        </div>
      )}
      
      <h3 className="text-xl font-semibold mb-2">{screen.name}</h3>
      
      {screen.description && (
        <p className="text-gray-400 mb-4">{screen.description}</p>
      )}
      
      {/* Render framework-specific content */}
      {renderFrameworkContent(screen)}
      
      {(!screen.framework_type && (!metadata || Object.keys(metadata).length === 0)) && (
        <div className="text-gray-500 text-center py-8">
          <p>No content has been added to this screen.</p>
          <p className="mt-2">Edit in the define area to add content.</p>
        </div>
      )}
    </>
  );
}

// Extract framework-specific content rendering to a separate function
function renderFrameworkContent(screen: Screen) {
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
