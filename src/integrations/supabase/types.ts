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
      admin_casting_content: {
        Row: {
          age_range: string | null
          application_deadline: string | null
          casting_director: string | null
          compensation_range: string | null
          created_at: string | null
          created_by: string
          description: string | null
          ethnicity_requirements: string | null
          gender_requirements: string | null
          genres: string[] | null
          id: string
          location: string | null
          production_company: string | null
          project_name: string | null
          published_at: string | null
          published_by: string | null
          requirements: string | null
          role_type: Database["public"]["Enums"]["role_type"]
          shoot_dates: string | null
          special_skills: string[] | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          age_range?: string | null
          application_deadline?: string | null
          casting_director?: string | null
          compensation_range?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          ethnicity_requirements?: string | null
          gender_requirements?: string | null
          genres?: string[] | null
          id?: string
          location?: string | null
          production_company?: string | null
          project_name?: string | null
          published_at?: string | null
          published_by?: string | null
          requirements?: string | null
          role_type: Database["public"]["Enums"]["role_type"]
          shoot_dates?: string | null
          special_skills?: string[] | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          age_range?: string | null
          application_deadline?: string | null
          casting_director?: string | null
          compensation_range?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          ethnicity_requirements?: string | null
          gender_requirements?: string | null
          genres?: string[] | null
          id?: string
          location?: string | null
          production_company?: string | null
          project_name?: string | null
          published_at?: string | null
          published_by?: string | null
          requirements?: string | null
          role_type?: Database["public"]["Enums"]["role_type"]
          shoot_dates?: string | null
          special_skills?: string[] | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      admin_course_content: {
        Row: {
          category: string | null
          created_at: string | null
          created_by: string
          description: string | null
          difficulty_level: string | null
          duration_minutes: number | null
          id: string
          instructor: string | null
          learning_objectives: string[] | null
          materials_url: string | null
          prerequisites: string[] | null
          price_tier: string | null
          published_at: string | null
          published_by: string | null
          status: string | null
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          id?: string
          instructor?: string | null
          learning_objectives?: string[] | null
          materials_url?: string | null
          prerequisites?: string[] | null
          price_tier?: string | null
          published_at?: string | null
          published_by?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          id?: string
          instructor?: string | null
          learning_objectives?: string[] | null
          materials_url?: string | null
          prerequisites?: string[] | null
          price_tier?: string | null
          published_at?: string | null
          published_by?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      agent_activities: {
        Row: {
          activity_type: string
          created_at: string
          details: Json | null
          id: string
          opportunity_id: string | null
          submission_id: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          details?: Json | null
          id?: string
          opportunity_id?: string | null
          submission_id?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          details?: Json | null
          id?: string
          opportunity_id?: string | null
          submission_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_activities_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "casting_opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_activities_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "role_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_configurations: {
        Row: {
          aggressiveness_level: string
          auto_apply_enabled: boolean
          created_at: string
          custom_instructions: string | null
          id: string
          max_applications_per_day: number
          minimum_confidence_score: number
          preferred_opportunity_types: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          aggressiveness_level?: string
          auto_apply_enabled?: boolean
          created_at?: string
          custom_instructions?: string | null
          id?: string
          max_applications_per_day?: number
          minimum_confidence_score?: number
          preferred_opportunity_types?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          aggressiveness_level?: string
          auto_apply_enabled?: boolean
          created_at?: string
          custom_instructions?: string | null
          id?: string
          max_applications_per_day?: number
          minimum_confidence_score?: number
          preferred_opportunity_types?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      casting_opportunities: {
        Row: {
          age_range: string | null
          application_deadline: string | null
          casting_director: string | null
          compensation_range: string | null
          created_at: string
          description: string | null
          ethnicity_requirements: string | null
          external_id: string | null
          external_url: string | null
          gender_requirements: string | null
          genres: string[] | null
          id: string
          location: string | null
          production_company: string | null
          project_name: string | null
          requirements: string | null
          role_type: Database["public"]["Enums"]["role_type"]
          shoot_dates: string | null
          source_platform: string | null
          special_skills: string[] | null
          status: Database["public"]["Enums"]["opportunity_status"]
          title: string
          updated_at: string
        }
        Insert: {
          age_range?: string | null
          application_deadline?: string | null
          casting_director?: string | null
          compensation_range?: string | null
          created_at?: string
          description?: string | null
          ethnicity_requirements?: string | null
          external_id?: string | null
          external_url?: string | null
          gender_requirements?: string | null
          genres?: string[] | null
          id?: string
          location?: string | null
          production_company?: string | null
          project_name?: string | null
          requirements?: string | null
          role_type: Database["public"]["Enums"]["role_type"]
          shoot_dates?: string | null
          source_platform?: string | null
          special_skills?: string[] | null
          status?: Database["public"]["Enums"]["opportunity_status"]
          title: string
          updated_at?: string
        }
        Update: {
          age_range?: string | null
          application_deadline?: string | null
          casting_director?: string | null
          compensation_range?: string | null
          created_at?: string
          description?: string | null
          ethnicity_requirements?: string | null
          external_id?: string | null
          external_url?: string | null
          gender_requirements?: string | null
          genres?: string[] | null
          id?: string
          location?: string | null
          production_company?: string | null
          project_name?: string | null
          requirements?: string | null
          role_type?: Database["public"]["Enums"]["role_type"]
          shoot_dates?: string | null
          source_platform?: string | null
          special_skills?: string[] | null
          status?: Database["public"]["Enums"]["opportunity_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      chat_histories: {
        Row: {
          chat_history: Json
          id: number
          updated_at: string | null
          user_email: string
        }
        Insert: {
          chat_history?: Json
          id?: number
          updated_at?: string | null
          user_email: string
        }
        Update: {
          chat_history?: Json
          id?: number
          updated_at?: string | null
          user_email?: string
        }
        Relationships: []
      }
      course_enrollments: {
        Row: {
          completed_at: string | null
          course_id: string
          enrolled_at: string
          id: string
          progress_percentage: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          enrolled_at?: string
          id?: string
          progress_percentage?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          enrolled_at?: string
          id?: string
          progress_percentage?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_provider_profiles: {
        Row: {
          bio: string | null
          company_name: string | null
          created_at: string
          id: string
          specialties: string[] | null
          updated_at: string
          user_id: string
          verified: boolean | null
          website: string | null
          years_experience: number | null
        }
        Insert: {
          bio?: string | null
          company_name?: string | null
          created_at?: string
          id?: string
          specialties?: string[] | null
          updated_at?: string
          user_id: string
          verified?: boolean | null
          website?: string | null
          years_experience?: number | null
        }
        Update: {
          bio?: string | null
          company_name?: string | null
          created_at?: string
          id?: string
          specialties?: string[] | null
          updated_at?: string
          user_id?: string
          verified?: boolean | null
          website?: string | null
          years_experience?: number | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          difficulty_level: string | null
          duration_minutes: number | null
          id: string
          learning_objectives: string[] | null
          materials_url: string | null
          prerequisites: string[] | null
          price_tier: string | null
          provider_id: string
          published_at: string | null
          status: string | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          id?: string
          learning_objectives?: string[] | null
          materials_url?: string | null
          prerequisites?: string[] | null
          price_tier?: string | null
          provider_id: string
          published_at?: string | null
          status?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          id?: string
          learning_objectives?: string[] | null
          materials_url?: string | null
          prerequisites?: string[] | null
          price_tier?: string | null
          provider_id?: string
          published_at?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      daily_chat_limits: {
        Row: {
          chat_limit_reached: boolean | null
          email: string
          messages_per_day: number | null
          updated_at: string | null
        }
        Insert: {
          chat_limit_reached?: boolean | null
          email: string
          messages_per_day?: number | null
          updated_at?: string | null
        }
        Update: {
          chat_limit_reached?: boolean | null
          email?: string
          messages_per_day?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      daily_chat_usage: {
        Row: {
          created_at: string
          date: string
          email: string
          id: string
          messages_used: number
          tokens_used: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          date?: string
          email: string
          id?: string
          messages_used?: number
          tokens_used?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          email?: string
          id?: string
          messages_used?: number
          tokens_used?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      dismissed_opportunities: {
        Row: {
          dismissed_at: string
          id: string
          opportunity_id: string
          user_id: string
        }
        Insert: {
          dismissed_at?: string
          id?: string
          opportunity_id: string
          user_id: string
        }
        Update: {
          dismissed_at?: string
          id?: string
          opportunity_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dismissed_opportunities_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "casting_opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_sessions: {
        Row: {
          actor_type: string | null
          created_at: string
          email: string
          expires_at: string
          favorite_genres: string[] | null
          id: string
          location: string | null
          name: string
          picture_base64: string | null
          session_id: string
        }
        Insert: {
          actor_type?: string | null
          created_at?: string
          email: string
          expires_at?: string
          favorite_genres?: string[] | null
          id?: string
          location?: string | null
          name: string
          picture_base64?: string | null
          session_id: string
        }
        Update: {
          actor_type?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          favorite_genres?: string[] | null
          id?: string
          location?: string | null
          name?: string
          picture_base64?: string | null
          session_id?: string
        }
        Relationships: []
      }
      opportunity_intelligence: {
        Row: {
          ai_analysis: Json | null
          confidence_score: number
          created_at: string
          id: string
          opportunity_id: string
          processing_notes: string | null
          updated_at: string
        }
        Insert: {
          ai_analysis?: Json | null
          confidence_score?: number
          created_at?: string
          id?: string
          opportunity_id: string
          processing_notes?: string | null
          updated_at?: string
        }
        Update: {
          ai_analysis?: Json | null
          confidence_score?: number
          created_at?: string
          id?: string
          opportunity_id?: string
          processing_notes?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_intelligence_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "casting_opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          actor_type: string | null
          created_at: string | null
          email: string | null
          favorite_genres: string[] | null
          id: string
          location: string | null
          name: string
          onboarding_completed: boolean | null
          phone: string | null
          role: string
          signup_completed: boolean | null
          updated_at: string | null
        }
        Insert: {
          actor_type?: string | null
          created_at?: string | null
          email?: string | null
          favorite_genres?: string[] | null
          id: string
          location?: string | null
          name: string
          onboarding_completed?: boolean | null
          phone?: string | null
          role?: string
          signup_completed?: boolean | null
          updated_at?: string | null
        }
        Update: {
          actor_type?: string | null
          created_at?: string | null
          email?: string | null
          favorite_genres?: string[] | null
          id?: string
          location?: string | null
          name?: string
          onboarding_completed?: boolean | null
          phone?: string | null
          role?: string
          signup_completed?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      role_submissions: {
        Row: {
          ai_match_score: number | null
          ai_reasoning: string | null
          auto_submitted: boolean | null
          callback_date: string | null
          cover_letter: string | null
          created_at: string
          id: string
          notes: string | null
          opportunity_id: string
          status: Database["public"]["Enums"]["submission_status"]
          submitted_at: string | null
          submitted_materials: Json | null
          updated_at: string
          user_id: string
          viewed_at: string | null
        }
        Insert: {
          ai_match_score?: number | null
          ai_reasoning?: string | null
          auto_submitted?: boolean | null
          callback_date?: string | null
          cover_letter?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          opportunity_id: string
          status?: Database["public"]["Enums"]["submission_status"]
          submitted_at?: string | null
          submitted_materials?: Json | null
          updated_at?: string
          user_id: string
          viewed_at?: string | null
        }
        Update: {
          ai_match_score?: number | null
          ai_reasoning?: string | null
          auto_submitted?: boolean | null
          callback_date?: string | null
          cover_letter?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          opportunity_id?: string
          status?: Database["public"]["Enums"]["submission_status"]
          submitted_at?: string | null
          submitted_materials?: Json | null
          updated_at?: string
          user_id?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "role_submissions_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "casting_opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      submission_templates: {
        Row: {
          cover_letter_template: string | null
          created_at: string
          default_materials: Json | null
          id: string
          is_default: boolean | null
          name: string
          role_type_specific: Database["public"]["Enums"]["role_type"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cover_letter_template?: string | null
          created_at?: string
          default_materials?: Json | null
          id?: string
          is_default?: boolean | null
          name: string
          role_type_specific?: Database["public"]["Enums"]["role_type"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cover_letter_template?: string | null
          created_at?: string
          default_materials?: Json | null
          id?: string
          is_default?: boolean | null
          name?: string
          role_type_specific?: Database["public"]["Enums"]["role_type"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          granted_at: string | null
          granted_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_submission_preferences: {
        Row: {
          auto_submit_enabled: boolean | null
          compensation_minimum: number | null
          created_at: string
          exclude_adult_content: boolean | null
          id: string
          max_travel_distance: number | null
          min_match_score: number | null
          notification_preferences: Json | null
          preferred_genres: string[] | null
          preferred_role_types:
            | Database["public"]["Enums"]["role_type"][]
            | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_submit_enabled?: boolean | null
          compensation_minimum?: number | null
          created_at?: string
          exclude_adult_content?: boolean | null
          id?: string
          max_travel_distance?: number | null
          min_match_score?: number | null
          notification_preferences?: Json | null
          preferred_genres?: string[] | null
          preferred_role_types?:
            | Database["public"]["Enums"]["role_type"][]
            | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_submit_enabled?: boolean | null
          compensation_minimum?: number | null
          created_at?: string
          exclude_adult_content?: boolean | null
          id?: string
          max_travel_distance?: number | null
          min_match_score?: number | null
          notification_preferences?: Json | null
          preferred_genres?: string[] | null
          preferred_role_types?:
            | Database["public"]["Enums"]["role_type"][]
            | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_all_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
          created_at: string
        }[]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
      is_course_provider: {
        Args: { _user_id: string }
        Returns: boolean
      }
      reset_daily_chat_usage: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "moderator"
        | "premium_user"
        | "basic_user"
        | "course_provider"
      opportunity_status: "active" | "closed" | "draft" | "expired"
      role_type:
        | "lead"
        | "supporting"
        | "background"
        | "featured"
        | "commercial"
        | "voiceover"
        | "theater"
        | "film"
        | "tv"
        | "web"
      submission_status:
        | "pending"
        | "submitted"
        | "viewed"
        | "callback"
        | "booked"
        | "rejected"
        | "expired"
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
      app_role: [
        "admin",
        "moderator",
        "premium_user",
        "basic_user",
        "course_provider",
      ],
      opportunity_status: ["active", "closed", "draft", "expired"],
      role_type: [
        "lead",
        "supporting",
        "background",
        "featured",
        "commercial",
        "voiceover",
        "theater",
        "film",
        "tv",
        "web",
      ],
      submission_status: [
        "pending",
        "submitted",
        "viewed",
        "callback",
        "booked",
        "rejected",
        "expired",
      ],
    },
  },
} as const
