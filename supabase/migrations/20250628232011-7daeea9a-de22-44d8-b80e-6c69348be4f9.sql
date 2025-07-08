
-- Create a table to track daily chat usage per user
CREATE TABLE public.daily_chat_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  messages_used INTEGER NOT NULL DEFAULT 0,
  tokens_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date),
  UNIQUE(email, date)
);

-- Enable Row Level Security
ALTER TABLE public.daily_chat_usage ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own usage
CREATE POLICY "Users can view their own chat usage" 
  ON public.daily_chat_usage 
  FOR SELECT 
  USING (auth.uid() = user_id OR auth.email() = email);

-- Create policy for edge functions to update usage (using service role)
CREATE POLICY "Service role can manage chat usage" 
  ON public.daily_chat_usage 
  FOR ALL 
  USING (true);

-- Create an index for better performance
CREATE INDEX idx_daily_chat_usage_user_date ON public.daily_chat_usage(user_id, date);
CREATE INDEX idx_daily_chat_usage_email_date ON public.daily_chat_usage(email, date);

-- Create a function to reset daily usage (can be called by cron job)
CREATE OR REPLACE FUNCTION reset_daily_chat_usage()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This function can be called daily to clean up old records
  DELETE FROM public.daily_chat_usage 
  WHERE date < CURRENT_DATE - INTERVAL '7 days';
END;
$$;
