
import { ScreenFormData } from "@/types/screen";
import { useAutosave } from "@/hooks/widgets/useAutosave";
import { ScreenDefinePanelContent } from "./ScreenDefinePanelContent";

interface ScreenDefinePanelProps {
  totalSteps: number;
  currentStep: number;
  formData: ScreenFormData;
  setFormData: React.Dispatch<React.SetStateAction<ScreenFormData>>;
  onSave: (data: ScreenFormData) => void;
  onStepSave: (step: number, data: Partial<ScreenFormData>, createFramework?: boolean) => Promise<boolean>;
  isEditing: boolean;
  isLoading: boolean;
  autosave?: boolean;
  screenId?: string;
}

export function ScreenDefinePanel({
  totalSteps,
  currentStep,
  formData,
  setFormData,
  onSave,
  onStepSave,
  isEditing,
  isLoading,
  autosave = false,
  screenId
}: ScreenDefinePanelProps) {
  // Steps for the stepper - updated to 4 steps
  const steps = [
    { id: 1, label: "Screen Name" },
    { id: 2, label: "Description" },
    { id: 3, label: "Framework Type" },
    { id: 4, label: "Output" }
  ];

  // Use autosave hook
  const { lastSaved } = useAutosave({
    data: formData,
    onSave,
    enabled: autosave,
    delay: 5000,
    notificationInterval: 10000
  });

  return (
    <div className="h-full overflow-hidden border border-gray-800 rounded-lg flex flex-col">
      <ScreenDefinePanelContent
        steps={steps}
        formData={formData}
        setFormData={setFormData}
        onSave={onSave}
        onStepSave={onStepSave}
        lastSaved={lastSaved}
        isEditing={isEditing}
        isLoading={isLoading}
        autosave={autosave}
        screenId={screenId}
      />
    </div>
  );
}
