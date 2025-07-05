export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bom_components: {
        Row: {
          added_at: string | null
          component_id: string
          id: string
          name: string
          specific_details: Json | null
        }
        Insert: {
          added_at?: string | null
          component_id: string
          id?: string
          name: string
          specific_details?: Json | null
        }
        Update: {
          added_at?: string | null
          component_id?: string
          id?: string
          name?: string
          specific_details?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "bom_components_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: true
            referencedRelation: "component_id_debug_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bom_components_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: true
            referencedRelation: "components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bom_components_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: true
            referencedRelation: "components_with_specs"
            referencedColumns: ["id"]
          },
        ]
      }
      class_of_elements: {
        Row: {
          coreSet_id: string[] | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          primary_tag_id: string | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          coreSet_id?: string[] | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          primary_tag_id?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          coreSet_id?: string[] | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          primary_tag_id?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_of_elements_primary_tag_id_fkey"
            columns: ["primary_tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      classification: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          submenu_id: string
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          submenu_id: string
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          submenu_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "classification_submenu_id_fkey"
            columns: ["submenu_id"]
            isOneToOne: false
            referencedRelation: "submenu"
            referencedColumns: ["id"]
          },
        ]
      }
      classification_backup: {
        Row: {
          code: string | null
          created_at: string | null
          description: string | null
          id: string | null
          image_url: string | null
          name: string | null
          sub_menu_id: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          image_url?: string | null
          name?: string | null
          sub_menu_id?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          image_url?: string | null
          name?: string | null
          sub_menu_id?: string | null
        }
        Relationships: []
      }
      component_match_rules: {
        Row: {
          active: boolean | null
          auto_generated_at: string | null
          component_attribute: string
          context_metadata: Json | null
          created_at: string
          effectiveness_score: number | null
          formula_output_mapping: Json | null
          formula_signature: string | null
          generation_metadata: Json | null
          id: string
          last_used_at: string | null
          match_operator: string
          match_value: string
          min_threshold: number | null
          output_variable_name: string
          parameter_type: string | null
          rule_source: string | null
          source_condition_id: string | null
          tolerance_percent: number | null
          unit: string | null
          updated_at: string
          usage_count: number | null
          weight: number | null
        }
        Insert: {
          active?: boolean | null
          auto_generated_at?: string | null
          component_attribute: string
          context_metadata?: Json | null
          created_at?: string
          effectiveness_score?: number | null
          formula_output_mapping?: Json | null
          formula_signature?: string | null
          generation_metadata?: Json | null
          id?: string
          last_used_at?: string | null
          match_operator: string
          match_value: string
          min_threshold?: number | null
          output_variable_name: string
          parameter_type?: string | null
          rule_source?: string | null
          source_condition_id?: string | null
          tolerance_percent?: number | null
          unit?: string | null
          updated_at?: string
          usage_count?: number | null
          weight?: number | null
        }
        Update: {
          active?: boolean | null
          auto_generated_at?: string | null
          component_attribute?: string
          context_metadata?: Json | null
          created_at?: string
          effectiveness_score?: number | null
          formula_output_mapping?: Json | null
          formula_signature?: string | null
          generation_metadata?: Json | null
          id?: string
          last_used_at?: string | null
          match_operator?: string
          match_value?: string
          min_threshold?: number | null
          output_variable_name?: string
          parameter_type?: string | null
          rule_source?: string | null
          source_condition_id?: string | null
          tolerance_percent?: number | null
          unit?: string | null
          updated_at?: string
          usage_count?: number | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "component_match_rules_source_condition_id_fkey"
            columns: ["source_condition_id"]
            isOneToOne: false
            referencedRelation: "formula_conditions"
            referencedColumns: ["id"]
          },
        ]
      }
      component_serial_counter: {
        Row: {
          serial_number: number | null
          short_code: string
          sub_classification_id: string
        }
        Insert: {
          serial_number?: number | null
          short_code: string
          sub_classification_id: string
        }
        Update: {
          serial_number?: number | null
          short_code?: string
          sub_classification_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "component_serial_counter_sub_classification_id_fkey"
            columns: ["sub_classification_id"]
            isOneToOne: false
            referencedRelation: "sub_classification"
            referencedColumns: ["id"]
          },
        ]
      }
      component_type: {
        Row: {
          component_type_head_id: string | null
          created_at: string | null
          field_name: string
          field_type: string
          field_value: string | null
          id: string
          is_unit_required: boolean | null
          si_unit_definition_id: string | null
          unit_type: string | null
        }
        Insert: {
          component_type_head_id?: string | null
          created_at?: string | null
          field_name: string
          field_type: string
          field_value?: string | null
          id?: string
          is_unit_required?: boolean | null
          si_unit_definition_id?: string | null
          unit_type?: string | null
        }
        Update: {
          component_type_head_id?: string | null
          created_at?: string | null
          field_name?: string
          field_type?: string
          field_value?: string | null
          id?: string
          is_unit_required?: boolean | null
          si_unit_definition_id?: string | null
          unit_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "component_type_component_type_head_id_fkey"
            columns: ["component_type_head_id"]
            isOneToOne: false
            referencedRelation: "component_type_head"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_type_si_unit_definition_id_fkey"
            columns: ["si_unit_definition_id"]
            isOneToOne: false
            referencedRelation: "si_unit_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      component_type_head: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      components: {
        Row: {
          component_id_code: string
          component_type_head_id: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          manufacturer_id: string | null
          name: string
          sub_classification_id: string
          vendor_id: string | null
          website_url: string | null
        }
        Insert: {
          component_id_code: string
          component_type_head_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          manufacturer_id?: string | null
          name: string
          sub_classification_id: string
          vendor_id?: string | null
          website_url?: string | null
        }
        Update: {
          component_id_code?: string
          component_type_head_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          manufacturer_id?: string | null
          name?: string
          sub_classification_id?: string
          vendor_id?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "components_manufacturer_id_fkey"
            columns: ["manufacturer_id"]
            isOneToOne: false
            referencedRelation: "manufacturer_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "components_sub_classification_id_fkey"
            columns: ["sub_classification_id"]
            isOneToOne: false
            referencedRelation: "sub_classification"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "components_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_component_type_head"
            columns: ["component_type_head_id"]
            isOneToOne: false
            referencedRelation: "component_type_head"
            referencedColumns: ["id"]
          },
        ]
      }
      connect_screens: {
        Row: {
          created_at: string | null
          framework_type: string | null
          framework_type_ref: string | null
          id: string
          is_screen_terminated: boolean | null
          nextScreen_Ref: string | null
          property_values: Json | null
          screen_description: string | null
          screen_name: string | null
          screen_ref: string | null
          updated_at: string | null
          widget_ref: string | null
        }
        Insert: {
          created_at?: string | null
          framework_type?: string | null
          framework_type_ref?: string | null
          id?: string
          is_screen_terminated?: boolean | null
          nextScreen_Ref?: string | null
          property_values?: Json | null
          screen_description?: string | null
          screen_name?: string | null
          screen_ref?: string | null
          updated_at?: string | null
          widget_ref?: string | null
        }
        Update: {
          created_at?: string | null
          framework_type?: string | null
          framework_type_ref?: string | null
          id?: string
          is_screen_terminated?: boolean | null
          nextScreen_Ref?: string | null
          property_values?: Json | null
          screen_description?: string | null
          screen_name?: string | null
          screen_ref?: string | null
          updated_at?: string | null
          widget_ref?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "connect_screens_framework_type_ref_fkey"
            columns: ["framework_type_ref"]
            isOneToOne: false
            referencedRelation: "framework_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_screens_nextScreen_Ref_fkey"
            columns: ["nextScreen_Ref"]
            isOneToOne: false
            referencedRelation: "screens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_screens_screen_ref_fkey"
            columns: ["screen_ref"]
            isOneToOne: false
            referencedRelation: "screens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connect_screens_widget_ref_fkey"
            columns: ["widget_ref"]
            isOneToOne: false
            referencedRelation: "widgets"
            referencedColumns: ["id"]
          },
        ]
      }
      core_sets: {
        Row: {
          created_at: string | null
          description: string | null
          destination_coe_id: string | null
          destination_element_ids: string[] | null
          id: string
          image_url: string | null
          name: string
          primary_tag_id: string | null
          source_coe_id: string | null
          source_element_id: string | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          destination_coe_id?: string | null
          destination_element_ids?: string[] | null
          id?: string
          image_url?: string | null
          name: string
          primary_tag_id?: string | null
          source_coe_id?: string | null
          source_element_id?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          destination_coe_id?: string | null
          destination_element_ids?: string[] | null
          id?: string
          image_url?: string | null
          name?: string
          primary_tag_id?: string | null
          source_coe_id?: string | null
          source_element_id?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "core_sets_destination_coe_id_fkey"
            columns: ["destination_coe_id"]
            isOneToOne: false
            referencedRelation: "class_of_elements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "core_sets_source_coe_id_fkey"
            columns: ["source_coe_id"]
            isOneToOne: false
            referencedRelation: "class_of_elements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "core_sets_source_element_id_fkey"
            columns: ["source_element_id"]
            isOneToOne: false
            referencedRelation: "elements"
            referencedColumns: ["id"]
          },
        ]
      }
      elements: {
        Row: {
          coe_ids: string[] | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          primary_tag_id: string | null
          updated_at: string | null
        }
        Insert: {
          coe_ids?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          primary_tag_id?: string | null
          updated_at?: string | null
        }
        Update: {
          coe_ids?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          primary_tag_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_elements_primary_tag"
            columns: ["primary_tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      files: {
        Row: {
          component_id: string
          created_at: string | null
          file_name: string
          file_url: string
          id: string
        }
        Insert: {
          component_id: string
          created_at?: string | null
          file_name: string
          file_url: string
          id?: string
        }
        Update: {
          component_id?: string
          created_at?: string | null
          file_name?: string
          file_url?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "files_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_id_debug_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "files_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "files_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components_with_specs"
            referencedColumns: ["id"]
          },
        ]
      }
      formula_conditions: {
        Row: {
          condition_expression: string
          created_at: string
          execution_order: number | null
          id: string
          nextscreen_ref: string | null
          screen_ref: string | null
          updated_at: string
          variables_used: Json | null
        }
        Insert: {
          condition_expression: string
          created_at?: string
          execution_order?: number | null
          id?: string
          nextscreen_ref?: string | null
          screen_ref?: string | null
          updated_at?: string
          variables_used?: Json | null
        }
        Update: {
          condition_expression?: string
          created_at?: string
          execution_order?: number | null
          id?: string
          nextscreen_ref?: string | null
          screen_ref?: string | null
          updated_at?: string
          variables_used?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "formula_conditions_nextscreen_ref_fkey"
            columns: ["nextscreen_ref"]
            isOneToOne: false
            referencedRelation: "screens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "formula_conditions_screen_ref_fkey"
            columns: ["screen_ref"]
            isOneToOne: false
            referencedRelation: "screens"
            referencedColumns: ["id"]
          },
        ]
      }
      formula_execution_inputs: {
        Row: {
          constant_value: string | null
          created_at: string
          execution_mapping_ref: string | null
          id: string
          input_source_ref: string | null
          input_source_type: string
          input_variable_name: string
          updated_at: string
        }
        Insert: {
          constant_value?: string | null
          created_at?: string
          execution_mapping_ref?: string | null
          id?: string
          input_source_ref?: string | null
          input_source_type: string
          input_variable_name: string
          updated_at?: string
        }
        Update: {
          constant_value?: string | null
          created_at?: string
          execution_mapping_ref?: string | null
          id?: string
          input_source_ref?: string | null
          input_source_type?: string
          input_variable_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "formula_execution_inputs_execution_mapping_ref_fkey"
            columns: ["execution_mapping_ref"]
            isOneToOne: false
            referencedRelation: "formula_execution_mapping"
            referencedColumns: ["id"]
          },
        ]
      }
      formula_execution_mapping: {
        Row: {
          created_at: string
          executed_by: string | null
          execution_order: number
          execution_session_id: string | null
          failure_reason: string | null
          formula_ref: string | null
          id: string
          nextscreen_ref: string | null
          output_unit: string | null
          output_value: string | null
          output_variable_name: string | null
          screen_ref: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          executed_by?: string | null
          execution_order?: number
          execution_session_id?: string | null
          failure_reason?: string | null
          formula_ref?: string | null
          id?: string
          nextscreen_ref?: string | null
          output_unit?: string | null
          output_value?: string | null
          output_variable_name?: string | null
          screen_ref?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          executed_by?: string | null
          execution_order?: number
          execution_session_id?: string | null
          failure_reason?: string | null
          formula_ref?: string | null
          id?: string
          nextscreen_ref?: string | null
          output_unit?: string | null
          output_value?: string | null
          output_variable_name?: string | null
          screen_ref?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "formula_execution_mapping_formula_ref_fkey"
            columns: ["formula_ref"]
            isOneToOne: false
            referencedRelation: "math_formulas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "formula_execution_mapping_nextscreen_ref_fkey"
            columns: ["nextscreen_ref"]
            isOneToOne: false
            referencedRelation: "screens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "formula_execution_mapping_screen_ref_fkey"
            columns: ["screen_ref"]
            isOneToOne: false
            referencedRelation: "screens"
            referencedColumns: ["id"]
          },
        ]
      }
      framework_types: {
        Row: {
          created_at: string | null
          framework_Type: string
          id: string
          property_values: Json | null
          screen_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          framework_Type: string
          id?: string
          property_values?: Json | null
          screen_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          framework_Type?: string
          id?: string
          property_values?: Json | null
          screen_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "framework_types_screen_id_fkey"
            columns: ["screen_id"]
            isOneToOne: false
            referencedRelation: "screens"
            referencedColumns: ["id"]
          },
        ]
      }
      logic_builder_version: {
        Row: {
          canvas_meta: Json
          canvas_state: Json
          created_at: string
          id: string
          is_compressed: boolean | null
          logic_assignments: Json
          snapshot_size: number | null
          version_control_id: string
        }
        Insert: {
          canvas_meta?: Json
          canvas_state?: Json
          created_at?: string
          id?: string
          is_compressed?: boolean | null
          logic_assignments?: Json
          snapshot_size?: number | null
          version_control_id: string
        }
        Update: {
          canvas_meta?: Json
          canvas_state?: Json
          created_at?: string
          id?: string
          is_compressed?: boolean | null
          logic_assignments?: Json
          snapshot_size?: number | null
          version_control_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "logic_builder_version_version_control_id_fkey"
            columns: ["version_control_id"]
            isOneToOne: false
            referencedRelation: "version_control"
            referencedColumns: ["id"]
          },
        ]
      }
      logic_rules: {
        Row: {
          category: string
          complexity: Database["public"]["Enums"]["rule_complexity"] | null
          created_at: string | null
          created_by: string | null
          description: string | null
          execution_count: number | null
          id: string
          last_executed_at: string | null
          name: string
          parameter_mapping: Json | null
          rule_definition: Json
          status: Database["public"]["Enums"]["rule_status"] | null
          updated_at: string | null
          validation_schema: Json | null
          version: number | null
        }
        Insert: {
          category: string
          complexity?: Database["public"]["Enums"]["rule_complexity"] | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          execution_count?: number | null
          id?: string
          last_executed_at?: string | null
          name: string
          parameter_mapping?: Json | null
          rule_definition: Json
          status?: Database["public"]["Enums"]["rule_status"] | null
          updated_at?: string | null
          validation_schema?: Json | null
          version?: number | null
        }
        Update: {
          category?: string
          complexity?: Database["public"]["Enums"]["rule_complexity"] | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          execution_count?: number | null
          id?: string
          last_executed_at?: string | null
          name?: string
          parameter_mapping?: Json | null
          rule_definition?: Json
          status?: Database["public"]["Enums"]["rule_status"] | null
          updated_at?: string | null
          validation_schema?: Json | null
          version?: number | null
        }
        Relationships: []
      }
      logic_templates: {
        Row: {
          category: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          preview_image_url: string | null
          tags: string[] | null
          template_data: Json
          template_type: Database["public"]["Enums"]["template_type"]
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          preview_image_url?: string | null
          tags?: string[] | null
          template_data: Json
          template_type: Database["public"]["Enums"]["template_type"]
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          preview_image_url?: string | null
          tags?: string[] | null
          template_data?: Json
          template_type?: Database["public"]["Enums"]["template_type"]
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: []
      }
      manufacturer_details: {
        Row: {
          brand_name: string | null
          created_at: string | null
          id: string
          manufacturer_code: string
          manufacturer_email: string | null
          manufacturer_name: string
          poc_mobile: string | null
          poc_name: string | null
        }
        Insert: {
          brand_name?: string | null
          created_at?: string | null
          id?: string
          manufacturer_code: string
          manufacturer_email?: string | null
          manufacturer_name: string
          poc_mobile?: string | null
          poc_name?: string | null
        }
        Update: {
          brand_name?: string | null
          created_at?: string | null
          id?: string
          manufacturer_code?: string
          manufacturer_email?: string | null
          manufacturer_name?: string
          poc_mobile?: string | null
          poc_name?: string | null
        }
        Relationships: []
      }
      math_formulas: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          expression: string | null
          formula_expression: string
          id: string
          is_deleted: boolean | null
          is_verified: boolean | null
          name: string
          si_unit_definition_id: string | null
          si_unit_value: Json | null
          test_cases: Json | null
          unit_type: string | null
          updated_at: string | null
          validation_rules: Json | null
          variable_types: string | null
          variables: Json | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          expression?: string | null
          formula_expression: string
          id?: string
          is_deleted?: boolean | null
          is_verified?: boolean | null
          name: string
          si_unit_definition_id?: string | null
          si_unit_value?: Json | null
          test_cases?: Json | null
          unit_type?: string | null
          updated_at?: string | null
          validation_rules?: Json | null
          variable_types?: string | null
          variables?: Json | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          expression?: string | null
          formula_expression?: string
          id?: string
          is_deleted?: boolean | null
          is_verified?: boolean | null
          name?: string
          si_unit_definition_id?: string | null
          si_unit_value?: Json | null
          test_cases?: Json | null
          unit_type?: string | null
          updated_at?: string | null
          validation_rules?: Json | null
          variable_types?: string | null
          variables?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "math_formulas_si_unit_definition_id_fkey"
            columns: ["si_unit_definition_id"]
            isOneToOne: false
            referencedRelation: "si_unit_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      menu: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      responses: {
        Row: {
          connect_screen_ref: string | null
          framework_type: string
          project_id: string
          screen_id: string
          selected_value: Json | null
          submitted_at: string | null
          uuid: string
        }
        Insert: {
          connect_screen_ref?: string | null
          framework_type: string
          project_id: string
          screen_id: string
          selected_value?: Json | null
          submitted_at?: string | null
          uuid?: string
        }
        Update: {
          connect_screen_ref?: string | null
          framework_type?: string
          project_id?: string
          screen_id?: string
          selected_value?: Json | null
          submitted_at?: string | null
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_responses_connect_screen_ref"
            columns: ["connect_screen_ref"]
            isOneToOne: false
            referencedRelation: "connect_screens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_responses_project_id"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_responses_screen_id"
            columns: ["screen_id"]
            isOneToOne: false
            referencedRelation: "screens"
            referencedColumns: ["id"]
          },
        ]
      }
      rule_nodes: {
        Row: {
          connections: Json | null
          created_at: string | null
          id: string
          label: string
          node_type: Database["public"]["Enums"]["node_type"]
          position_x: number
          position_y: number
          properties: Json | null
          rule_id: string | null
        }
        Insert: {
          connections?: Json | null
          created_at?: string | null
          id?: string
          label: string
          node_type: Database["public"]["Enums"]["node_type"]
          position_x: number
          position_y: number
          properties?: Json | null
          rule_id?: string | null
        }
        Update: {
          connections?: Json | null
          created_at?: string | null
          id?: string
          label?: string
          node_type?: Database["public"]["Enums"]["node_type"]
          position_x?: number
          position_y?: number
          properties?: Json | null
          rule_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rule_nodes_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "logic_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      screens: {
        Row: {
          created_at: string | null
          description: string | null
          framework_id: string | null
          framework_type: string | null
          id: string
          initial_screen: boolean | null
          metadata: Json | null
          name: string
          project_id: string | null
          updated_at: string | null
          widget_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          framework_id?: string | null
          framework_type?: string | null
          id?: string
          initial_screen?: boolean | null
          metadata?: Json | null
          name: string
          project_id?: string | null
          updated_at?: string | null
          widget_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          framework_id?: string | null
          framework_type?: string | null
          id?: string
          initial_screen?: boolean | null
          metadata?: Json | null
          name?: string
          project_id?: string | null
          updated_at?: string | null
          widget_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "screens_framework_id_fkey"
            columns: ["framework_id"]
            isOneToOne: false
            referencedRelation: "framework_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "screens_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "screens_widget_id_fkey"
            columns: ["widget_id"]
            isOneToOne: false
            referencedRelation: "widgets"
            referencedColumns: ["id"]
          },
        ]
      }
      si_unit_definitions: {
        Row: {
          created_at: string
          id: string
          name: string
          related_units: string | null
          si_unit: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          related_units?: string | null
          si_unit: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          related_units?: string | null
          si_unit?: string
        }
        Relationships: []
      }
      specific_details: {
        Row: {
          component_id: string
          created_at: string | null
          field_name: string
          field_type: string
          field_value: string | null
          id: string
          is_template: boolean | null
          is_unit_required: boolean | null
          si_unit_definition_id: string | null
          unit_type: string | null
        }
        Insert: {
          component_id: string
          created_at?: string | null
          field_name: string
          field_type: string
          field_value?: string | null
          id?: string
          is_template?: boolean | null
          is_unit_required?: boolean | null
          si_unit_definition_id?: string | null
          unit_type?: string | null
        }
        Update: {
          component_id?: string
          created_at?: string | null
          field_name?: string
          field_type?: string
          field_value?: string | null
          id?: string
          is_template?: boolean | null
          is_unit_required?: boolean | null
          si_unit_definition_id?: string | null
          unit_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "specific_details_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "component_id_debug_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "specific_details_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "specific_details_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components_with_specs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "specific_details_si_unit_definition_id_fkey"
            columns: ["si_unit_definition_id"]
            isOneToOne: false
            referencedRelation: "si_unit_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      sub_classification: {
        Row: {
          classification_id: string
          code: string
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
        }
        Insert: {
          classification_id: string
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
        }
        Update: {
          classification_id?: string
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "sub_classification_classification_id_fkey"
            columns: ["classification_id"]
            isOneToOne: false
            referencedRelation: "classification"
            referencedColumns: ["id"]
          },
        ]
      }
      submenu: {
        Row: {
          code: string
          created_at: string | null
          id: string
          menu_id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          menu_id: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          menu_id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "submenu_menu_id_fkey"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "menu"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          created_at: string | null
          created_by: string | null
          entity_id: string
          entity_type: string
          id: string
          label: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          entity_id: string
          entity_type: string
          id?: string
          label: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          label?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          preferences: Json | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          preferences?: Json | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          preferences?: Json | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      vendor_details: {
        Row: {
          created_at: string | null
          id: string
          poc_mobile: string | null
          poc_name: string | null
          vendor_code: string
          vendor_email: string | null
          vendor_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          poc_mobile?: string | null
          poc_name?: string | null
          vendor_code: string
          vendor_email?: string | null
          vendor_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          poc_mobile?: string | null
          poc_name?: string | null
          vendor_code?: string
          vendor_email?: string | null
          vendor_name?: string
        }
        Relationships: []
      }
      version_control: {
        Row: {
          activated_at: string | null
          activated_by: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          logic_flow_id: string
          tags: string[] | null
          updated_at: string
          version_name: string | null
          version_number: number
          version_status: Database["public"]["Enums"]["version_status"]
        }
        Insert: {
          activated_at?: string | null
          activated_by?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          logic_flow_id: string
          tags?: string[] | null
          updated_at?: string
          version_name?: string | null
          version_number: number
          version_status?: Database["public"]["Enums"]["version_status"]
        }
        Update: {
          activated_at?: string | null
          activated_by?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          logic_flow_id?: string
          tags?: string[] | null
          updated_at?: string
          version_name?: string | null
          version_number?: number
          version_status?: Database["public"]["Enums"]["version_status"]
        }
        Relationships: []
      }
      widgets: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          initial_widget: boolean | null
          name: string
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          initial_widget?: boolean | null
          name: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          initial_widget?: boolean | null
          name?: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      component_id_debug_view: {
        Row: {
          component_id_code: string | null
          created_at: string | null
          id: string | null
          name: string | null
          sub_classification_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "components_sub_classification_id_fkey"
            columns: ["sub_classification_id"]
            isOneToOne: false
            referencedRelation: "sub_classification"
            referencedColumns: ["id"]
          },
        ]
      }
      components_with_specs: {
        Row: {
          component_id_code: string | null
          component_type_head_id: string | null
          created_at: string | null
          description: string | null
          id: string | null
          image_url: string | null
          manufacturer_id: string | null
          name: string | null
          specifications: Json | null
          sub_classification_id: string | null
          vendor_id: string | null
          website_url: string | null
        }
        Relationships: [
          {
            foreignKeyName: "components_manufacturer_id_fkey"
            columns: ["manufacturer_id"]
            isOneToOne: false
            referencedRelation: "manufacturer_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "components_sub_classification_id_fkey"
            columns: ["sub_classification_id"]
            isOneToOne: false
            referencedRelation: "sub_classification"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "components_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_component_type_head"
            columns: ["component_type_head_id"]
            isOneToOne: false
            referencedRelation: "component_type_head"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      activate_version: {
        Args: { p_version_id: string }
        Returns: boolean
      }
      add_component_to_bom: {
        Args: { p_component_id: string; p_user_id: string }
        Returns: {
          id: string
          component_id: string
          user_id: string
          quantity: number
        }[]
      }
      create_new_version: {
        Args: {
          p_logic_flow_id: string
          p_version_name?: string
          p_description?: string
          p_created_by?: string
        }
        Returns: string
      }
      generate_component_id_code: {
        Args: {
          p_menu_code: string
          p_submenu_code: string
          p_classification_code: string
          p_subclassification_code: string
          p_component_name: string
          p_component_type_head_id?: string
          p_short_code?: string
        }
        Returns: string
      }
      generate_short_code: {
        Args: Record<PropertyKey, never> | { component_name: string }
        Returns: string
      }
      get_active_version: {
        Args: { p_logic_flow_id: string }
        Returns: {
          version_id: string
          version_number: number
          version_name: string
          created_at: string
        }[]
      }
      get_and_increment_component_serial: {
        Args: { p_prefix: string }
        Returns: number
      }
      get_component_type_head_code: {
        Args: { head_id: string }
        Returns: string
      }
      get_entity_type_values: {
        Args: Record<PropertyKey, never>
        Returns: {
          value: string
        }[]
      }
      is_component_in_bom: {
        Args: { p_component_id: string; p_user_id: string }
        Returns: boolean
      }
      show_component_id_function_usage: {
        Args: Record<PropertyKey, never>
        Returns: {
          function_name: string
          parameter_list: string
          function_body: string
        }[]
      }
    }
    Enums: {
      entity_type: "element" | "coe" | "screen" | "core_set" | "widget"
      execution_status: "success" | "failure" | "timeout"
      node_type: "input" | "processing" | "decision" | "output"
      rule_complexity: "simple" | "medium" | "complex"
      rule_status: "draft" | "active" | "inactive" | "error"
      template_type: "rule" | "formula" | "workflow"
      version_status: "draft" | "active" | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      entity_type: ["element", "coe", "screen", "core_set", "widget"],
      execution_status: ["success", "failure", "timeout"],
      node_type: ["input", "processing", "decision", "output"],
      rule_complexity: ["simple", "medium", "complex"],
      rule_status: ["draft", "active", "inactive", "error"],
      template_type: ["rule", "formula", "workflow"],
      version_status: ["draft", "active", "archived"],
    },
  },
} as const
