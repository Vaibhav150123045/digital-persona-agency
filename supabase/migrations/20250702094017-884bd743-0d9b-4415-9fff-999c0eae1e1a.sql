
-- Update the handle_new_user function to properly use onboarding data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  onboarding_data record;
BEGIN
  -- Try to find onboarding data for this email
  SELECT * INTO onboarding_data 
  FROM public.onboarding_sessions 
  WHERE email = NEW.email 
  AND expires_at > now()
  ORDER BY created_at DESC 
  LIMIT 1;

  -- Insert profile with onboarding data if available
  INSERT INTO public.profiles (
    id, 
    name, 
    email,
    role, 
    location,
    actor_type,
    favorite_genres,
    onboarding_completed,
    signup_completed
  )
  VALUES (
    NEW.id, 
    COALESCE(onboarding_data.name, NEW.raw_user_meta_data->>'name', 'New User'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'Actor'),
    COALESCE(onboarding_data.location, NEW.raw_user_meta_data->>'location', 'Los Angeles, CA'),
    onboarding_data.actor_type,
    onboarding_data.favorite_genres,
    CASE WHEN onboarding_data.id IS NOT NULL THEN true ELSE false END,
    true -- signup is completed since they just signed up
  );

  -- Clean up the onboarding session if it was used
  IF onboarding_data.id IS NOT NULL THEN
    DELETE FROM public.onboarding_sessions WHERE id = onboarding_data.id;
  END IF;

  RETURN NEW;
END;
$$;
