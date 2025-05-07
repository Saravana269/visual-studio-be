
import React from "react";
import { Button } from "@/components/ui/button";
import { ConnectButton } from "./ConnectButton";
import { ConnectOptionsMenu } from "./ConnectOptionsMenu";
import { useOptionConnections } from "@/hooks/widgets/connection/useOptionConnections";
import { ConnectionBadge } from "@/components/widgets/screens/connections/ConnectionBadge";

interface ImageUploadFrameworkProps {
  imageUrl: string | null;
  onConnect: (value: any, context?: string) => void;
  widgetId?: string;
  screenId?: string;
}

export function ImageUploadFramework({ imageUrl, onConnect, widgetId, screenId }: ImageUploadFrameworkProps) {
  // Use the hook to check for existing connections specific to Image Upload framework
  const { isFrameworkConnected, connections } = useOptionConnections(screenId, "Image Upload");
  
  // Get first connection if any exists
  const existingConnection = connections.find(conn => 
    conn.framework_type === "Image Upload" && 
    !conn.is_screen_terminated
  );
  
  // Log debug info
  console.log("🖼️ Rendering ImageUploadFramework with:", { 
    imageUrl, 
    widgetId,
    screenId,
    isFrameworkConnected: isFrameworkConnected("Image Upload"),
    existingConnection
  });

  const handleOptionSelect = (option: string) => {
    // Log the option selection and widget ID
    console.log("🔘 Image Upload option selected:", { option, widgetId });
    
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
        {isFrameworkConnected("Image Upload") && existingConnection ? (
          <ConnectionBadge 
            connectionId={existingConnection.id}
            onViewConnection={() => {
              console.log("View Image Upload connection:", existingConnection.id);
              // Connection view logic could be added here
            }}
            className="h-8 px-3 py-1"
          />
        ) : (
          <ConnectOptionsMenu 
            trigger={
              <Button 
                variant="outline" 
                className="border-[#00FF00] text-[#00FF00] hover:bg-[#00FF00]/10"
                onClick={() => console.log("📱 Image Upload Connect button clicked with widgetId:", widgetId)}
              >
                Connect
              </Button>
            }
            onOptionSelect={handleOptionSelect}
            widgetId={widgetId}
          />
        )}
      </div>
    </div>
  );
}
