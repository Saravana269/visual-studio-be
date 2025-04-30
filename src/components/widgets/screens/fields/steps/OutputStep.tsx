
import { Button } from "@/components/ui/button";
import { ScreenFormData } from "@/types/screen";
import { Link2 } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface OutputStepProps {
  frameworkType: string | null;
  metadata: Record<string, any>;
  onConnect?: (frameworkType: string, value: any, context?: string) => void;
}

export function OutputStep({ frameworkType, metadata, onConnect }: OutputStepProps) {
  // Handle connect button click
  const handleConnect = (value: any, context?: string) => {
    if (onConnect && frameworkType) {
      onConnect(frameworkType, value, context);
    }
  };

  // If no framework type is selected
  if (!frameworkType) {
    return (
      <div className="text-gray-500 text-center py-8">
        <p>No framework type selected for this screen.</p>
        <p className="mt-2">Go back to step 3 to select a framework type.</p>
      </div>
    );
  }

  const renderConnectButton = (value: any, context?: string) => {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 rounded-full bg-[#00FF00]/10 hover:bg-[#00FF00]/20 border border-[#00FF00]/30"
              onClick={() => handleConnect(value, context)}
            >
              <Link2 className="h-3.5 w-3.5 text-[#00FF00]" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="text-xs">Connect</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

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
                  <li key={index} className="text-gray-300 flex items-center justify-between">
                    <span>{option}</span>
                    {renderConnectButton(option, `option_${index}`)}
                  </li>
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
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Min Value</p>
                    <p className="text-xl font-medium">{metadata.min || 0}</p>
                  </div>
                  {renderConnectButton(metadata.min || 0, 'min_value')}
                </div>
              </div>
              <div className="p-3 border border-gray-800 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Max Value</p>
                    <p className="text-xl font-medium">{metadata.max || 100}</p>
                  </div>
                  {renderConnectButton(metadata.max || 100, 'max_value')}
                </div>
              </div>
              <div className="p-3 border border-gray-800 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Step</p>
                    <p className="text-xl font-medium">{metadata.step || 1}</p>
                  </div>
                  {renderConnectButton(metadata.step || 1, 'step_value')}
                </div>
              </div>
            </div>
          </div>
        );
      
      case "Yes / No":
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Yes/No Configuration</h4>
            <div className="flex space-x-4">
              <div className="p-3 border border-gray-800 rounded-md flex-1">
                <div className="flex items-center justify-between">
                  <p>Yes</p>
                  {renderConnectButton("yes", 'yes_option')}
                </div>
              </div>
              <div className="p-3 border border-gray-800 rounded-md flex-1">
                <div className="flex items-center justify-between">
                  <p>No</p>
                  {renderConnectButton("no", 'no_option')}
                </div>
              </div>
            </div>
            <p>Default value: {metadata.value === null ? 'Not set' : metadata.value ? 'Yes' : 'No'}</p>
          </div>
        );
      
      case "Information":
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Information Content</h4>
            <div className="p-4 border border-gray-800 rounded-md">
              <div className="flex items-start justify-between">
                {metadata.text ? (
                  <p className="whitespace-pre-wrap pr-4">{metadata.text}</p>
                ) : (
                  <p className="text-gray-500">No information text provided</p>
                )}
                {metadata.text && renderConnectButton(metadata.text, 'info_text')}
              </div>
            </div>
          </div>
        );
      
      case "Image Upload":
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Image Upload Configuration</h4>
            <div className="relative">
              {metadata.image_url ? (
                <div className="w-full max-w-md">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <img 
                        src={metadata.image_url} 
                        alt="Uploaded preview" 
                        className="w-full h-auto border border-gray-800 rounded-md"
                      />
                    </div>
                    <div className="ml-2 pt-1">
                      {renderConnectButton(metadata.image_url, 'image_url')}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No default image set</p>
              )}
            </div>
          </div>
        );
      
      case "COE Manager":
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-medium">COE Configuration</h4>
            <div className="p-3 border border-gray-800 rounded-md">
              <div className="flex items-center justify-between">
                <p>COE ID: {metadata.coe_id || 'Not set'}</p>
                {metadata.coe_id && renderConnectButton(metadata.coe_id, 'coe_id')}
              </div>
            </div>
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
