import { supabase } from "@/integrations/supabase/client";
import type { CastingOpportunity, RoleSubmission, UserSubmissionPreferences, SubmissionTemplate, AgentActivity } from "@/types/casting";
import type { Database } from "@/integrations/supabase/types";

type RoleType = Database['public']['Enums']['role_type'];
type SubmissionStatus = Database['public']['Enums']['submission_status'];
type OpportunityStatus = Database['public']['Enums']['opportunity_status'];

export const castingService = {
  // Casting Opportunities
  async getCastingOpportunities(filters?: {
    role_type?: RoleType;
    location?: string;
    status?: OpportunityStatus;
    limit?: number;
  }) {
    let query = supabase
      .from('casting_opportunities')
      .select('*')
      .eq('status', 'active') // Only get active opportunities
      .order('created_at', { ascending: false });

    if (filters?.role_type) {
      query = query.eq('role_type', filters.role_type as RoleType);
    }
    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    // Filter out dismissed opportunities for the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: dismissedOpps } = await supabase
        .from('dismissed_opportunities')
        .select('opportunity_id')
        .eq('user_id', user.id);
      
      const dismissedIds = new Set(dismissedOpps?.map(d => d.opportunity_id) || []);
      return (data as CastingOpportunity[]).filter(opp => !dismissedIds.has(opp.id));
    }
    
    return data as CastingOpportunity[];
  },

  async getCastingOpportunity(id: string) {
    const { data, error } = await supabase
      .from('casting_opportunities')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as CastingOpportunity;
  },

  async removeOpportunity(id: string) {
    const { error } = await supabase
      .from('casting_opportunities')
      .update({ status: 'closed' })
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  // Role Submissions
  async getUserSubmissions(userId?: string) {
    const { data, error } = await supabase
      .from('role_submissions')
      .select(`
        *,
        opportunity:casting_opportunities(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as RoleSubmission[];
  },

  async createSubmission(submission: Omit<RoleSubmission, 'id' | 'created_at' | 'updated_at'>) {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('role_submissions')
      .insert({
        user_id: user.id,
        opportunity_id: submission.opportunity_id,
        status: submission.status as SubmissionStatus,
        submitted_at: submission.submitted_at,
        viewed_at: submission.viewed_at,
        callback_date: submission.callback_date,
        notes: submission.notes,
        cover_letter: submission.cover_letter,
        submitted_materials: submission.submitted_materials,
        ai_match_score: submission.ai_match_score,
        ai_reasoning: submission.ai_reasoning,
        auto_submitted: submission.auto_submitted
      })
      .select()
      .single();

    if (error) throw error;
    return data as RoleSubmission;
  },

  async updateSubmissionStatus(id: string, status: SubmissionStatus, updates?: Partial<RoleSubmission>) {
    const updateData: any = { status };
    
    if (updates) {
      Object.keys(updates).forEach(key => {
        if (updates[key as keyof RoleSubmission] !== undefined) {
          updateData[key] = updates[key as keyof RoleSubmission];
        }
      });
    }

    const { data, error } = await supabase
      .from('role_submissions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as RoleSubmission;
  },

  // User Preferences
  async getUserPreferences() {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    console.log('Getting preferences for user:', user.id);

    const { data, error } = await supabase
      .from('user_submission_preferences')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching preferences:', error);
      throw error;
    }
    
    console.log('Retrieved preferences:', data);
    
    // Convert database values back to UI format
    if (data) {
      return {
        ...data,
        min_match_score: Math.round(data.min_match_score * 100) // Convert 0.70 to 70
      } as UserSubmissionPreferences;
    }
    
    return data as UserSubmissionPreferences | null;
  },

  async updateUserPreferences(preferences: Partial<UserSubmissionPreferences>) {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    console.log('Updating preferences for user:', user.id, preferences);

    const { data: existingPrefs } = await supabase
      .from('user_submission_preferences')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    // Convert our types to database types and ensure proper formatting
    const dbPreferences: any = {
      auto_submit_enabled: preferences.auto_submit_enabled ?? false,
      min_match_score: preferences.min_match_score ? preferences.min_match_score / 100 : 0.70, // Convert 70 to 0.70
      preferred_role_types: preferences.preferred_role_types || null,
      preferred_genres: preferences.preferred_genres || null,
      max_travel_distance: preferences.max_travel_distance ?? null,
      compensation_minimum: preferences.compensation_minimum ?? null,
      exclude_adult_content: preferences.exclude_adult_content ?? true,
      notification_preferences: preferences.notification_preferences || {
        email: true,
        in_app: true,
        callback_reminders: true
      }
    };

    console.log('Database preferences object:', dbPreferences);

    if (existingPrefs) {
      console.log('Updating existing preferences with ID:', existingPrefs.id);
      const { data, error } = await supabase
        .from('user_submission_preferences')
        .update(dbPreferences)
        .eq('id', existingPrefs.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating preferences:', error);
        throw error;
      }
      console.log('Updated preferences result:', data);
      
      // Convert back to UI format
      return {
        ...data,
        min_match_score: Math.round(data.min_match_score * 100)
      } as UserSubmissionPreferences;
    } else {
      console.log('Creating new preferences for user');
      const { data, error } = await supabase
        .from('user_submission_preferences')
        .insert({ 
          ...dbPreferences, 
          user_id: user.id 
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating preferences:', error);
        throw error;
      }
      console.log('Created preferences result:', data);
      
      // Convert back to UI format
      return {
        ...data,
        min_match_score: Math.round(data.min_match_score * 100)
      } as UserSubmissionPreferences;
    }
  },

  // Submission Templates
  async getUserTemplates() {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('submission_templates')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as SubmissionTemplate[];
  },

  async createTemplate(template: Omit<SubmissionTemplate, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('submission_templates')
      .insert({ 
        name: template.name,
        cover_letter_template: template.cover_letter_template,
        default_materials: template.default_materials,
        role_type_specific: template.role_type_specific as RoleType,
        is_default: template.is_default,
        user_id: user.user.id 
      })
      .select()
      .single();

    if (error) throw error;
    return data as SubmissionTemplate;
  },

  // Agent Activities
  async getUserAgentActivities(limit = 50) {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('agent_activities')
      .select(`
        *,
        opportunity:casting_opportunities(*),
        submission:role_submissions(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as AgentActivity[];
  },

  async createAgentActivity(activity: Omit<AgentActivity, 'id' | 'user_id' | 'created_at'>) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('agent_activities')
      .insert({ 
        activity_type: activity.activity_type,
        opportunity_id: activity.opportunity_id,
        submission_id: activity.submission_id,
        details: activity.details,
        user_id: user.user.id 
      })
      .select()
      .single();

    if (error) throw error;
    return data as AgentActivity;
  },

  // AI Matching
  async findMatchingOpportunities(userProfile: any, preferences?: UserSubmissionPreferences) {
    // Get active opportunities
    const opportunities = await this.getCastingOpportunities({ status: 'active' });
    
    // Basic filtering based on preferences
    let filtered = opportunities;
    
    if (preferences?.preferred_role_types?.length) {
      filtered = filtered.filter(opp => 
        preferences.preferred_role_types!.includes(opp.role_type)
      );
    }
    
    if (preferences?.preferred_genres?.length) {
      filtered = filtered.filter(opp => 
        opp.genres?.some(genre => preferences.preferred_genres!.includes(genre))
      );
    }
    
    if (preferences?.exclude_adult_content) {
      filtered = filtered.filter(opp => 
        !opp.genres?.some(genre => genre.toLowerCase().includes('adult'))
      );
    }

    // TODO: Implement AI-powered matching with OpenAI
    // For now, return filtered results with basic scoring
    return filtered.map(opp => ({
      opportunity: opp,
      match_score: Math.random() * 0.4 + 0.6, // Random score between 0.6-1.0
      reasoning: "Basic compatibility match based on user preferences"
    }));
  }
};
