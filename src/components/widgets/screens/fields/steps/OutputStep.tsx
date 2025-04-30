
import { ScreenFormData } from "@/types/screen";

interface OutputStepProps {
  frameworkType: string | null;
  metadata: Record<string, any>;
}

export function OutputStep({ frameworkType, metadata }: OutputStepProps) {
  // If no framework type is selected
  if (!frameworkType) {
    return (
      <div className="text-gray-500 text-center py-8">
        <p>No framework type selected for this screen.</p>
        <p className="mt-2">Go back to step 3 to select a framework type.</p>
      </div>
    );
  }

  const renderFrameworkValues = () => {
    switch (frameworkType) {
      case "Multiple Options":
      case "Radio Button":
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Options</h4>
            {metadata.options && metadata.options.length > 0 ? (
              <ul className="space-y-2 pl-5 list-disc">
                {metadata.options.map((option: string, index: number) => (
                  <li key={index} className="text-gray-300">{option}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No options defined</p>
            )}
          </div>
        );
      
      case "Slider":
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Slider Configuration</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 border border-gray-800 rounded-md">
                <p className="text-sm text-gray-400">Min Value</p>
                <p className="text-xl font-medium">{metadata.min || 0}</p>
              </div>
              <div className="p-3 border border-gray-800 rounded-md">
                <p className="text-sm text-gray-400">Max Value</p>
                <p className="text-xl font-medium">{metadata.max || 100}</p>
              </div>
              <div className="p-3 border border-gray-800 rounded-md">
                <p className="text-sm text-gray-400">Step</p>
                <p className="text-xl font-medium">{metadata.step || 1}</p>
              </div>
            </div>
          </div>
        );
      
      case "Yes / No":
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Yes/No Configuration</h4>
            <p>Default value: {metadata.value === null ? 'Not set' : metadata.value ? 'Yes' : 'No'}</p>
          </div>
        );
      
      case "Information":
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Information Content</h4>
            <div className="p-4 border border-gray-800 rounded-md">
              {metadata.text ? (
                <p className="whitespace-pre-wrap">{metadata.text}</p>
              ) : (
                <p className="text-gray-500">No information text provided</p>
              )}
            </div>
          </div>
        );
      
      case "Image Upload":
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Image Upload Configuration</h4>
            {metadata.image_url ? (
              <div className="w-full max-w-md">
                <img 
                  src={metadata.image_url} 
                  alt="Uploaded preview" 
                  className="w-full h-auto border border-gray-800 rounded-md"
                />
              </div>
            ) : (
              <p className="text-gray-500">No default image set</p>
            )}
          </div>
        );
      
      case "COE Manager":
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-medium">COE Configuration</h4>
            <p>COE ID: {metadata.coe_id || 'Not set'}</p>
          </div>
        );
      
      default:
        return (
          <p className="text-gray-500">No specific configuration for this framework type.</p>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Framework Output Preview</h3>
        <div className="p-4 border border-gray-800 rounded-lg bg-gray-950">
          <div className="mb-4">
            <span className="bg-[#00FF00]/20 text-[#00FF00] border border-[#00FF00]/30 px-2 py-1 rounded text-sm">
              {frameworkType}
            </span>
          </div>
          
          {renderFrameworkValues()}
        </div>
      </div>
    </div>
  );
}
