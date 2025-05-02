
import React from "react";
import { Card } from "@/components/ui/card";
import { FrameworkTypeHeader } from "./output/FrameworkTypeHeader";
import { NoFrameworkSelected } from "./output/NoFrameworkSelected";
import { OptionsFramework } from "./output/OptionsFramework";
import { SliderFramework } from "./output/SliderFramework";
import { InformationFramework } from "./output/InformationFramework";
import { YesNoFramework } from "./output/YesNoFramework";
import { ImageUploadFramework } from "./output/ImageUploadFramework";
import { COEManagerFramework } from "./output/COEManagerFramework";
import { FrameworkPreviewContainer } from "./output/FrameworkPreviewContainer";

interface OutputStepProps {
  frameworkType: string | null;
  metadata: Record<string, any>;
  onConnect: (frameworkType: string, value: any, context?: string) => void;
}

export function OutputStep({ frameworkType, metadata, onConnect }: OutputStepProps) {
  if (!frameworkType) {
    return <NoFrameworkSelected />;
  }

  const handleConnect = (value: any, context?: string) => {
    if (frameworkType) {
      onConnect(frameworkType, value, context);
    }
  };

  return (
    <div className="space-y-4">
      <FrameworkTypeHeader frameworkType={frameworkType} />
      
      <Card className="p-4 border-gray-700 bg-black/20">
        <FrameworkPreviewContainer>
          {frameworkType === "Multiple Options" || frameworkType === "Radio Button" ? (
            <OptionsFramework 
              options={metadata?.options || []} 
              isRadio={frameworkType === "Radio Button"}
              onConnect={handleConnect} 
            />
          ) : frameworkType === "Slider" ? (
            <SliderFramework 
              min={metadata?.min} 
              max={metadata?.max} 
              step={metadata?.step} 
              onConnect={handleConnect} 
            />
          ) : frameworkType === "Information" ? (
            <InformationFramework 
              text={metadata?.text} 
              onConnect={handleConnect} 
            />
          ) : frameworkType === "Yes / No" ? (
            <YesNoFramework 
              value={metadata?.value} 
              onConnect={handleConnect} 
            />
          ) : frameworkType === "Image Upload" ? (
            <ImageUploadFramework 
              imageUrl={metadata?.image_url} 
              onConnect={handleConnect} 
            />
          ) : frameworkType === "COE Manager" ? (
            <COEManagerFramework 
              coeId={metadata?.coe_id} 
              onConnect={handleConnect} 
            />
          ) : (
            <p className="text-gray-400">No preview available for this framework type.</p>
          )}
        </FrameworkPreviewContainer>
      </Card>
    </div>
  );
}
