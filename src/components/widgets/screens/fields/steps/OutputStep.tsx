
import { ScreenFormData } from "@/types/screen";
import { NoFrameworkSelected } from "./output/NoFrameworkSelected";
import { FrameworkTypeHeader } from "./output/FrameworkTypeHeader";
import { OptionsFramework } from "./output/OptionsFramework";
import { SliderFramework } from "./output/SliderFramework";
import { YesNoFramework } from "./output/YesNoFramework";
import { InformationFramework } from "./output/InformationFramework";
import { ImageUploadFramework } from "./output/ImageUploadFramework";
import { COEManagerFramework } from "./output/COEManagerFramework";
import { FrameworkPreviewContainer } from "./output/FrameworkPreviewContainer";

interface OutputStepProps {
  frameworkType: string | null;
  metadata: Record<string, any>;
  onConnect?: (frameworkType: string, value: any, context?: string) => void;
}

export function OutputStep({ frameworkType, metadata, onConnect }: OutputStepProps) {
  // Handle connect button click
  const handleConnect = (value: any, context?: string) => {
    if (onConnect && frameworkType) {
      onConnect(frameworkType, value, context);
    }
  };

  // If no framework type is selected
  if (!frameworkType) {
    return <NoFrameworkSelected />;
  }

  // Render framework content based on type
  const renderFrameworkContent = () => {
    switch (frameworkType) {
      case "Multiple Options":
      case "Radio Button":
        return (
          <OptionsFramework 
            options={metadata.options || []} 
            onConnect={handleConnect} 
          />
        );
      
      case "Slider":
        return (
          <SliderFramework
            min={metadata.min}
            max={metadata.max}
            step={metadata.step}
            onConnect={handleConnect}
          />
        );
      
      case "Yes / No":
        return (
          <YesNoFramework
            value={metadata.value}
            onConnect={handleConnect}
          />
        );
      
      case "Information":
        return (
          <InformationFramework
            text={metadata.text}
            onConnect={handleConnect}
          />
        );
      
      case "Image Upload":
        return (
          <ImageUploadFramework
            imageUrl={metadata.image_url}
            onConnect={handleConnect}
          />
        );
      
      case "COE Manager":
        return (
          <COEManagerFramework
            coeId={metadata.coe_id}
            onConnect={handleConnect}
          />
        );
      
      default:
        return (
          <p className="text-gray-500">No specific configuration for this framework type.</p>
        );
    }
  };

  return (
    <div className="space-y-4">
      <FrameworkPreviewContainer>
        <FrameworkTypeHeader frameworkType={frameworkType} />
        {renderFrameworkContent()}
      </FrameworkPreviewContainer>
    </div>
  );
}
