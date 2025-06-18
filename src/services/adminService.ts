import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type RoleType = Database['public']['Enums']['role_type'];
type OpportunityStatus = Database['public']['Enums']['opportunity_status'];

export interface AdminCastingContent {
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
  age_range?: string;
  gender_requirements?: string;
  ethnicity_requirements?: string;
  genres?: string[];
  special_skills?: string[];
  status: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  published_by?: string;
  published_at?: string;
}

export interface AdminCourseContent {
  id: string;
  title: string;
  description?: string;
  instructor?: string;
  category?: string;
  difficulty_level?: string;
  duration_minutes?: number;
  video_url?: string;
  materials_url?: string;
  learning_objectives?: string[];
  prerequisites?: string[];
  price_tier?: string;
  status: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  published_by?: string;
  published_at?: string;
}

export interface AdminStats {
  total_users: number;
  total_casting_content: number;
  draft_content: number;
  published_content: number;
  total_courses: number;
  draft_courses: number;
  published_courses: number;
}

export const adminService = {
  async isAdmin(): Promise<boolean> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return false;

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.user.id)
      .in('role', ['admin', 'moderator'])
      .single();

    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }

    return !!data;
  },

  async getAdminStats(): Promise<AdminStats> {
    const { data: usersData } = await supabase.rpc('get_all_users');
    const { data: castingData } = await supabase
      .from('admin_casting_content')
      .select('status');
    const { data: coursesData } = await supabase
      .from('admin_course_content')
      .select('status');

    const total_users = usersData?.length || 0;
    const total_casting_content = castingData?.length || 0;
    const draft_content = castingData?.filter(c => c.status === 'draft').length || 0;
    const published_content = castingData?.filter(c => c.status === 'published').length || 0;
    const total_courses = coursesData?.length || 0;
    const draft_courses = coursesData?.filter(c => c.status === 'draft').length || 0;
    const published_courses = coursesData?.filter(c => c.status === 'published').length || 0;

    return {
      total_users,
      total_casting_content,
      draft_content,
      published_content,
      total_courses,
      draft_courses,
      published_courses
    };
  },

  async getDraftCastingContent(): Promise<AdminCastingContent[]> {
    const { data, error } = await supabase
      .from('admin_casting_content')
      .select('*')
      .eq('status', 'draft')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getDraftCourseContent(): Promise<AdminCourseContent[]> {
    const { data, error } = await supabase
      .from('admin_course_content')
      .select('*')
      .eq('status', 'draft')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getPublishedCourseContent(): Promise<AdminCourseContent[]> {
    const { data, error } = await supabase
      .from('admin_course_content')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createCastingContent(content: Partial<AdminCastingContent>): Promise<AdminCastingContent> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const insertData = {
      title: content.title!,
      project_name: content.project_name,
      role_type: content.role_type!,
      description: content.description,
      requirements: content.requirements,
      compensation_range: content.compensation_range,
      location: content.location,
      shoot_dates: content.shoot_dates,
      application_deadline: content.application_deadline,
      casting_director: content.casting_director,
      production_company: content.production_company,
      age_range: content.age_range,
      gender_requirements: content.gender_requirements,
      ethnicity_requirements: content.ethnicity_requirements,
      genres: content.genres,
      special_skills: content.special_skills,
      created_by: user.user.id,
      status: 'draft'
    };

    const { data, error } = await supabase
      .from('admin_casting_content')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCastingContent(id: string, content: Partial<AdminCastingContent>): Promise<AdminCastingContent> {
    const updateData = {
      title: content.title,
      project_name: content.project_name,
      role_type: content.role_type,
      description: content.description,
      requirements: content.requirements,
      compensation_range: content.compensation_range,
      location: content.location,
      shoot_dates: content.shoot_dates,
      application_deadline: content.application_deadline,
      casting_director: content.casting_director,
      production_company: content.production_company,
      age_range: content.age_range,
      gender_requirements: content.gender_requirements,
      ethnicity_requirements: content.ethnicity_requirements,
      genres: content.genres,
      special_skills: content.special_skills
    };

    const { data, error } = await supabase
      .from('admin_casting_content')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async publishCastingContent(id: string): Promise<void> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    // First, get the draft content
    const { data: draftContent, error: fetchError } = await supabase
      .from('admin_casting_content')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;
    if (!draftContent) throw new Error('Content not found');

    // Update the admin content status
    const { error: updateError } = await supabase
      .from('admin_casting_content')
      .update({
        status: 'published',
        published_by: user.user.id,
        published_at: new Date().toISOString()
      })
      .eq('id', id);

    if (updateError) throw updateError;

    // Create or update the corresponding casting opportunity
    const opportunityData = {
      title: draftContent.title,
      project_name: draftContent.project_name,
      role_type: draftContent.role_type,
      description: draftContent.description,
      requirements: draftContent.requirements,
      compensation_range: draftContent.compensation_range,
      location: draftContent.location,
      shoot_dates: draftContent.shoot_dates,
      application_deadline: draftContent.application_deadline,
      casting_director: draftContent.casting_director,
      production_company: draftContent.production_company,
      genres: draftContent.genres,
      age_range: draftContent.age_range,
      gender_requirements: draftContent.gender_requirements,
      ethnicity_requirements: draftContent.ethnicity_requirements,
      special_skills: draftContent.special_skills,
      status: 'active' as OpportunityStatus,
      source_platform: 'admin_created',
      external_id: id // Link back to the admin content
    };

    // Insert into casting_opportunities table
    const { error: insertError } = await supabase
      .from('casting_opportunities')
      .insert(opportunityData);

    if (insertError) throw insertError;

    console.log('Successfully published casting content and created opportunity');
  },

  async publishCourseContent(id: string): Promise<void> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('admin_course_content')
      .update({
        status: 'published',
        published_by: user.user.id,
        published_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
  },

  async getAllUsers() {
    const { data, error } = await supabase.rpc('get_all_users');
    if (error) throw error;
    return data || [];
  },

  async getUserRoles() {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*');
    if (error) throw error;
    return data || [];
  },

  async assignRole(userId: string, role: 'admin' | 'moderator' | 'premium_user' | 'basic_user' | 'course_provider') {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: role,
        granted_by: user.user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async assignUserRole(userId: string, role: string) {
    return this.assignRole(userId, role as 'admin' | 'moderator' | 'premium_user' | 'basic_user' | 'course_provider');
  },

  async removeUserRole(userId: string, role: 'admin' | 'moderator' | 'premium_user' | 'basic_user' | 'course_provider') {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', role);

    if (error) throw error;
  }
};
