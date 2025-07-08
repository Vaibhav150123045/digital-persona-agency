
import { supabase } from "@/integrations/supabase/client";
import { OnboardingData } from "@/types/onboarding";
import { getOnboardingSessionId } from "@/utils/onboardingSession";

export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const saveOnboardingData = async (data: OnboardingData) => {
  try {
    const sessionId = getOnboardingSessionId();
    
    // Convert picture to base64 if it exists
    let pictureBase64 = null;
    if (data.picture) {
      try {
        pictureBase64 = await convertFileToBase64(data.picture);
      } catch (error) {
        console.error('Error converting picture to base64:', error);
      }
    }
    
    const { error } = await supabase
      .from('onboarding_sessions')
      .upsert({
        session_id: sessionId,
        name: data.name,
        email: data.email,
        location: data.location,
        actor_type: data.actorType,
        favorite_genres: data.favoriteGenres,
        picture_base64: pictureBase64
      }, {
        onConflict: 'session_id'
      });

    if (error) {
      console.error('Error saving onboarding data:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
