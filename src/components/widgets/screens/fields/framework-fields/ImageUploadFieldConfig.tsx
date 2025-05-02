
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { ImageUploader } from "@/components/elements/ImageUploader";

export interface ImageUploadFieldConfigProps {
  frameworkConfig: Record<string, any>;
  onUpdateMetadata: (updates: Record<string, any>) => void;
}

export function ImageUploadFieldConfig({
  frameworkConfig,
  onUpdateMetadata
}: ImageUploadFieldConfigProps) {
  const [isUploading, setIsUploading] = useState(false);
  const imageUrl = frameworkConfig.image_url || "";

  const handleImageChange = (url: string) => {
    if (onUpdateMetadata) {
      onUpdateMetadata({ image_url: url });
    }
  };

  return (
    <div className="space-y-4">
      <Label>Image Upload Configuration</Label>
      <p className="text-sm text-gray-400">
        Users will be able to upload an image in supported formats.
      </p>

      {onUpdateMetadata && (
        <div className="mt-6 space-y-4">
          <Label className="mb-2 block">Default Image</Label>
          <ImageUploader 
            value={imageUrl}
            onChange={handleImageChange}
          />

          {imageUrl && (
            <div className="mt-4">
              <Label className="mb-2 block">Preview</Label>
              <div className="border border-green-500 rounded p-2 bg-black/20 max-w-xs">
                <img 
                  src={imageUrl} 
                  alt="Uploaded Preview" 
                  className="w-full h-auto object-contain rounded"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {!onUpdateMetadata && (
        <div className="p-4 mt-4 border border-dashed border-gray-600 rounded bg-black/20">
          <p className="text-gray-500 text-center">
            No configuration options available in read-only mode.
          </p>
        </div>
      )}
    </div>
  );
}
