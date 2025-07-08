
-- Create agent_configurations table
CREATE TABLE public.agent_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  aggressiveness_level TEXT NOT NULL DEFAULT 'moderate',
  auto_apply_enabled BOOLEAN NOT NULL DEFAULT false,
  max_applications_per_day INTEGER NOT NULL DEFAULT 5,
  preferred_opportunity_types TEXT[] DEFAULT '{}',
  minimum_confidence_score INTEGER NOT NULL DEFAULT 70,
  custom_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT agent_configurations_aggressiveness_level_check 
    CHECK (aggressiveness_level IN ('conservative', 'moderate', 'aggressive')),
  CONSTRAINT agent_configurations_user_id_unique UNIQUE (user_id)
);

-- Create opportunity_intelligence table
CREATE TABLE public.opportunity_intelligence (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID NOT NULL REFERENCES public.casting_opportunities(id) ON DELETE CASCADE,
  confidence_score NUMERIC(3,2) NOT NULL DEFAULT 0.5,
  processing_notes TEXT,
  ai_analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT opportunity_intelligence_confidence_score_check 
    CHECK (confidence_score >= 0 AND confidence_score <= 1)
);

-- Enable RLS on agent_configurations
ALTER TABLE public.agent_configurations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for agent_configurations
CREATE POLICY "Users can view their own agent configuration" 
  ON public.agent_configurations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own agent configuration" 
  ON public.agent_configurations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own agent configuration" 
  ON public.agent_configurations 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Enable RLS on opportunity_intelligence
ALTER TABLE public.opportunity_intelligence ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for opportunity_intelligence
CREATE POLICY "All authenticated users can view opportunity intelligence" 
  ON public.opportunity_intelligence 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Service role can manage opportunity intelligence" 
  ON public.opportunity_intelligence 
  FOR ALL 
  USING (true);

-- Create updated_at trigger for agent_configurations
CREATE TRIGGER set_agent_configurations_updated_at
  BEFORE UPDATE ON public.agent_configurations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create updated_at trigger for opportunity_intelligence
CREATE TRIGGER set_opportunity_intelligence_updated_at
  BEFORE UPDATE ON public.opportunity_intelligence
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
