
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

interface AgentRunResult {
  success: boolean;
  message: string;
  opportunities_analyzed: number;
  applications_created: number;
  high_confidence_matches: number;
  actions_taken: string[];
  next_run_suggested: string;
}

async function generateSmartCoverLetter(opportunity: any, userProfile: any): Promise<string> {
  if (!openAIApiKey) {
    console.log('OpenAI API key not available, using fallback cover letter');
    return `Dear Casting Director,

I am excited to submit my application for the ${opportunity.title} role. My experience and passion make me an excellent fit for this project.

I am available for the shoot dates and committed to delivering a professional performance. I would love to discuss this opportunity further.

Thank you for your consideration.

Best regards,
${userProfile.name}`;
  }

  const prompt = `
    Generate a professional cover letter for this acting opportunity:
    
    Opportunity: ${opportunity.title}
    Project: ${opportunity.project_name || 'N/A'}
    Role Type: ${opportunity.role_type}
    Requirements: ${opportunity.requirements || 'N/A'}
    
    Actor Profile:
    Name: ${userProfile.name}
    Actor Type: ${userProfile.actor_type || 'N/A'}
    Location: ${userProfile.location || 'N/A'}
    Favorite Genres: ${userProfile.favorite_genres?.join(', ') || 'N/A'}
    
    Write a compelling, personalized cover letter (150-200 words) that:
    1. Shows enthusiasm for the specific role
    2. Highlights relevant experience/skills
    3. Mentions why they're perfect for this project
    4. Maintains professional tone
    5. Includes a strong closing
    
    Return only the cover letter text, no additional formatting.
  `;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at writing compelling cover letters for actors. Write personalized, professional content that helps actors stand out.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
    
  } catch (error) {
    console.error('Error generating cover letter:', error);
    return `Dear Casting Director,

I am excited to submit my application for the ${opportunity.title} role. My experience and passion for ${opportunity.role_type} roles make me an excellent fit for this project.

I am available for the shoot dates and committed to delivering a professional performance. I would love to discuss this opportunity further.

Thank you for your consideration.

Best regards,
${userProfile.name}`;
  }
}

async function runAutonomousAgent(userId: string): Promise<AgentRunResult> {
  console.log(`Running autonomous agent for user: ${userId}`);
  
  try {
    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Profile error:', profileError);
      throw new Error(`Profile not found: ${profileError.message}`);
    }

    // Get user preferences - handle case where preferences don't exist
    const { data: preferences, error: prefsError } = await supabase
      .from('user_submission_preferences')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (prefsError) {
      console.error('Preferences error:', prefsError);
    }

    // Get agent configuration - handle case where config doesn't exist
    const { data: agentConfig, error: configError } = await supabase
      .from('agent_configurations')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (configError) {
      console.error('Agent config error:', configError);
    }

    console.log('Profile found:', !!profile);
    console.log('Preferences found:', !!preferences);
    console.log('Agent config found:', !!agentConfig);

    // Get recent opportunities
    const { data: opportunities, error: oppsError } = await supabase
      .from('casting_opportunities')
      .select(`
        *,
        opportunity_intelligence(*)
      `)
      .eq('status', 'active')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days
      .order('created_at', { ascending: false })
      .limit(20);

    if (oppsError) {
      console.error('Opportunities error:', oppsError);
      throw new Error(`Error fetching opportunities: ${oppsError.message}`);
    }

    console.log(`Found ${opportunities?.length || 0} recent opportunities`);

    const actions = [];
    let applicationsCreated = 0;
    let highConfidenceMatches = 0;
    
    // Use config values or defaults
    const minConfidence = (agentConfig?.minimum_confidence_score || 70) / 100;
    const autoApplyEnabled = preferences?.auto_submit_enabled || false;
    const maxApplications = agentConfig?.max_applications_per_day || 5;

    // Get existing submissions to avoid duplicates
    const { data: existingSubmissions } = await supabase
      .from('role_submissions')
      .select('opportunity_id')
      .eq('user_id', userId);

    const submittedOpportunityIds = new Set(existingSubmissions?.map(s => s.opportunity_id) || []);

    for (const opportunity of opportunities || []) {
      // Skip if already submitted
      if (submittedOpportunityIds.has(opportunity.id)) {
        continue;
      }

      // Stop if we've reached the daily limit
      if (applicationsCreated >= maxApplications) {
        actions.push(`Reached daily application limit of ${maxApplications}`);
        break;
      }

      // Calculate match score
      let matchScore = 0.5; // Base score
      
      // Role type matching
      if (preferences?.preferred_role_types?.includes(opportunity.role_type)) {
        matchScore += 0.2;
      }
      
      // Genre matching
      if (preferences?.preferred_genres?.length && opportunity.genres?.length) {
        const genreMatches = opportunity.genres.some(genre => 
          preferences.preferred_genres.includes(genre)
        );
        if (genreMatches) matchScore += 0.2;
      }
      
      // Location preference (simple check for LA)
      if (opportunity.location?.toLowerCase().includes('los angeles') || 
          opportunity.location?.toLowerCase().includes('la')) {
        matchScore += 0.1;
      }
      
      // AI confidence boost
      const intelligence = opportunity.opportunity_intelligence?.[0];
      if (intelligence?.confidence_score > 0.7) {
        matchScore += 0.1;
      }

      matchScore = Math.min(1, matchScore);

      if (matchScore >= minConfidence) {
        highConfidenceMatches++;
        
        // Auto-apply if enabled and score is high enough
        if (autoApplyEnabled && matchScore >= minConfidence) {
          try {
            // Generate smart cover letter
            const coverLetter = await generateSmartCoverLetter(opportunity, profile);
            
            // Create submission
            const { data: submission, error: submissionError } = await supabase
              .from('role_submissions')
              .insert({
                user_id: userId,
                opportunity_id: opportunity.id,
                status: 'submitted',
                submitted_at: new Date().toISOString(),
                cover_letter: coverLetter,
                auto_submitted: true,
                ai_match_score: matchScore,
                ai_reasoning: `Autonomous agent submission: ${Math.round(matchScore * 100)}% match based on role type, genres, and AI confidence analysis.`
              })
              .select()
              .single();

            if (!submissionError && submission) {
              applicationsCreated++;
              actions.push(`Applied to "${opportunity.title}" (${Math.round(matchScore * 100)}% match)`);
              
              // Log agent activity
              await supabase
                .from('agent_activities')
                .insert({
                  user_id: userId,
                  activity_type: 'autonomous_application',
                  opportunity_id: opportunity.id,
                  submission_id: submission.id,
                  details: {
                    match_score: matchScore,
                    ai_generated_cover_letter: true,
                    opportunity_title: opportunity.title,
                    reasoning: 'Autonomous agent application based on user preferences and AI analysis'
                  }
                });
            } else {
              console.error('Submission error:', submissionError);
              actions.push(`Failed to apply to "${opportunity.title}": ${submissionError?.message || 'Unknown error'}`);
            }
          } catch (error) {
            console.error('Error creating auto-submission:', error);
            actions.push(`Failed to apply to "${opportunity.title}": ${error.message}`);
          }
        } else {
          actions.push(`Found high-confidence match: "${opportunity.title}" (${Math.round(matchScore * 100)}% match) - Auto-apply disabled`);
        }
      }
    }

    // Log agent run
    await supabase
      .from('agent_activities')
      .insert({
        user_id: userId,
        activity_type: 'agent_run_complete',
        details: {
          opportunities_analyzed: opportunities?.length || 0,
          applications_created: applicationsCreated,
          high_confidence_matches: highConfidenceMatches,
          actions_taken: actions,
          run_timestamp: new Date().toISOString(),
          auto_apply_enabled: autoApplyEnabled,
          min_confidence_score: minConfidence
        }
      });

    return {
      success: true,
      message: applicationsCreated > 0 
        ? `Agent run complete: Created ${applicationsCreated} applications from ${highConfidenceMatches} high-confidence matches`
        : `Agent run complete: Found ${highConfidenceMatches} high-confidence matches, but ${autoApplyEnabled ? 'no applications were created due to errors' : 'auto-apply is disabled'}`,
      opportunities_analyzed: opportunities?.length || 0,
      applications_created: applicationsCreated,
      high_confidence_matches: highConfidenceMatches,
      actions_taken: actions,
      next_run_suggested: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString() // 4 hours from now
    };

  } catch (error) {
    console.error('Error in runAutonomousAgent:', error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, action = 'run' } = await req.json();
    
    if (!user_id) {
      throw new Error('User ID is required');
    }

    console.log(`Processing request for user: ${user_id}, action: ${action}`);

    let result;
    
    if (action === 'run') {
      result = await runAutonomousAgent(user_id);
    } else {
      throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in autonomous-agent-runner:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      details: error.stack 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
