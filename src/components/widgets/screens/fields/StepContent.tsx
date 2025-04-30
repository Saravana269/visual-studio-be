
import React from "react";
import { ScreenNameStep } from "./steps/ScreenNameStep";
import { DescriptionStep } from "./steps/DescriptionStep";
import { FrameworkTypeStep } from "./steps/FrameworkTypeStep";
import { OutputStep } from "./steps/OutputStep";
import { ScreenFormData } from "@/types/screen";
import { useStepContentHandlers } from "@/hooks/widgets/useStepContentHandlers";
import { useToast } from "@/hooks/use-toast";

interface StepContentProps {
  currentStep: number;
  formData: ScreenFormData;
  setFormData: React.Dispatch<React.SetStateAction<ScreenFormData>>;
  onSave?: () => void;
  autoSave?: boolean;
}

export function StepContent({
  currentStep, 
  formData, 
  setFormData,
  onSave,
  autoSave = false
}: StepContentProps) {
  const { toast } = useToast();
  
  // Extract handlers to a separate hook
  const { handleFormChange, handleFrameworkChange, updateMetadata } = useStepContentHandlers({
    formData,
    setFormData,
    onSave,
    autoSave
  });

  // Handle connection of framework values
  const handleConnect = (frameworkType: string, value: any, context?: string) => {
    toast({
      title: "Connection Initiated",
      description: `Connecting ${context || value} from ${frameworkType}`,
    });
    
    // In the future, this will handle the actual connection logic
    console.log("Connect:", { frameworkType, value, context });
  };

  // Render appropriate step based on currentStep
  switch (currentStep) {
    case 1:
      return (
        <ScreenNameStep 
          name={formData.name} 
          onChange={(value) => handleFormChange("name", value)} 
        />
      );
    case 2:
      return (
        <DescriptionStep 
          description={formData.description} 
          onChange={(value) => handleFormChange("description", value)} 
        />
      );
    case 3:
      return (
        <FrameworkTypeStep 
          frameworkType={formData.framework_type}
          metadata={formData.metadata || {}}
          onFrameworkChange={handleFrameworkChange}
          onMetadataUpdate={updateMetadata}
        />
      );
    case 4:
      return (
        <OutputStep 
          frameworkType={formData.framework_type}
          metadata={formData.metadata || {}}
          onConnect={handleConnect}
        />
      );
    default:
      return null;
  }
}
