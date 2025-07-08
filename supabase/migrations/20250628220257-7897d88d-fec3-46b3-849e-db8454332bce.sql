
-- Add picture_base64 column to onboarding_sessions table
ALTER TABLE public.onboarding_sessions 
ADD COLUMN picture_base64 TEXT;
