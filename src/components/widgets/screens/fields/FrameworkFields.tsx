
import React from "react";
import {
  SliderFieldConfig,
  OptionsFieldConfig,
  InformationFieldConfig,
  YesNoFieldConfig,
  ImageUploadFieldConfig,
  COEManagerFieldConfig
} from "./framework-fields";

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
      return <ImageUploadFieldConfig />;
      
    case "COE Manager":
      return <COEManagerFieldConfig />;
      
    default:
      return null;
  }
}
