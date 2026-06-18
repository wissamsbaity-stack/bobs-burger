/**
 * Supabase database types.
 * Regenerate after schema changes:
 * npx supabase gen types typescript --project-id <id> > src/lib/supabase/types.ts
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface OpeningHour {
  days: string;
  time: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: "admin" | "staff";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: "admin" | "staff";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: "admin" | "staff";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: string;
          singleton: boolean;
          restaurant_name: string;
          legal_name: string | null;
          tagline: string | null;
          whatsapp_phone: string;
          phone_primary: string | null;
          phone_secondary: string | null;
          email: string | null;
          address_street: string | null;
          address_city: string | null;
          address_state: string | null;
          address_country: string | null;
          opening_hours: OpeningHour[];
          delivery_fee: number;
          min_order: number;
          instagram_url: string | null;
          facebook_url: string | null;
          logo_url: string | null;
          cover_url: string | null;
          hero_image_url: string | null;
          site_url: string | null;
          meta_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          singleton?: boolean;
          restaurant_name?: string;
          legal_name?: string | null;
          tagline?: string | null;
          whatsapp_phone?: string;
          phone_primary?: string | null;
          phone_secondary?: string | null;
          email?: string | null;
          address_street?: string | null;
          address_city?: string | null;
          address_state?: string | null;
          address_country?: string | null;
          opening_hours?: OpeningHour[];
          delivery_fee?: number;
          min_order?: number;
          instagram_url?: string | null;
          facebook_url?: string | null;
          logo_url?: string | null;
          cover_url?: string | null;
          hero_image_url?: string | null;
          site_url?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          singleton?: boolean;
          restaurant_name?: string;
          legal_name?: string | null;
          tagline?: string | null;
          whatsapp_phone?: string;
          phone_primary?: string | null;
          phone_secondary?: string | null;
          email?: string | null;
          address_street?: string | null;
          address_city?: string | null;
          address_state?: string | null;
          address_country?: string | null;
          opening_hours?: OpeningHour[];
          delivery_fee?: number;
          min_order?: number;
          instagram_url?: string | null;
          facebook_url?: string | null;
          logo_url?: string | null;
          cover_url?: string | null;
          hero_image_url?: string | null;
          site_url?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          slug: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      menu_items: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          slug: string;
          description: string | null;
          price: number;
          image_url: string | null;
          is_popular: boolean;
          is_best_seller: boolean;
          is_available: boolean;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          category_id: string;
          name: string;
          slug: string;
          description?: string | null;
          price: number;
          image_url?: string | null;
          is_popular?: boolean;
          is_best_seller?: boolean;
          is_available?: boolean;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          price?: number;
          image_url?: string | null;
          is_popular?: boolean;
          is_best_seller?: boolean;
          is_available?: boolean;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          id: string;
          customer_name: string;
          customer_phone: string;
          city: string;
          street: string;
          building: string;
          delivery_instructions: string | null;
          items: Json;
          subtotal: number;
          delivery_fee: number;
          total: number;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          customer_phone: string;
          city: string;
          street: string;
          building: string;
          delivery_instructions?: string | null;
          items: Json;
          subtotal: number;
          delivery_fee: number;
          total: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          customer_phone?: string;
          city?: string;
          street?: string;
          building?: string;
          delivery_instructions?: string | null;
          items?: Json;
          subtotal?: number;
          delivery_fee?: number;
          total?: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type SiteSettingsRow = Database["public"]["Tables"]["site_settings"]["Row"];
export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
export type MenuItemRow = Database["public"]["Tables"]["menu_items"]["Row"];
export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
