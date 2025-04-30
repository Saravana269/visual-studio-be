
import React from "react";
import { ConnectButton } from "./ConnectButton";

interface ImageUploadFrameworkProps {
  imageUrl: string | undefined;
  onConnect: (value: any, context?: string) => void;
}

export const ImageUploadFramework = ({ imageUrl, onConnect }: ImageUploadFrameworkProps) => {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium">Image Upload Configuration</h4>
      <div className="relative">
        {imageUrl ? (
          <div className="w-full max-w-md">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <img 
                  src={imageUrl} 
                  alt="Uploaded preview" 
                  className="w-full h-auto border border-gray-800 rounded-md"
                />
              </div>
              <div className="ml-2 pt-1">
                <ConnectButton value={imageUrl} context="image_url" onConnect={onConnect} />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No default image set</p>
        )}
      </div>
    </div>
  );
};
