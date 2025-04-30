
export interface ScreenField {
  field_name: string;
  information?: string;
  field_options?: string[];
  framework_type?: string | null;
}

export interface Screen {
  id: string;
  name: string;
  description?: string | null;
  framework_type?: string | null;
  widget_id: string;
  created_at: string;
  updated_at: string;
  tags?: string[] | null;
  metadata?: Record<string, any> | null;
}

export interface ScreenExtended extends Screen {
  fields: ScreenField[];
}

export interface ScreenFormData {
  name: string;
  description: string;
  framework_type: string | null;
  metadata?: Record<string, any>;
}

// Standardized metadata types based on framework type
export interface ScreenMetadata {
  // For Multiple Options and Radio Button
  options?: string[];
  
  // For Slider
  min?: number;
  max?: number;
  step?: number;
  
  // For Yes/No
  value?: string | null;
  
  // For Information
  text?: string;
  
  // For Image Upload
  image_url?: string;
  
  // For COE Manager
  coe_id?: string | null;
}
