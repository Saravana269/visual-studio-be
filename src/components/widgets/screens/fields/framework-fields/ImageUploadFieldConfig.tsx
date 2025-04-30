
import React from "react";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

interface ImageUploadFieldConfigProps {
  frameworkConfig?: Record<string, any>;
  onUpdateMetadata?: (updates: Record<string, any>) => void;
}

export function ImageUploadFieldConfig({
  frameworkConfig = {},
  onUpdateMetadata
}: ImageUploadFieldConfigProps = {}) {
  return (
    <div className="space-y-4">
      <Label>Image Upload Configuration</Label>
      <p className="text-sm text-gray-400">Users will be able to upload an image in supported formats.</p>

      {onUpdateMetadata && (
        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="mt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="placeholder-image">Placeholder Image URL</Label>
                <Input
                  id="placeholder-image"
                  className="mt-1 bg-gray-950 border-gray-800"
                  placeholder="Enter placeholder image URL"
                  value={frameworkConfig.image_url || ''}
                  onChange={e => onUpdateMetadata({ image_url: e.target.value })}
                />
                <p className="text-xs text-gray-400 mt-1">
                  This image will be shown when no image has been uploaded yet
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="mt-4">
            <div className="flex flex-col items-center justify-center p-6 bg-gray-900 rounded-lg">
              {frameworkConfig.image_url ? (
                <div className="space-y-2">
                  <div className="w-40 h-40 mx-auto bg-gray-800 rounded-md overflow-hidden">
                    <img 
                      src={frameworkConfig.image_url} 
                      alt="Placeholder" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <p className="text-sm text-center text-gray-400">Placeholder Image</p>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  No placeholder image set
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
