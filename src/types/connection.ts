
export interface ScreenConnection {
  id: string;
  framework_type: string | null;
  framework_type_ref: string | null;
  widget_ref: string | null;
  screen_ref: string | null;
  created_at: string;
  updated_at: string;
  is_screen_terminated: boolean;
  element_ref: string | null;
  connection_context: string | null;
  source_value: string | null;
  screen_name: string | null;
  screen_description: string | null;
  property_values: Record<string, any> | null;
}

export type CreateScreenConnectionParams = Omit<
  ScreenConnection, 
  'id' | 'created_at' | 'updated_at'
>;
