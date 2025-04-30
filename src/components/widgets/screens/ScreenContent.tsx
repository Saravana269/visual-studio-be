
import { ScreenReviewPanel } from "./ScreenReviewPanel";
import { ScreenDefinePanel } from "./ScreenDefinePanel";
import { ScreenCarouselNav } from "./ScreenCarouselNav";
import { Screen, ScreenFormData } from "@/types/screen";

interface ScreenContentProps {
  screens: Screen[];
  activeScreen: Screen | null;
  activeScreenIndex: number;
  formData: ScreenFormData;
  setFormData: React.Dispatch<React.SetStateAction<ScreenFormData>>;
  onScreenSelect: (screenId: string) => void;
  onAddScreen: () => void;
  onUpdateScreen: (data: ScreenFormData) => void;
  onStepSave: (step: number, data: Partial<ScreenFormData>, createFramework?: boolean) => Promise<boolean>;
  isActionLoading: boolean;
}

export function ScreenContent({
  screens,
  activeScreen,
  activeScreenIndex,
  formData,
  setFormData,
  onScreenSelect,
  onAddScreen,
  onUpdateScreen,
  onStepSave,
  isActionLoading
}: ScreenContentProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Main content - fixed height with row layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-0">
        {/* Left panel */}
        <div className="lg:col-span-2 flex flex-col h-full">
          <ScreenReviewPanel screen={activeScreen} />
        </div>
        
        {/* Right panel */}
        <div className="lg:col-span-3 flex flex-col h-full">
          <ScreenDefinePanel
            totalSteps={4}
            currentStep={activeScreenIndex}
            formData={formData}
            setFormData={setFormData}
            onSave={onUpdateScreen}
            onStepSave={onStepSave}
            isEditing={!!activeScreen}
            isLoading={isActionLoading}
            autosave={false}
          />
        </div>
      </div>

      {/* Bottom navigation - fixed at the bottom */}
      {screens.length > 0 && (
        <div className="mt-6 border-t border-gray-800 pt-4">
          <ScreenCarouselNav
            screens={screens}
            activeScreenId={activeScreen?.id || null}
            onScreenSelect={onScreenSelect}
            onAddScreen={onAddScreen}
          />
        </div>
      )}
    </div>
  );
}
