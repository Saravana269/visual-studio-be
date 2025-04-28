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
      class_of_elements: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
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
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          coe_ids?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          coe_ids?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      framework_types: {
        Row: {
          created_at: string | null
          id: string
          name: string
          property_values: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          property_values?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          property_values?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      screen_connectors: {
        Row: {
          condition_logic: Json | null
          created_at: string | null
          destination_screen_id: string | null
          framework_id: string | null
          id: string
          source_screen_id: string | null
          transition_type: string | null
          updated_at: string | null
        }
        Insert: {
          condition_logic?: Json | null
          created_at?: string | null
          destination_screen_id?: string | null
          framework_id?: string | null
          id?: string
          source_screen_id?: string | null
          transition_type?: string | null
          updated_at?: string | null
        }
        Update: {
          condition_logic?: Json | null
          created_at?: string | null
          destination_screen_id?: string | null
          framework_id?: string | null
          id?: string
          source_screen_id?: string | null
          transition_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "screen_connectors_destination_screen_id_fkey"
            columns: ["destination_screen_id"]
            isOneToOne: false
            referencedRelation: "screens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "screen_connectors_framework_id_fkey"
            columns: ["framework_id"]
            isOneToOne: false
            referencedRelation: "framework_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "screen_connectors_source_screen_id_fkey"
            columns: ["source_screen_id"]
            isOneToOne: false
            referencedRelation: "screens"
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
          metadata: Json | null
          name: string
          tags: string[] | null
          updated_at: string | null
          widget_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          framework_id?: string | null
          framework_type?: string | null
          id?: string
          metadata?: Json | null
          name: string
          tags?: string[] | null
          updated_at?: string | null
          widget_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          framework_id?: string | null
          framework_type?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          tags?: string[] | null
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
            foreignKeyName: "screens_widget_id_fkey"
            columns: ["widget_id"]
            isOneToOne: false
            referencedRelation: "widgets"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          created_at: string | null
          entity_id: string
          entity_type: Database["public"]["Enums"]["entity_type"]
          id: string
          label: string
        }
        Insert: {
          created_at?: string | null
          entity_id: string
          entity_type: Database["public"]["Enums"]["entity_type"]
          id?: string
          label: string
        }
        Update: {
          created_at?: string | null
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["entity_type"]
          id?: string
          label?: string
        }
        Relationships: []
      }
      widgets: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      entity_type: "element" | "coe" | "screen" | "core_set" | "widget"
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
    },
  },
} as const
