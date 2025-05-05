
import React from "react";
import { Button } from "@/components/ui/button";
import { ConnectButton } from "./ConnectButton";
import { ConnectOptionsMenu } from "./ConnectOptionsMenu";

interface ImageUploadFrameworkProps {
  imageUrl: string | null;
  onConnect: (value: any, context?: string) => void;
  widgetId?: string;
}

export function ImageUploadFramework({ imageUrl, onConnect, widgetId }: ImageUploadFrameworkProps) {
  const handleOptionSelect = (option: string) => {
    // Append the selected option to the context
    onConnect(imageUrl || null, `imageUpload:${option}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        {imageUrl ? (
          <div className="border border-gray-700 rounded overflow-hidden w-48 h-48 flex items-center justify-center">
            <img 
              src={imageUrl} 
              alt="Uploaded preview"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        ) : (
          <div className="border border-gray-700 rounded bg-black/50 w-48 h-48 flex items-center justify-center">
            <p className="text-gray-500 text-sm">No image uploaded</p>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <ConnectOptionsMenu 
          trigger={
            <Button 
              variant="outline" 
              className="border-[#00FF00] text-[#00FF00] hover:bg-[#00FF00]/10"
            >
              Connect
            </Button>
          }
          onOptionSelect={handleOptionSelect}
          widgetId={widgetId}
        />
      </div>
    </div>
  );
}
