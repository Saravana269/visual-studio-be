
import React from "react";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface YesNoFieldConfigProps {
  frameworkConfig?: Record<string, any>;
  onUpdateMetadata?: (updates: Record<string, any>) => void;
}

export function YesNoFieldConfig({
  frameworkConfig = {},
  onUpdateMetadata
}: YesNoFieldConfigProps = {}) {
  return (
    <div className="space-y-4">
      <Label>Default values are Yes/No</Label>
      <p className="text-sm text-gray-400">This framework type presents a simple Yes/No choice to the user.</p>
      
      {onUpdateMetadata && (
        <Tabs defaultValue="default" className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="default">Default Value</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="default" className="mt-4">
            <div className="space-y-2">
              <Label htmlFor="default-value">Default Selection</Label>
              <div className="flex gap-2">
                <button
                  className={`px-4 py-2 rounded-md ${
                    frameworkConfig.value === 'yes' ? 'bg-green-600 text-white' : 'bg-gray-700'
                  }`}
                  onClick={() => onUpdateMetadata({ value: 'yes' })}
                >
                  Yes
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${
                    frameworkConfig.value === 'no' ? 'bg-red-600 text-white' : 'bg-gray-700'
                  }`}
                  onClick={() => onUpdateMetadata({ value: 'no' })}
                >
                  No
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${
                    frameworkConfig.value === null ? 'bg-blue-600 text-white' : 'bg-gray-700'
                  }`}
                  onClick={() => onUpdateMetadata({ value: null })}
                >
                  No Default
                </button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="mt-4">
            <p className="text-sm text-gray-400">
              Additional options for this field type will be available in future updates.
            </p>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
