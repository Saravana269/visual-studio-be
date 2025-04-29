
export interface Widget {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface Screen {
  id: string;
  name: string;
  description: string | null;
  framework_type: string | null;
  widget_id: string;
}

export interface WidgetDetail extends Widget {
  screens: Screen[];
}

export interface WidgetFormData {
  name: string;
  description: string;
  tags: string[];
}
