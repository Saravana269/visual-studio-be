
import React from 'react';
import { Screen } from '@/types/screen';
import { RadioButtonContent } from './RadioButtonContent';
import { MultipleOptionsContent } from './MultipleOptionsContent';
import { SliderContent } from './SliderContent';
import { YesNoContent } from './YesNoContent';
import { InformationContent } from './InformationContent';
import { ImageUploadContent } from './ImageUploadContent';
import { COEManagerContent } from './COEManagerContent';
import { MultipleOptionsCombinationsContent } from './MultipleOptionsCombinationsContent';
import { OptionsFramework } from '../fields/steps/output/OptionsFramework';

interface FrameworkContentRendererProps {
  screen: Screen;
  frameworkType?: string | null;
}

export function FrameworkContentRenderer({ screen, frameworkType }: FrameworkContentRendererProps) {
  if (!frameworkType || !screen.metadata) {
    return <div className="text-gray-400">No framework type selected.</div>;
  }
  
  const metadata = screen.metadata || {};

  switch (frameworkType) {
    case 'Radio Button':
      return (
        <OptionsFramework 
          options={screen.metadata?.options || []} 
          isRadio={true}
          onConnect={() => {}}
          screenId={screen.id}
          widgetId={screen.widget_id}
          isReviewMode={true}
        />
      );
    
    case 'Multiple Options':
      return (
        <OptionsFramework 
          options={screen.metadata?.options || []} 
          isRadio={false}
          onConnect={() => {}}
          screenId={screen.id}
          widgetId={screen.widget_id}
          isReviewMode={true}
        />
      );
      
    case 'Slider':
      return (
        <SliderContent 
          metadata={metadata}
          screenId={screen.id}
        />
      );
      
    case 'Yes / No':
      return (
        <YesNoContent 
          metadata={metadata}
          screenId={screen.id}
        />
      );
      
    case 'Information':
      return (
        <InformationContent 
          metadata={metadata}
          screenId={screen.id}
        />
      );
      
    case 'Image Upload':
      return (
        <ImageUploadContent 
          metadata={metadata}
          screenId={screen.id}
        />
      );
      
    case 'COE Manager':
      return (
        <COEManagerContent 
          metadata={metadata}
          screenId={screen.id}
        />
      );
      
    default:
      return (
        <div className="text-gray-400">
          Unsupported framework type: {frameworkType}
        </div>
      );
  }
}
