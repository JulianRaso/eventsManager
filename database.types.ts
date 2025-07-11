export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      bill: {
        Row: {
          amount: number;
          booking_id: number | null;
          cbu: number | null;
          created_at: string;
          id: number;
          name: string;
          paid_by: string;
          paid_to: string | null;
          paid_with: Database["public"]["Enums"]["paid_with"];
          quantity: number;
          updated_by: string;
        };
        Insert: {
          amount: number;
          booking_id?: number | null;
          cbu?: number | null;
          created_at?: string;
          id?: number;
          name: string;
          paid_by: string;
          paid_to?: string | null;
          paid_with: Database["public"]["Enums"]["paid_with"];
          quantity: number;
          updated_by: string;
        };
        Update: {
          amount?: string;
          booking_id?: number | null;
          cbu?: number | null;
          created_at?: string;
          id?: number;
          name?: string;
          paid_by?: string;
          paid_to?: string | null;
          paid_with?: Database["public"]["Enums"]["paid_with"];
          quantity?: number;
          updated_by?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bill_booking_id_fkey";
            columns: ["booking_id"];
            isOneToOne: false;
            referencedRelation: "booking";
            referencedColumns: ["id"];
          }
        ];
      };
      booking: {
        Row: {
          booking_status: Database["public"]["Enums"]["event_status"];
          client_dni: number;
          comments: string | null;
          created_at: string;
          event_date: string;
          event_type: Database["public"]["Enums"]["event_type"];
          id: number;
          organization: Database["public"]["Enums"]["organization"];
          payment_status: Database["public"]["Enums"]["paid_status"];
          place: string;
          price: number;
          revenue: number;
          tax: number;
        };
        Insert: {
          booking_status?: Database["public"]["Enums"]["event_status"];
          client_dni: number;
          comments?: string | null;
          created_at?: string;
          event_date: string;
          event_type?: Database["public"]["Enums"]["event_type"];
          id?: number;
          organization?: Database["public"]["Enums"]["organization"];
          payment_status?: Database["public"]["Enums"]["paid_status"];
          place: string;
          price?: number;
          revenue?: number;
          tax?: number;
        };
        Update: {
          booking_status?: Database["public"]["Enums"]["event_status"];
          client_dni?: number;
          comments?: string | null;
          created_at?: string;
          event_date?: string;
          event_type?: Database["public"]["Enums"]["event_type"];
          id?: number;
          organization?: Database["public"]["Enums"]["organization"];
          payment_status?: Database["public"]["Enums"]["paid_status"];
          place?: string;
          price?: number;
          revenue?: number;
          tax?: number;
        };
        Relationships: [
          {
            foreignKeyName: "booking_client_dni_fkey";
            columns: ["client_dni"];
            isOneToOne: false;
            referencedRelation: "client";
            referencedColumns: ["dni"];
          }
        ];
      };
      booking_items: {
        Row: {
          booking_id: number;
          equipment_id: number;
          id: number;
          name: string;
          price: number;
          quantity: number;
        };
        Insert: {
          booking_id: number;
          equipment_id: number;
          id?: number;
          name: string;
          price: number;
          quantity: number;
        };
        Update: {
          booking_id?: number;
          equipment_id?: number;
          id?: number;
          name?: string;
          price?: number;
          quantity?: number;
        };
        Relationships: [
          {
            foreignKeyName: "booking_items_booking_id_fkey";
            columns: ["booking_id"];
            isOneToOne: false;
            referencedRelation: "booking";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "booking_items_equipment_id_fkey";
            columns: ["equipment_id"];
            isOneToOne: false;
            referencedRelation: "inventory";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "booking_items_name_fkey";
            columns: ["name"];
            isOneToOne: false;
            referencedRelation: "inventory";
            referencedColumns: ["name"];
          }
        ];
      };
      client: {
        Row: {
          created_at: string;
          dni: number;
          email: string | null;
          lastName: string;
          name: string;
          phoneNumber: string;
        };
        Insert: {
          created_at?: string;
          dni: number;
          email?: string | null;
          lastName: string;
          name: string;
          phoneNumber: string;
        };
        Update: {
          created_at?: string;
          dni?: number;
          email?: string | null;
          lastName?: string;
          name?: string;
          phoneNumber?: string;
        };
        Relationships: [];
      };
      inventory: {
        Row: {
          category: Database["public"]["Enums"]["category"];
          id: number;
          last_update: string;
          location: string;
          name: string;
          price: number;
          quantity: number;
          updated_by: string;
        };
        Insert: {
          category?: Database["public"]["Enums"]["category"];
          id?: number;
          last_update?: string;
          location: string;
          name: string;
          price?: number;
          quantity: number;
          updated_by?: string;
        };
        Update: {
          category?: Database["public"]["Enums"]["category"];
          id?: number;
          last_update?: string;
          location?: string;
          name?: string;
          price?: number;
          quantity?: number;
          updated_by?: string;
        };
        Relationships: [];
      };
      vehicles: {
        Row: {
          brand: string;
          created_at: string;
          id: number;
          last_service: string | null;
          license_plate: string;
          model: string;
          notes: string | null;
          status: Database["public"]["Enums"]["status"];
          type: string;
          updated_by: string;
          year: number;
        };
        Insert: {
          brand: string;
          created_at?: string;
          id?: number;
          last_service?: string | null;
          license_plate: string;
          model: string;
          notes?: string | null;
          status: Database["public"]["Enums"]["status"];
          type: string;
          updated_by?: string;
          year: number;
        };
        Update: {
          brand?: string;
          created_at?: string;
          id?: number;
          last_service?: string | null;
          license_plate?: string;
          model?: string;
          notes?: string | null;
          status?: Database["public"]["Enums"]["status"];
          type?: string;
          updated_by?: string;
          year?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      category:
        | "lights"
        | "ambientation"
        | "sound"
        | "structure"
        | "tools"
        | "cables"
        | "others"
        | "furniture"
        | "screen";
      event_status: "pending" | "cancel" | "confirm";
      event_type:
        | "birthday"
        | "marriage"
        | "corporate"
        | "fifteen_party"
        | "other";
      organization: "Muzek" | "Show Rental";
      paid_status: "pending" | "partially_paid" | "paid";
      paid_with: "cash" | "card" | "transfer" | "bank check";
      status: "available" | "inUse" | "maintenance";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {
      category: [
        "lights",
        "ambientation",
        "sound",
        "structure",
        "tools",
        "cables",
        "others",
        "furniture",
        "screen",
      ],
      event_status: ["pending", "cancel", "confirm"],
      event_type: [
        "birthday",
        "marriage",
        "corporate",
        "fifteen_party",
        "other",
      ],
      organization: ["Muzek", "Show Rental"],
      paid_status: ["pending", "partially_paid", "paid"],
      paid_with: ["cash", "card", "transfer", "bank check"],
      status: ["available", "inUse", "maintenance"],
    },
  },
} as const;
