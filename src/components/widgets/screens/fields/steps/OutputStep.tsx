
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
import { useParams } from "react-router-dom";

interface OutputStepProps {
  frameworkType: string | null;
  metadata: Record<string, any>;
  onConnect: (value: any, context?: string) => void;
  widgetId?: string;
  screenId?: string;
}

export function OutputStep({ 
  frameworkType, 
  metadata, 
  onConnect, 
  widgetId,
  screenId 
}: OutputStepProps) {
  // Get current widget ID from URL if available
  const { id: urlWidgetId } = useParams<{ id: string }>();
  
  // Use the URL widget ID if the prop is not provided
  const effectiveWidgetId = widgetId || urlWidgetId;
  
  console.log("🖼️ Rendering OutputStep with:", { 
    frameworkType, 
    widgetId: effectiveWidgetId,
    urlWidgetId,
    screenId
  });
  
  if (!frameworkType) {
    return <NoFrameworkSelected />;
  }

  const handleConnect = (value: any, context?: string) => {
    console.log("🔗 OutputStep handleConnect called with:", { 
      value, 
      context, 
      frameworkType, 
      widgetId: effectiveWidgetId 
    });
    
    if (frameworkType) {
      onConnect(value, context);
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
              widgetId={effectiveWidgetId}
              screenId={screenId}
            />
          ) : frameworkType === "Slider" ? (
            <SliderFramework 
              min={metadata?.min} 
              max={metadata?.max} 
              step={metadata?.step} 
              onConnect={handleConnect}
              widgetId={effectiveWidgetId}
            />
          ) : frameworkType === "Information" ? (
            <InformationFramework 
              text={metadata?.text} 
              onConnect={handleConnect}
              widgetId={effectiveWidgetId}
            />
          ) : frameworkType === "Yes / No" ? (
            <YesNoFramework 
              value={metadata?.value} 
              onConnect={handleConnect} 
              widgetId={effectiveWidgetId}
            />
          ) : frameworkType === "Image Upload" ? (
            <ImageUploadFramework 
              imageUrl={metadata?.image_url} 
              onConnect={handleConnect}
              widgetId={effectiveWidgetId}
              screenId={screenId}
            />
          ) : frameworkType === "COE Manager" ? (
            <COEManagerFramework 
              coeId={metadata?.coe_id} 
              onConnect={handleConnect}
              widgetId={effectiveWidgetId}
            />
          ) : (
            <p className="text-gray-400">No preview available for this framework type.</p>
          )}
        </FrameworkPreviewContainer>
      </Card>
    </div>
  );
}
