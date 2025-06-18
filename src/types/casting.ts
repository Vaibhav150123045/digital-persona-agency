
import type { Database } from "@/integrations/supabase/types";

export type RoleType = Database['public']['Enums']['role_type'];
export type SubmissionStatus = Database['public']['Enums']['submission_status'];
export type OpportunityStatus = Database['public']['Enums']['opportunity_status'];

export interface CastingOpportunity {
  id: string;
  title: string;
  project_name?: string;
  role_type: RoleType;
  description?: string;
  requirements?: string;
  compensation_range?: string;
  location?: string;
  shoot_dates?: string;
  application_deadline?: string;
  casting_director?: string;
  production_company?: string;
  source_platform?: string;
  external_id?: string;
  external_url?: string;
  genres?: string[];
  age_range?: string;
  gender_requirements?: string;
  ethnicity_requirements?: string;
  special_skills?: string[];
  status: OpportunityStatus;
  created_at: string;
  updated_at: string;
}

export interface RoleSubmission {
  id: string;
  user_id: string;
  opportunity_id: string;
  status: SubmissionStatus;
  submitted_at?: string;
  viewed_at?: string;
  callback_date?: string;
  notes?: string;
  cover_letter?: string;
  submitted_materials?: any;
  ai_match_score?: number;
  ai_reasoning?: string;
  auto_submitted?: boolean;
  created_at: string;
  updated_at: string;
  opportunity?: CastingOpportunity;
}

export interface UserSubmissionPreferences {
  id: string;
  user_id: string;
  auto_submit_enabled: boolean;
  min_match_score: number;
  preferred_role_types?: RoleType[];
  preferred_genres?: string[];
  max_travel_distance?: number;
  compensation_minimum?: number;
  exclude_adult_content: boolean;
  notification_preferences: {
    email: boolean;
    in_app: boolean;
    callback_reminders: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface SubmissionTemplate {
  id: string;
  user_id: string;
  name: string;
  cover_letter_template?: string;
  default_materials?: any;
  role_type_specific?: RoleType;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface AgentActivity {
  id: string;
  user_id: string;
  activity_type: string;
  opportunity_id?: string;
  submission_id?: string;
  details?: any;
  created_at: string;
  opportunity?: CastingOpportunity;
  submission?: RoleSubmission;
}
