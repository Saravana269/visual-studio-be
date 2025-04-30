
import { Screen } from "@/types/screen";
import { MultipleOptionsContent } from "./MultipleOptionsContent";
import { RadioButtonContent } from "./RadioButtonContent";
import { YesNoContent } from "./YesNoContent";
import { SliderContent } from "./SliderContent";
import { InformationContent } from "./InformationContent";
import { ImageUploadContent } from "./ImageUploadContent";
import { COEManagerContent } from "./COEManagerContent";
import { useToast } from "@/hooks/use-toast";

interface FrameworkContentRendererProps {
  screen: Screen;
}

export function FrameworkContentRenderer({ screen }: FrameworkContentRendererProps) {
  const metadata = screen.metadata || {};
  const { toast } = useToast();
  
  // Handle connection of framework values in the review panel
  const handleConnect = (value: any, context?: string) => {
    toast({
      title: "Connection Initiated",
      description: `Connecting ${context || value} from ${screen.framework_type}`,
    });
    
    // In the future, this will handle the actual connection logic
    console.log("Connect (Review):", { frameworkType: screen.framework_type, value, context });
  };
  
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
      return <MultipleOptionsContent 
        metadata={metadata} 
        onConnect={(option, index) => handleConnect(option, `option_${index}`)} 
      />;
      
    case "Radio Button":
      return <RadioButtonContent 
        metadata={metadata} 
        onConnect={(option, index) => handleConnect(option, `option_${index}`)} 
      />;
      
    case "Yes / No":
      return <YesNoContent 
        onConnect={(option) => handleConnect(option, `${option}_option`)} 
      />;
      
    case "Slider":
      return <SliderContent 
        metadata={metadata} 
        onConnect={(value, type) => handleConnect(value, `${type}_value`)} 
      />;
      
    case "Information":
      return <InformationContent 
        metadata={metadata} 
        onConnect={(text) => handleConnect(text, 'info_text')} 
      />;
      
    case "Image Upload":
      return <ImageUploadContent 
        metadata={metadata} 
        onConnect={(url) => handleConnect(url, 'image_url')} 
      />;
      
    case "COE Manager":
      return <COEManagerContent 
        metadata={metadata} 
        onConnect={(coeId) => handleConnect(coeId, 'coe_id')} 
      />;
      
    default:
      return (
        <div className="p-4 mt-4 border border-dashed border-gray-600 rounded bg-black/20">
          <p className="text-gray-500 text-center">Preview for {screen.framework_type}</p>
        </div>
      );
  }
}
