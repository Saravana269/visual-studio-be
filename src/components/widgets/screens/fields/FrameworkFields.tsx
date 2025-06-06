
import React from "react";
import {
  SliderFieldConfig,
  OptionsFieldConfig,
  InformationFieldConfig,
  YesNoFieldConfig,
  COEManagerFieldConfig
} from "./framework-fields";
// Import the ImageUploadFieldConfig directly to avoid the typing issue
import { ImageUploadFieldConfig } from "./framework-fields/ImageUploadFieldConfig";

interface FrameworkFieldsProps {
  frameworkType: string;
  frameworkConfig: Record<string, any>;
  onUpdateMetadata: (updates: Record<string, any>) => void;
}

export function FrameworkFields({
  frameworkType,
  frameworkConfig = {},
  onUpdateMetadata
}: FrameworkFieldsProps) {
  switch (frameworkType) {
    case "Multiple Options":
    case "Radio Button":
      return (
        <OptionsFieldConfig 
          frameworkConfig={frameworkConfig}
          onUpdateMetadata={onUpdateMetadata}
        />
      );
      
    case "Slider":
      return (
        <SliderFieldConfig 
          frameworkConfig={frameworkConfig}
          onUpdateMetadata={onUpdateMetadata}
        />
      );
    
    case "Information":
      return (
        <InformationFieldConfig 
          frameworkConfig={frameworkConfig}
          onUpdateMetadata={onUpdateMetadata}
        />
      );
      
    case "Yes / No":
      return (
        <YesNoFieldConfig 
          frameworkConfig={frameworkConfig}
          onUpdateMetadata={onUpdateMetadata}
        />
      );
      
    case "Image Upload":
      return (
        <ImageUploadFieldConfig 
          frameworkConfig={frameworkConfig}
          onUpdateMetadata={onUpdateMetadata}
        />
      );
      
    case "COE Manager":
      return (
        <COEManagerFieldConfig 
          frameworkConfig={frameworkConfig}
          onUpdateMetadata={onUpdateMetadata}
        />
      );
      
    default:
      return null;
  }
}
