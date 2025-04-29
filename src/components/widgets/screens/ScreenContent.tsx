
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
  isActionLoading
}: ScreenContentProps) {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Main content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-0">
        {/* Left panel */}
        <div className="lg:col-span-2 h-full">
          <ScreenReviewPanel screen={activeScreen} />
        </div>
        
        {/* Right panel */}
        <div className="lg:col-span-3 h-full">
          <ScreenDefinePanel
            totalSteps={4} // Fixed at 4 steps as per requirement
            currentStep={activeScreenIndex}
            formData={formData}
            setFormData={setFormData}
            onSave={onUpdateScreen}
            isEditing={!!activeScreen}
            isLoading={isActionLoading}
            autosave={true}
          />
        </div>
      </div>

      {/* Bottom navigation */}
      {screens.length > 0 && (
        <div className="mt-6">
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
