
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SpotlightOpportunity {
  id: string;
  title: string;
  project_name?: string;
  role_type: string;
  description?: string;
  location?: string;
  deadline?: string;
  compensation?: string;
  casting_director?: string;
  production_company?: string;
  genres?: string[];
  submission_url?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting Spotlight API sync...');

    // TODO: Replace with actual Spotlight API call
    // For now, we'll create some mock data to demonstrate the structure
    const mockSpotlightData: SpotlightOpportunity[] = [
      {
        id: 'spotlight_001',
        title: 'Lead Role - Independent Drama',
        project_name: 'The Last Light',
        role_type: 'lead',
        description: 'Seeking a versatile actor for the lead role in an emotional independent drama about loss and redemption.',
        location: 'London, UK',
        deadline: '2024-12-31T23:59:59Z',
        compensation: '£2000-£5000',
        casting_director: 'Sarah Mitchell',
        production_company: 'Moonlight Productions',
        genres: ['Drama', 'Independent'],
        submission_url: 'https://www.spotlight.com/casting/submit/spotlight_001'
      },
      {
        id: 'spotlight_002',
        title: 'Supporting Role - BBC Series',
        project_name: 'City Lives',
        role_type: 'supporting',
        description: 'Recurring supporting character in popular BBC drama series. Must be available for 6 months.',
        location: 'Manchester, UK',
        deadline: '2024-12-25T17:00:00Z',
        compensation: '£800 per episode',
        casting_director: 'James Roberts',
        production_company: 'BBC Studios',
        genres: ['Drama', 'Television'],
        submission_url: 'https://www.spotlight.com/casting/submit/spotlight_002'
      }
    ];

    let newOpportunities = 0;
    let updatedOpportunities = 0;
    const errors: string[] = [];

    // Process each opportunity from Spotlight
    for (const spotlightOpp of mockSpotlightData) {
      try {
        // Check if opportunity already exists
        const { data: existing } = await supabaseClient
          .from('casting_opportunities')
          .select('id, updated_at')
          .eq('external_id', spotlightOpp.id)
          .eq('source_platform', 'spotlight')
          .maybeSingle();

        const opportunityData = {
          title: spotlightOpp.title,
          project_name: spotlightOpp.project_name,
          role_type: spotlightOpp.role_type as any,
          description: spotlightOpp.description,
          location: spotlightOpp.location,
          application_deadline: spotlightOpp.deadline,
          compensation_range: spotlightOpp.compensation,
          casting_director: spotlightOpp.casting_director,
          production_company: spotlightOpp.production_company,
          source_platform: 'spotlight',
          external_id: spotlightOpp.id,
          external_url: spotlightOpp.submission_url,
          genres: spotlightOpp.genres,
          status: 'active' as any,
          updated_at: new Date().toISOString()
        };

        if (existing) {
          // Update existing opportunity
          const { error: updateError } = await supabaseClient
            .from('casting_opportunities')
            .update(opportunityData)
            .eq('id', existing.id);

          if (updateError) {
            console.error('Error updating opportunity:', updateError);
            errors.push(`Failed to update ${spotlightOpp.title}: ${updateError.message}`);
          } else {
            updatedOpportunities++;
            console.log(`Updated opportunity: ${spotlightOpp.title}`);
          }
        } else {
          // Create new opportunity
          const { error: insertError } = await supabaseClient
            .from('casting_opportunities')
            .insert(opportunityData);

          if (insertError) {
            console.error('Error inserting opportunity:', insertError);
            errors.push(`Failed to create ${spotlightOpp.title}: ${insertError.message}`);
          } else {
            newOpportunities++;
            console.log(`Created new opportunity: ${spotlightOpp.title}`);
          }
        }
      } catch (error) {
        console.error('Error processing opportunity:', error);
        errors.push(`Error processing ${spotlightOpp.title}: ${error.message}`);
      }
    }

    const result = {
      success: errors.length === 0,
      message: errors.length === 0 
        ? `Successfully synced ${newOpportunities} new and ${updatedOpportunities} updated opportunities from Spotlight`
        : `Sync completed with ${errors.length} errors`,
      newOpportunities,
      updatedOpportunities,
      errors
    };

    console.log('Spotlight sync result:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Spotlight sync function error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal server error during Spotlight sync',
        newOpportunities: 0,
        updatedOpportunities: 0,
        errors: [error.message]
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
