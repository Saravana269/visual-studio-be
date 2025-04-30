
import React from "react";
import { Label } from "@/components/ui/label";

export function ImageUploadFieldConfig() {
  return (
    <div className="space-y-2">
      <Label>Image Upload Configuration</Label>
      <p className="text-sm text-gray-400">Users will be able to upload an image in supported formats.</p>
    </div>
  );
}
