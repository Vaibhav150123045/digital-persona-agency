
-- Create dismissed_opportunities table to track which opportunities users have dismissed
CREATE TABLE public.dismissed_opportunities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES public.casting_opportunities(id) ON DELETE CASCADE,
  dismissed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, opportunity_id)
);

-- Enable Row Level Security
ALTER TABLE public.dismissed_opportunities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own dismissed opportunities" 
  ON public.dismissed_opportunities 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can dismiss opportunities for themselves" 
  ON public.dismissed_opportunities 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dismissed opportunities" 
  ON public.dismissed_opportunities 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own dismissed opportunities" 
  ON public.dismissed_opportunities 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_dismissed_opportunities_user_id ON public.dismissed_opportunities(user_id);
CREATE INDEX idx_dismissed_opportunities_opportunity_id ON public.dismissed_opportunities(opportunity_id);
