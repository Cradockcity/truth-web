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
      bookings: {
        Row: {
          created_at: string | null
          creator_id: string | null
          creator_snapshot: Json | null
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          experience_id: string | null
          experience_snapshot: Json | null
          guest_count: number | null
          host_id: string | null
          host_snapshot: Json | null
          id: string
          selected_date: string | null
          selected_time: string | null
          status: string | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          creator_id?: string | null
          creator_snapshot?: Json | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          experience_id?: string | null
          experience_snapshot?: Json | null
          guest_count?: number | null
          host_id?: string | null
          host_snapshot?: Json | null
          id?: string
          selected_date?: string | null
          selected_time?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          creator_id?: string | null
          creator_snapshot?: Json | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          experience_id?: string | null
          experience_snapshot?: Json | null
          guest_count?: number | null
          host_id?: string | null
          host_snapshot?: Json | null
          id?: string
          selected_date?: string | null
          selected_time?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "hosts"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_experience_referrals: {
        Row: {
          creator_id: string
          experience_id: string
        }
        Insert: {
          creator_id: string
          experience_id: string
        }
        Update: {
          creator_id?: string
          experience_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_experience_referrals_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_experience_referrals_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
        ]
      }
      creators: {
        Row: {
          avatar_url: string | null
          bio: string | null
          cover_image_url: string | null
          created_at: string | null
          featured_in: string[] | null
          follower_count: string | null
          id: string
          location: string | null
          name: string
          personal_tags: string[] | null
          revenue_share_percentage: number | null
          signature_quote: string | null
          slug: string
          social_instagram: string | null
          social_tiktok: string | null
          social_website: string | null
          social_youtube: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          featured_in?: string[] | null
          follower_count?: string | null
          id?: string
          location?: string | null
          name: string
          personal_tags?: string[] | null
          revenue_share_percentage?: number | null
          signature_quote?: string | null
          slug: string
          social_instagram?: string | null
          social_tiktok?: string | null
          social_website?: string | null
          social_youtube?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          featured_in?: string[] | null
          follower_count?: string | null
          id?: string
          location?: string | null
          name?: string
          personal_tags?: string[] | null
          revenue_share_percentage?: number | null
          signature_quote?: string | null
          slug?: string
          social_instagram?: string | null
          social_tiktok?: string | null
          social_website?: string | null
          social_youtube?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      experience_itineraries: {
        Row: {
          activity: string | null
          created_at: string | null
          experience_id: string | null
          id: string
          order_index: number | null
          time: string | null
        }
        Insert: {
          activity?: string | null
          created_at?: string | null
          experience_id?: string | null
          id?: string
          order_index?: number | null
          time?: string | null
        }
        Update: {
          activity?: string | null
          created_at?: string | null
          experience_id?: string | null
          id?: string
          order_index?: number | null
          time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "experience_itineraries_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
        ]
      }
      experiences: {
        Row: {
          accessibility: string | null
          cancellation_policy: string | null
          category: string | null
          created_at: string | null
          description: string | null
          duration: string | null
          gallery_images: string[] | null
          google_place_id: string | null
          group_size: string | null
          highlights: string[] | null
          host_id: string | null
          id: string
          includes: string[] | null
          is_active: boolean | null
          location: string | null
          long_description: string | null
          main_image_url: string | null
          meeting_point: string | null
          price: number | null
          rating: number | null
          review_count: number | null
          title: string
          updated_at: string | null
          what_to_bring: string[] | null
        }
        Insert: {
          accessibility?: string | null
          cancellation_policy?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          gallery_images?: string[] | null
          google_place_id?: string | null
          group_size?: string | null
          highlights?: string[] | null
          host_id?: string | null
          id?: string
          includes?: string[] | null
          is_active?: boolean | null
          location?: string | null
          long_description?: string | null
          main_image_url?: string | null
          meeting_point?: string | null
          price?: number | null
          rating?: number | null
          review_count?: number | null
          title: string
          updated_at?: string | null
          what_to_bring?: string[] | null
        }
        Update: {
          accessibility?: string | null
          cancellation_policy?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          gallery_images?: string[] | null
          google_place_id?: string | null
          group_size?: string | null
          highlights?: string[] | null
          host_id?: string | null
          id?: string
          includes?: string[] | null
          is_active?: boolean | null
          location?: string | null
          long_description?: string | null
          main_image_url?: string | null
          meeting_point?: string | null
          price?: number | null
          rating?: number | null
          review_count?: number | null
          title?: string
          updated_at?: string | null
          what_to_bring?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "experiences_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "hosts"
            referencedColumns: ["id"]
          },
        ]
      }
      hosts: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string
          id: string
          joined_date: string | null
          languages: string[] | null
          location: string | null
          name: string
          revenue_share_percentage: number | null
          social_instagram: string | null
          social_twitter: string | null
          social_website: string | null
          specialties: string[] | null
          updated_at: string | null
          verification_badges: string[] | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email: string
          id?: string
          joined_date?: string | null
          languages?: string[] | null
          location?: string | null
          name: string
          revenue_share_percentage?: number | null
          social_instagram?: string | null
          social_twitter?: string | null
          social_website?: string | null
          specialties?: string[] | null
          updated_at?: string | null
          verification_badges?: string[] | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string
          id?: string
          joined_date?: string | null
          languages?: string[] | null
          location?: string | null
          name?: string
          revenue_share_percentage?: number | null
          social_instagram?: string | null
          social_twitter?: string | null
          social_website?: string | null
          specialties?: string[] | null
          updated_at?: string | null
          verification_badges?: string[] | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          author_avatar_url: string | null
          author_name: string | null
          comment: string | null
          created_at: string | null
          experience_id: string | null
          id: string
          rating: number | null
          updated_at: string | null
        }
        Insert: {
          author_avatar_url?: string | null
          author_name?: string | null
          comment?: string | null
          created_at?: string | null
          experience_id?: string | null
          id?: string
          rating?: number | null
          updated_at?: string | null
        }
        Update: {
          author_avatar_url?: string | null
          author_name?: string | null
          comment?: string | null
          created_at?: string | null
          experience_id?: string | null
          id?: string
          rating?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
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
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
