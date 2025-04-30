
import { format } from "date-fns";
interface StepperHeaderProps {
  lastSaved: Date | null;
}

export function StepperHeader({ lastSaved }: StepperHeaderProps) {
  return (
    <div className="px-6 py-3 border-b border-gray-800">
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-400">
          {lastSaved && (
            <span>Last saved: {format(lastSaved, "MMM d, yyyy HH:mm")}</span>
          )}
        </div>
      </div>
    </div>
  );
}
