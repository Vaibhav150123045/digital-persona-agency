
import { supabase } from "@/integrations/supabase/client";

export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    console.log('=== EMAIL VALIDATION START ===');
    console.log('Checking email:', normalizedEmail);
    
    // Use the get_all_users function to check if email exists in auth system
    console.log('Checking auth users via get_all_users function...');
    const { data: users, error: usersError } = await supabase.rpc('get_all_users');
    
    if (usersError) {
      console.error('Error checking auth users:', usersError);
      // Fallback to other checks
    } else if (users) {
      const userExists = users.some(user => user.email?.toLowerCase() === normalizedEmail);
      if (userExists) {
        console.log('✅ Email found in auth users');
        console.log('=== EMAIL VALIDATION END (FOUND IN AUTH) ===');
        return true;
      }
    }

    // Check profiles table - this is where confirmed users are stored
    console.log('Checking profiles table...');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error checking profiles:', profileError);
      console.log('=== EMAIL VALIDATION END (ERROR - ASSUMING EXISTS) ===');
      return true; // Assume exists on error to be safe
    }

    if (profileData) {
      console.log('✅ Email found in profiles table');
      console.log('=== EMAIL VALIDATION END (FOUND IN PROFILES) ===');
      return true;
    }

    // Check onboarding sessions for active sessions
    console.log('Checking onboarding_sessions table...');
    const currentTime = new Date().toISOString();
    
    const { data: onboardingData, error: onboardingError } = await supabase
      .from('onboarding_sessions')
      .select('email, expires_at')
      .eq('email', normalizedEmail)
      .gt('expires_at', currentTime)
      .maybeSingle();

    if (onboardingError && onboardingError.code !== 'PGRST116') {
      console.error('Error checking onboarding sessions:', onboardingError);
      console.log('=== EMAIL VALIDATION END (ERROR - ASSUMING EXISTS) ===');
      return true; // Assume exists on error to be safe
    }

    if (onboardingData) {
      console.log('✅ Email found in active onboarding sessions');
      console.log('=== EMAIL VALIDATION END (FOUND IN ONBOARDING) ===');
      return true;
    }

    console.log('✅ Email is available');
    console.log('=== EMAIL VALIDATION END (AVAILABLE) ===');
    return false;

  } catch (error) {
    console.error('💥 Unexpected error checking email existence:', error);
    console.log('=== EMAIL VALIDATION END (UNEXPECTED ERROR - ASSUMING EXISTS) ===');
    return true; // Assume exists on error to be safe
  }
};
