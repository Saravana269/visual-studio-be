
export interface ScreenField {
  field_name: string;
  information?: string;
  field_options?: string[];
  framework_type?: string;
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
  framework_type: string;
  metadata?: Record<string, any>;
}
