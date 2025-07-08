
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

interface OpportunityData {
  title: string;
  description?: string;
  requirements?: string;
  location?: string;
  compensation_range?: string;
  source_url: string;
  raw_content: string;
}

interface ProcessedOpportunity {
  title: string;
  project_name?: string;
  role_type: 'lead' | 'supporting' | 'background';
  description?: string;
  requirements?: string;
  compensation_range?: string;
  location?: string;
  shoot_dates?: string;
  casting_director?: string;
  production_company?: string;
  genres?: string[];
  age_range?: string;
  gender_requirements?: string;
  ethnicity_requirements?: string;
  special_skills?: string[];
  external_url: string;
  source_platform: string;
  confidence_score: number;
  processing_notes?: string;
}

async function processOpportunityWithAI(opportunity: OpportunityData): Promise<ProcessedOpportunity> {
  const prompt = `
    Analyze this acting opportunity and extract structured information. Format the response as JSON with these fields:
    
    Required fields:
    - title: Clean, professional title
    - role_type: "lead", "supporting", or "background"
    - external_url: Source URL
    - source_platform: Website name
    - confidence_score: 0-1 score of data quality
    
    Optional fields:
    - project_name: Name of the project/show/film
    - description: Clean description (200 words max)
    - requirements: Actor requirements
    - compensation_range: Payment info
    - location: Filming location
    - shoot_dates: Shooting dates
    - casting_director: Casting director name
    - production_company: Production company
    - genres: Array of genres (drama, comedy, thriller, etc.)
    - age_range: Age requirements
    - gender_requirements: Gender requirements
    - ethnicity_requirements: Ethnicity requirements
    - special_skills: Array of required skills
    - processing_notes: Any issues or observations
    
    Raw opportunity data:
    Title: ${opportunity.title}
    Description: ${opportunity.description || 'N/A'}
    Requirements: ${opportunity.requirements || 'N/A'}
    Location: ${opportunity.location || 'N/A'}
    Compensation: ${opportunity.compensation_range || 'N/A'}
    Source URL: ${opportunity.source_url}
    Raw Content: ${opportunity.raw_content.substring(0, 1000)}...
    
    Return only valid JSON, no explanations.
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
            content: 'You are an expert at analyzing acting opportunities and extracting structured data. Always return valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    // Parse the AI response
    const processed = JSON.parse(aiResponse);
    
    // Ensure required fields are present
    return {
      title: processed.title || opportunity.title,
      role_type: processed.role_type || 'supporting',
      external_url: opportunity.source_url,
      source_platform: processed.source_platform || 'Unknown',
      confidence_score: processed.confidence_score || 0.5,
      ...processed
    };
    
  } catch (error) {
    console.error('AI processing error:', error);
    
    // Fallback to basic processing
    return {
      title: opportunity.title,
      role_type: 'supporting',
      description: opportunity.description,
      requirements: opportunity.requirements,
      compensation_range: opportunity.compensation_range,
      location: opportunity.location,
      external_url: opportunity.source_url,
      source_platform: 'Unknown',
      confidence_score: 0.3,
      processing_notes: `AI processing failed: ${error.message}`
    };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { opportunities } = await req.json();
    
    if (!opportunities || !Array.isArray(opportunities)) {
      throw new Error('Invalid opportunities data');
    }

    console.log(`Processing ${opportunities.length} opportunities with AI`);
    
    const processedOpportunities = [];
    
    for (const opportunity of opportunities) {
      try {
        const processed = await processOpportunityWithAI(opportunity);
        
        // Store in database
        const { data, error } = await supabase
          .from('casting_opportunities')
          .insert({
            title: processed.title,
            project_name: processed.project_name,
            role_type: processed.role_type,
            description: processed.description,
            requirements: processed.requirements,
            compensation_range: processed.compensation_range,
            location: processed.location,
            shoot_dates: processed.shoot_dates,
            casting_director: processed.casting_director,
            production_company: processed.production_company,
            external_url: processed.external_url,
            source_platform: processed.source_platform,
            genres: processed.genres,
            age_range: processed.age_range,
            gender_requirements: processed.gender_requirements,
            ethnicity_requirements: processed.ethnicity_requirements,
            special_skills: processed.special_skills,
            status: 'active'
          })
          .select()
          .single();

        if (error) {
          console.error('Database insert error:', error);
          continue;
        }

        processedOpportunities.push(data);
        
        // Store AI analysis metadata
        await supabase
          .from('opportunity_intelligence')
          .insert({
            opportunity_id: data.id,
            confidence_score: processed.confidence_score,
            processing_notes: processed.processing_notes,
            ai_analysis: {
              processed_at: new Date().toISOString(),
              model_used: 'gpt-4o-mini',
              raw_input: opportunity,
              processed_output: processed
            }
          });
          
      } catch (error) {
        console.error('Error processing opportunity:', error);
        continue;
      }
    }

    return new Response(JSON.stringify({
      success: true,
      processed_count: processedOpportunities.length,
      opportunities: processedOpportunities
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in intelligent-opportunity-processor:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
