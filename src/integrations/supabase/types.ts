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
      activities: {
        Row: {
          activity_date: string
          activity_time: string
          created_at: string
          description: string
          description_chinese: string
          description_malay: string
          description_tamil: string
          id: string
          image_url: string | null
          location: string
          location_chinese: string
          location_malay: string
          location_tamil: string
          max_attendees: number | null
          points_reward: number
          title: string
          title_chinese: string
          title_malay: string
          title_tamil: string
        }
        Insert: {
          activity_date: string
          activity_time: string
          created_at?: string
          description: string
          description_chinese: string
          description_malay: string
          description_tamil: string
          id?: string
          image_url?: string | null
          location: string
          location_chinese: string
          location_malay: string
          location_tamil: string
          max_attendees?: number | null
          points_reward?: number
          title: string
          title_chinese: string
          title_malay: string
          title_tamil: string
        }
        Update: {
          activity_date?: string
          activity_time?: string
          created_at?: string
          description?: string
          description_chinese?: string
          description_malay?: string
          description_tamil?: string
          id?: string
          image_url?: string | null
          location?: string
          location_chinese?: string
          location_malay?: string
          location_tamil?: string
          max_attendees?: number | null
          points_reward?: number
          title?: string
          title_chinese?: string
          title_malay?: string
          title_tamil?: string
        }
        Relationships: []
      }
      activity_participations: {
        Row: {
          activity_id: string
          id: string
          joined_at: string
          points_earned: number
          user_id: string
        }
        Insert: {
          activity_id: string
          id?: string
          joined_at?: string
          points_earned?: number
          user_id: string
        }
        Update: {
          activity_id?: string
          id?: string
          joined_at?: string
          points_earned?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_participations_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_participations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      available_hobbies: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      event_memories: {
        Row: {
          activity_id: string | null
          created_at: string
          id: string
          memory_text: string | null
          photo_url: string | null
          user_id: string | null
        }
        Insert: {
          activity_id?: string | null
          created_at?: string
          id?: string
          memory_text?: string | null
          photo_url?: string | null
          user_id?: string | null
        }
        Update: {
          activity_id?: string | null
          created_at?: string
          id?: string
          memory_text?: string | null
          photo_url?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_memories_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_memories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_ratings: {
        Row: {
          activity_id: string | null
          comment: string | null
          created_at: string
          id: string
          rating: number | null
          user_id: string | null
        }
        Insert: {
          activity_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          activity_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_ratings_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_ratings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      friend_referrals: {
        Row: {
          bonus_points_awarded: boolean | null
          created_at: string
          id: string
          referred_phone: string
          referred_user_id: string | null
          referrer_id: string | null
        }
        Insert: {
          bonus_points_awarded?: boolean | null
          created_at?: string
          id?: string
          referred_phone: string
          referred_user_id?: string | null
          referrer_id?: string | null
        }
        Update: {
          bonus_points_awarded?: boolean | null
          created_at?: string
          id?: string
          referred_phone?: string
          referred_user_id?: string | null
          referrer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "friend_referrals_referred_user_id_fkey"
            columns: ["referred_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friend_referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      friendships: {
        Row: {
          created_at: string
          friend_id: string
          id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          friend_id: string
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          friend_id?: string
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "friendships_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          phone_number: string
          points: number
          qr_code: string
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          phone_number: string
          points?: number
          qr_code: string
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          phone_number?: string
          points?: number
          qr_code?: string
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      reward_redemptions: {
        Row: {
          id: string
          points_spent: number
          redeemed_at: string
          reward_id: string
          user_id: string
        }
        Insert: {
          id?: string
          points_spent: number
          redeemed_at?: string
          reward_id: string
          user_id: string
        }
        Update: {
          id?: string
          points_spent?: number
          redeemed_at?: string
          reward_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reward_redemptions_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reward_redemptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards: {
        Row: {
          created_at: string
          description: string
          description_chinese: string
          description_malay: string
          description_tamil: string
          id: string
          image_url: string | null
          is_available: boolean
          points_cost: number
          title: string
          title_chinese: string
          title_malay: string
          title_tamil: string
        }
        Insert: {
          created_at?: string
          description: string
          description_chinese: string
          description_malay: string
          description_tamil: string
          id?: string
          image_url?: string | null
          is_available?: boolean
          points_cost: number
          title: string
          title_chinese: string
          title_malay: string
          title_tamil: string
        }
        Update: {
          created_at?: string
          description?: string
          description_chinese?: string
          description_malay?: string
          description_tamil?: string
          id?: string
          image_url?: string | null
          is_available?: boolean
          points_cost?: number
          title?: string
          title_chinese?: string
          title_malay?: string
          title_tamil?: string
        }
        Relationships: []
      }
      user_hobbies: {
        Row: {
          created_at: string
          hobby_name: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          hobby_name: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          hobby_name?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_hobbies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
    Enums: {},
  },
} as const
