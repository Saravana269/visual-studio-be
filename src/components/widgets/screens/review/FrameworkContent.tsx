import { Screen } from "@/types/screen";
import { Badge } from "@/components/ui/badge";
import { FrameworkContentRenderer } from "./FrameworkContentRenderer";

interface FrameworkContentProps {
  screen: Screen;
}

export function FrameworkContent({ screen }: FrameworkContentProps) {
  const metadata = screen.metadata || {};
  const frameworkType = screen.framework_type || "Not specified";

  return (
    <>
      {screen.framework_type && (
        <div className="mb-3">
          <Badge className="bg-[#00FF00]/20 text-[#00FF00] border-[#00FF00]/30">
            {frameworkType}
          </Badge>
        </div>
      )}
      
      <h3 className="text-xl font-semibold mb-2">{screen.name}</h3>
      
      {screen.description && (
        <p className="text-gray-400 mb-4">{screen.description}</p>
      )}
      
      {/* Render framework-specific content */}
      <FrameworkContentRenderer screen={screen} />
      
      {(!screen.framework_type && (!metadata || Object.keys(metadata).length === 0)) && (
        <div className="text-gray-500 text-center py-8">
          <p>No content has been added to this screen.</p>
          <p className="mt-2">Edit in the define area to add content.</p>
        </div>
      )}
    </>
  );
}
