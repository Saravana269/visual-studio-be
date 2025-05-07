
import { ScreenNameStep } from "./ScreenNameStep";
import { DescriptionStep } from "./DescriptionStep";
import { FrameworkTypeStep } from "./FrameworkTypeStep";
import { OutputStep } from "./OutputStep";
import { ScreenFormData } from "@/types/screen";

interface StepResolverProps {
  currentStep: number;
  formData: ScreenFormData;
  handleFormChange: (field: keyof ScreenFormData, value: any) => void;
  handleFrameworkChange: (value: string) => void;
  updateMetadata: (key: string, value: any) => void;
  handleConnect: (value: any, context?: string) => void;
  widgetId?: string;
  screenId?: string;
}

export function StepResolver({
  currentStep,
  formData,
  handleFormChange,
  handleFrameworkChange,
  updateMetadata,
  handleConnect,
  widgetId,
  screenId
}: StepResolverProps) {
  switch (currentStep) {
    case 1:
      return <ScreenNameStep 
        name={formData.name || ""}
        onChange={(value) => handleFormChange('name', value)} 
      />;
    case 2:
      return <DescriptionStep
        description={formData.description || ""}
        onChange={(value) => handleFormChange('description', value)}
      />;
    case 3:
      return <FrameworkTypeStep
        frameworkType={formData.framework_type || null}
        onChange={handleFrameworkChange}
      />;
    case 4:
      return (
        <OutputStep
          frameworkType={formData.framework_type || null}
          metadata={formData.metadata || {}}
          onConnect={handleConnect}
          widgetId={widgetId}
          screenId={screenId}
        />
      );
    default:
      return <ScreenNameStep
        name={formData.name || ""}
        onChange={(value) => handleFormChange('name', value)}
      />;
  }
}
