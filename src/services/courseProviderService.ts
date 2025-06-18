
import { supabase } from "@/integrations/supabase/client";

export interface CourseProviderProfile {
  id: string;
  user_id: string;
  company_name?: string;
  website?: string;
  bio?: string;
  specialties?: string[];
  years_experience?: number;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  provider_id: string;
  title: string;
  description?: string;
  category?: string;
  difficulty_level?: string;
  duration_minutes?: number;
  price_tier?: string;
  video_url?: string;
  materials_url?: string;
  learning_objectives?: string[];
  prerequisites?: string[];
  status: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CourseEnrollment {
  id: string;
  course_id: string;
  user_id: string;
  enrolled_at: string;
  completed_at?: string;
  progress_percentage: number;
  course?: {
    id: string;
    title: string;
    category?: string;
    provider_id: string;
  };
  user_profile?: any;
}

export interface CourseProviderStats {
  total_courses: number;
  published_courses: number;
  draft_courses: number;
  total_enrollments: number;
  total_revenue: number;
}

export const courseProviderService = {
  async isCourseProvider(): Promise<boolean> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return false;

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.user.id)
      .eq('role', 'course_provider')
      .single();

    if (error) {
      console.error('Error checking course provider status:', error);
      return false;
    }

    return !!data;
  },

  async getProviderProfile(): Promise<CourseProviderProfile | null> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return null;

    const { data, error } = await supabase
      .from('course_provider_profiles')
      .select('*')
      .eq('user_id', user.user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching provider profile:', error);
      return null;
    }

    return data;
  },

  async createOrUpdateProviderProfile(profile: Partial<CourseProviderProfile>): Promise<CourseProviderProfile> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('course_provider_profiles')
      .upsert({
        user_id: user.user.id,
        company_name: profile.company_name,
        website: profile.website,
        bio: profile.bio,
        specialties: profile.specialties,
        years_experience: profile.years_experience
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getCourses(): Promise<Course[]> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return [];

    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('provider_id', user.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createCourse(course: Partial<Course>): Promise<Course> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('courses')
      .insert({
        provider_id: user.user.id,
        title: course.title!,
        description: course.description,
        category: course.category,
        difficulty_level: course.difficulty_level,
        duration_minutes: course.duration_minutes,
        price_tier: course.price_tier || 'free',
        video_url: course.video_url,
        materials_url: course.materials_url,
        learning_objectives: course.learning_objectives,
        prerequisites: course.prerequisites,
        status: 'draft'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCourse(id: string, course: Partial<Course>): Promise<Course> {
    const { data, error } = await supabase
      .from('courses')
      .update({
        title: course.title,
        description: course.description,
        category: course.category,
        difficulty_level: course.difficulty_level,
        duration_minutes: course.duration_minutes,
        price_tier: course.price_tier,
        video_url: course.video_url,
        materials_url: course.materials_url,
        learning_objectives: course.learning_objectives,
        prerequisites: course.prerequisites
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async publishCourse(id: string): Promise<void> {
    const { error } = await supabase
      .from('courses')
      .update({
        status: 'published',
        published_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
  },

  async archiveCourse(id: string): Promise<void> {
    const { error } = await supabase
      .from('courses')
      .update({ status: 'archived' })
      .eq('id', id);

    if (error) throw error;
  },

  async getCourseEnrollments(courseId?: string): Promise<CourseEnrollment[]> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return [];

    let query = supabase
      .from('course_enrollments')
      .select(`
        *,
        course:courses!inner(
          id,
          title,
          category,
          provider_id
        )
      `)
      .eq('course.provider_id', user.user.id);

    if (courseId) {
      query = query.eq('course_id', courseId);
    }

    const { data, error } = await query.order('enrolled_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getProviderStats(): Promise<CourseProviderStats> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data: courses } = await supabase
      .from('courses')
      .select('id, status')
      .eq('provider_id', user.user.id);

    const courseIds = courses?.map(c => c.id) || [];
    
    let enrollmentsData = null;
    if (courseIds.length > 0) {
      const { data } = await supabase
        .from('course_enrollments')
        .select('id')
        .in('course_id', courseIds);
      enrollmentsData = data;
    }

    const total_courses = courses?.length || 0;
    const published_courses = courses?.filter(c => c.status === 'published').length || 0;
    const draft_courses = courses?.filter(c => c.status === 'draft').length || 0;
    const total_enrollments = enrollmentsData?.length || 0;

    return {
      total_courses,
      published_courses,
      draft_courses,
      total_enrollments,
      total_revenue: 0 // TODO: Calculate based on paid courses
    };
  }
};
