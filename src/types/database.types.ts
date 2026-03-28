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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      accounting_accounts: {
        Row: {
          code: string
          created_at: string | null
          id: number
          name: string
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: number
          name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      bill: {
        Row: {
          amount: number
          booking_id: number | null
          cbu: number | null
          created_at: string
          id: number
          name: string
          paid_by: string
          paid_to: string | null
          paid_with: Database["public"]["Enums"]["paid_with"]
          quantity: number
          updated_by: string
        }
        Insert: {
          amount: number
          booking_id?: number | null
          cbu?: number | null
          created_at?: string
          id?: number
          name: string
          paid_by: string
          paid_to?: string | null
          paid_with: Database["public"]["Enums"]["paid_with"]
          quantity: number
          updated_by: string
        }
        Update: {
          amount?: number
          booking_id?: number | null
          cbu?: number | null
          created_at?: string
          id?: number
          name?: string
          paid_by?: string
          paid_to?: string | null
          paid_with?: Database["public"]["Enums"]["paid_with"]
          quantity?: number
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "bill_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "booking"
            referencedColumns: ["id"]
          },
        ]
      }
      booking: {
        Row: {
          booking_status: Database["public"]["Enums"]["event_status"]
          cash_advance: number | null
          client_dni: number
          comments: string | null
          created_at: string
          event_date: string
          event_type: Database["public"]["Enums"]["event_type"]
          id: number
          organization: Database["public"]["Enums"]["organization"]
          organization_id: string | null
          payment_status: Database["public"]["Enums"]["paid_status"]
          place: string
          price: number
          revenue: number
          tax: number
        }
        Insert: {
          booking_status?: Database["public"]["Enums"]["event_status"]
          cash_advance?: number | null
          client_dni: number
          comments?: string | null
          created_at?: string
          event_date: string
          event_type?: Database["public"]["Enums"]["event_type"]
          id?: number
          organization?: Database["public"]["Enums"]["organization"]
          organization_id?: string | null
          payment_status?: Database["public"]["Enums"]["paid_status"]
          place: string
          price?: number
          revenue?: number
          tax?: number
        }
        Update: {
          booking_status?: Database["public"]["Enums"]["event_status"]
          cash_advance?: number | null
          client_dni?: number
          comments?: string | null
          created_at?: string
          event_date?: string
          event_type?: Database["public"]["Enums"]["event_type"]
          id?: number
          organization?: Database["public"]["Enums"]["organization"]
          organization_id?: string | null
          payment_status?: Database["public"]["Enums"]["paid_status"]
          place?: string
          price?: number
          revenue?: number
          tax?: number
        }
        Relationships: [
          {
            foreignKeyName: "booking_client_dni_fkey"
            columns: ["client_dni"]
            isOneToOne: false
            referencedRelation: "client"
            referencedColumns: ["dni"]
          },
          {
            foreignKeyName: "booking_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_items: {
        Row: {
          booking_id: number
          equipment_id: number
          id: number
          name: string
          price: number
          quantity: number
        }
        Insert: {
          booking_id: number
          equipment_id: number
          id?: number
          name: string
          price: number
          quantity: number
        }
        Update: {
          booking_id?: number
          equipment_id?: number
          id?: number
          name?: string
          price?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "booking_items_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "booking"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_items_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_items_name_fkey"
            columns: ["name"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["name"]
          },
        ]
      }
      booking_payments: {
        Row: {
          amount: number
          booking_id: number | null
          created_at: string | null
          id: number
          notes: string | null
          payment_date: string
          payment_method: string
        }
        Insert: {
          amount: number
          booking_id?: number | null
          created_at?: string | null
          id?: number
          notes?: string | null
          payment_date?: string
          payment_method: string
        }
        Update: {
          amount?: number
          booking_id?: number | null
          created_at?: string | null
          id?: number
          notes?: string | null
          payment_date?: string
          payment_method?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "booking"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_personal: {
        Row: {
          booking_id: number | null
          created_at: string | null
          days: number
          id: number
          notes: string | null
          personal_id: number | null
          rate: number
        }
        Insert: {
          booking_id?: number | null
          created_at?: string | null
          days?: number
          id?: number
          notes?: string | null
          personal_id?: number | null
          rate: number
        }
        Update: {
          booking_id?: number | null
          created_at?: string | null
          days?: number
          id?: number
          notes?: string | null
          personal_id?: number | null
          rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "booking_personal_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "booking"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_personal_personal_id_fkey"
            columns: ["personal_id"]
            isOneToOne: false
            referencedRelation: "personal"
            referencedColumns: ["id"]
          },
        ]
      }
      client: {
        Row: {
          created_at: string
          dni: number
          email: string | null
          lastName: string
          name: string
          phoneNumber: string
        }
        Insert: {
          created_at?: string
          dni: number
          email?: string | null
          lastName: string
          name: string
          phoneNumber: string
        }
        Update: {
          created_at?: string
          dni?: number
          email?: string | null
          lastName?: string
          name?: string
          phoneNumber?: string
        }
        Relationships: []
      }
      inventory: {
        Row: {
          category: Database["public"]["Enums"]["category"]
          id: number
          last_update: string
          location: string
          name: string
          price: number
          quantity: number
          updated_by: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["category"]
          id?: number
          last_update?: string
          location: string
          name: string
          price?: number
          quantity: number
          updated_by?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["category"]
          id?: number
          last_update?: string
          location?: string
          name?: string
          price?: number
          quantity?: number
          updated_by?: string
        }
        Relationships: []
      }
      item_accounting: {
        Row: {
          equipment_id: number
          purchase_account_id: number | null
          sale_account_id: number | null
          updated_at: string | null
        }
        Insert: {
          equipment_id: number
          purchase_account_id?: number | null
          sale_account_id?: number | null
          updated_at?: string | null
        }
        Update: {
          equipment_id?: number
          purchase_account_id?: number | null
          sale_account_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "item_accounting_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: true
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_accounting_purchase_account_id_fkey"
            columns: ["purchase_account_id"]
            isOneToOne: false
            referencedRelation: "accounting_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_accounting_sale_account_id_fkey"
            columns: ["sale_account_id"]
            isOneToOne: false
            referencedRelation: "accounting_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      member_roles: {
        Row: {
          org_member_id: string
          role_id: string
        }
        Insert: {
          org_member_id: string
          role_id: string
        }
        Update: {
          org_member_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_roles_org_member_id_fkey"
            columns: ["org_member_id"]
            isOneToOne: false
            referencedRelation: "org_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      org_members: {
        Row: {
          id: string
          joined_at: string
          organization_id: string
          status: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          organization_id: string
          status?: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          organization_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "org_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      permissions: {
        Row: {
          action: string
          code: string
          description: string | null
          id: string
          module: string
        }
        Insert: {
          action: string
          code: string
          description?: string | null
          id?: string
          module: string
        }
        Update: {
          action?: string
          code?: string
          description?: string | null
          id?: string
          module?: string
        }
        Relationships: []
      }
      personal: {
        Row: {
          created_at: string | null
          daily_rate: number
          dni: number | null
          id: number
          lastName: string
          name: string
          notes: string | null
          phoneNumber: string | null
          role: string
        }
        Insert: {
          created_at?: string | null
          daily_rate: number
          dni?: number | null
          id?: number
          lastName: string
          name: string
          notes?: string | null
          phoneNumber?: string | null
          role: string
        }
        Update: {
          created_at?: string | null
          daily_rate?: number
          dni?: number | null
          id?: number
          lastName?: string
          name?: string
          notes?: string | null
          phoneNumber?: string | null
          role?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name: string
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      purchase_items: {
        Row: {
          created_at: string | null
          equipment_id: number | null
          id: number
          name: string
          purchase_id: number | null
          quantity: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          equipment_id?: number | null
          id?: number
          name: string
          purchase_id?: number | null
          quantity: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          equipment_id?: number | null
          id?: number
          name?: string
          purchase_id?: number | null
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchase_items_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_items_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "purchases"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_payments: {
        Row: {
          amount: number
          created_at: string | null
          id: number
          notes: string | null
          payment_date: string
          payment_method: string
          purchase_id: number | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: number
          notes?: string | null
          payment_date?: string
          payment_method: string
          purchase_id?: number | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: number
          notes?: string | null
          payment_date?: string
          payment_method?: string
          purchase_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_payments_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "purchases"
            referencedColumns: ["id"]
          },
        ]
      }
      purchases: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          notes: string | null
          payment_status: string
          purchase_date: string
          supplier_id: number | null
          total_price: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          notes?: string | null
          payment_status?: string
          purchase_date?: string
          supplier_id?: number | null
          total_price?: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          notes?: string | null
          payment_status?: string
          purchase_date?: string
          supplier_id?: number | null
          total_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchases_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          permission_id: string
          role_id: string
        }
        Insert: {
          permission_id: string
          role_id: string
        }
        Update: {
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          id: string
          is_system: boolean
          name: string
          organization_id: string
        }
        Insert: {
          id?: string
          is_system?: boolean
          name: string
          organization_id: string
        }
        Update: {
          id?: string
          is_system?: boolean
          name?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          contact_name: string | null
          created_at: string | null
          email: string | null
          id: number
          name: string
          notes: string | null
          phone: string | null
          tax_id: string | null
        }
        Insert: {
          address?: string | null
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: number
          name: string
          notes?: string | null
          phone?: string | null
          tax_id?: string | null
        }
        Update: {
          address?: string | null
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: number
          name?: string
          notes?: string | null
          phone?: string | null
          tax_id?: string | null
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          brand: string
          created_at: string
          id: number
          last_service: string | null
          license_plate: string
          model: string
          notes: string | null
          status: Database["public"]["Enums"]["status"]
          type: string
          updated_by: string
          year: number
        }
        Insert: {
          brand: string
          created_at?: string
          id?: number
          last_service?: string | null
          license_plate: string
          model: string
          notes?: string | null
          status: Database["public"]["Enums"]["status"]
          type: string
          updated_by?: string
          year: number
        }
        Update: {
          brand?: string
          created_at?: string
          id?: number
          last_service?: string | null
          license_plate?: string
          model?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["status"]
          type?: string
          updated_by?: string
          year?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      events_per_month_per_company: {
        Args: never
        Returns: {
          date: string
          muzek: number
          "show Rental": number
        }[]
      }
      get_month_bookings: {
        Args: never
        Returns: {
          booking_status: string
          organization: string
        }[]
      }
      has_permission: {
        Args: { p_code: string; p_org: string }
        Returns: boolean
      }
      incomes_per_month: {
        Args: never
        Returns: {
          income: number
          month: string
        }[]
      }
      monthly_events: {
        Args: never
        Returns: {
          booking_status: string
          total: number
        }[]
      }
      monthly_events_by_company: { Args: { year_input: number }; Returns: Json }
      monthly_sales: { Args: never; Returns: number }
      most_used_items: {
        Args: never
        Returns: {
          name: string
          total: number
        }[]
      }
    }
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
        | "screen"
      event_status: "pending" | "cancel" | "confirm"
      event_type:
        | "birthday"
        | "marriage"
        | "corporate"
        | "fifteen_party"
        | "other"
      organization: "Muzek" | "Show Rental"
      paid_status: "pending" | "partially_paid" | "paid"
      paid_with: "cash" | "card" | "transfer" | "bank check"
      status: "available" | "inUse" | "maintenance"
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
} as const
