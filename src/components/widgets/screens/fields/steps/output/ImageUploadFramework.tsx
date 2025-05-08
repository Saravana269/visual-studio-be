
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageIcon, Upload } from "lucide-react";
import { ConnectButton } from "./ConnectButton";
import { useToast } from "@/hooks/use-toast";
import { ConnectionBadge } from "../../../connections/ConnectionBadge";

interface ImageUploadFrameworkProps {
  imageUrl?: string | null;
  onConnect: (value: any, context?: string) => void;
  widgetId?: string;
  screenId?: string;
  isReviewMode?: boolean;
}

export const ImageUploadFramework: React.FC<ImageUploadFrameworkProps> = ({
  imageUrl,
  onConnect,
  widgetId,
  screenId,
  isReviewMode = false
}) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(imageUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  
  // Mock function to simulate image upload
  // In a real implementation, this would use proper file selection and upload to a storage service
  const handleUpload = () => {
    if (isReviewMode) return;
    
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      // For demo purposes, we'll just set a placeholder image
      const mockImageUrl = "https://example.com/placeholder-image.jpg";
      setUploadedImage(mockImageUrl);
      setIsUploading(false);
      
      // Notify user
      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully.",
      });
    }, 1500);
  };
  
  const handleConnect = () => {
    if (uploadedImage) {
      onConnect(uploadedImage, "Image Upload");
      setIsConnected(true);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-medium">Image Upload</h2>
      
      <div className="flex flex-col items-center space-y-4">
        {uploadedImage ? (
          <>
            <Card className="w-full aspect-video flex items-center justify-center bg-gray-900 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <ImageIcon size={64} className="text-gray-400" />
                <span className="mt-2 text-gray-400">Image Preview</span>
              </div>
            </Card>
            
            <div className="flex items-center justify-between w-full">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleUpload}
                disabled={isUploading || isReviewMode}
              >
                Change Image
              </Button>
              
              {isConnected ? (
                <ConnectionBadge 
                  type="value"
                  label="Image Connected"
                  connectionId="image-upload" 
                  onViewConnection={handleConnect}
                  className="ml-2" 
                />
              ) : (
                <ConnectButton
                  value={uploadedImage}
                  context="Image Upload"
                  onConnect={onConnect}
                  widgetId={widgetId}
                  screenId={screenId}
                />
              )}
            </div>
          </>
        ) : (
          <Card 
            className="w-full aspect-video flex flex-col items-center justify-center bg-gray-900 cursor-pointer hover:bg-gray-800 transition-colors border-dashed border-2 border-gray-700"
            onClick={!isReviewMode ? handleUpload : undefined}
          >
            <Upload size={48} className="text-gray-500 mb-2" />
            <p className="text-gray-500">{isReviewMode ? "No image uploaded" : "Click to upload an image"}</p>
            
            {isUploading && (
              <div className="mt-4">
                <div className="w-32 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00FF00] animate-pulse"></div>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};
