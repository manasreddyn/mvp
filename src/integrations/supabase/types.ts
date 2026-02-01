export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_predictions: {
        Row: {
          actual_value: Json | null
          confidence_score: number | null
          created_at: string
          device_id: string | null
          id: string
          outcome_timestamp: string | null
          predicted_value: Json
          prediction_timestamp: string
          prediction_type: string
        }
        Insert: {
          actual_value?: Json | null
          confidence_score?: number | null
          created_at?: string
          device_id?: string | null
          id?: string
          outcome_timestamp?: string | null
          predicted_value?: Json
          prediction_timestamp?: string
          prediction_type: string
        }
        Update: {
          actual_value?: Json | null
          confidence_score?: number | null
          created_at?: string
          device_id?: string | null
          id?: string
          outcome_timestamp?: string | null
          predicted_value?: Json
          prediction_timestamp?: string
          prediction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_predictions_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "iot_devices"
            referencedColumns: ["id"]
          },
        ]
      }
      iot_alerts: {
        Row: {
          acknowledged_at: string | null
          alert_type: Database["public"]["Enums"]["alert_severity"]
          created_at: string
          device_id: string | null
          id: string
          is_acknowledged: boolean | null
          message: string | null
          resolved_at: string | null
          severity: number | null
          title: string
        }
        Insert: {
          acknowledged_at?: string | null
          alert_type?: Database["public"]["Enums"]["alert_severity"]
          created_at?: string
          device_id?: string | null
          id?: string
          is_acknowledged?: boolean | null
          message?: string | null
          resolved_at?: string | null
          severity?: number | null
          title: string
        }
        Update: {
          acknowledged_at?: string | null
          alert_type?: Database["public"]["Enums"]["alert_severity"]
          created_at?: string
          device_id?: string | null
          id?: string
          is_acknowledged?: boolean | null
          message?: string | null
          resolved_at?: string | null
          severity?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "iot_alerts_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "iot_devices"
            referencedColumns: ["id"]
          },
        ]
      }
      iot_devices: {
        Row: {
          category: Database["public"]["Enums"]["device_category"]
          created_at: string
          device_name: string
          device_type: Database["public"]["Enums"]["device_type"]
          firmware_version: string | null
          id: string
          last_seen: string | null
          location: Json | null
          metadata: Json | null
          status: Database["public"]["Enums"]["device_status"]
          updated_at: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["device_category"]
          created_at?: string
          device_name: string
          device_type?: Database["public"]["Enums"]["device_type"]
          firmware_version?: string | null
          id?: string
          last_seen?: string | null
          location?: Json | null
          metadata?: Json | null
          status?: Database["public"]["Enums"]["device_status"]
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["device_category"]
          created_at?: string
          device_name?: string
          device_type?: Database["public"]["Enums"]["device_type"]
          firmware_version?: string | null
          id?: string
          last_seen?: string | null
          location?: Json | null
          metadata?: Json | null
          status?: Database["public"]["Enums"]["device_status"]
          updated_at?: string
        }
        Relationships: []
      }
      iot_rules: {
        Row: {
          action: Json
          condition: Json
          created_at: string
          device_id: string | null
          id: string
          is_active: boolean | null
          priority: number | null
          rule_name: string
          trigger_count: number | null
          updated_at: string
        }
        Insert: {
          action?: Json
          condition?: Json
          created_at?: string
          device_id?: string | null
          id?: string
          is_active?: boolean | null
          priority?: number | null
          rule_name: string
          trigger_count?: number | null
          updated_at?: string
        }
        Update: {
          action?: Json
          condition?: Json
          created_at?: string
          device_id?: string | null
          id?: string
          is_active?: boolean | null
          priority?: number | null
          rule_name?: string
          trigger_count?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "iot_rules_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "iot_devices"
            referencedColumns: ["id"]
          },
        ]
      }
      sensor_data: {
        Row: {
          device_id: string | null
          id: string
          metadata: Json | null
          quality: number | null
          sensor_type: string
          timestamp: string
          unit: string | null
          value: number
        }
        Insert: {
          device_id?: string | null
          id?: string
          metadata?: Json | null
          quality?: number | null
          sensor_type: string
          timestamp?: string
          unit?: string | null
          value: number
        }
        Update: {
          device_id?: string | null
          id?: string
          metadata?: Json | null
          quality?: number | null
          sensor_type?: string
          timestamp?: string
          unit?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "sensor_data_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "iot_devices"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      alert_severity: "info" | "warning" | "critical"
      device_category:
        | "smart_home"
        | "industrial"
        | "environmental"
        | "fleet"
        | "healthcare"
        | "energy"
        | "railway"
      device_status: "active" | "inactive" | "maintenance" | "error"
      device_type: "sensor" | "actuator" | "gateway" | "hybrid"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      alert_severity: ["info", "warning", "critical"],
      device_category: [
        "smart_home",
        "industrial",
        "environmental",
        "fleet",
        "healthcare",
        "energy",
        "railway",
      ],
      device_status: ["active", "inactive", "maintenance", "error"],
      device_type: ["sensor", "actuator", "gateway", "hybrid"],
    },
  },
} as const
