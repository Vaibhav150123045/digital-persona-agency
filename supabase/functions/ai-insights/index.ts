
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InsightsRequest {
  displayProfile: {
    name: string;
    role: string;
    location: string;
    actorType: string;
    favoriteGenres: string[];
    isNewUser: boolean;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { displayProfile }: InsightsRequest = await req.json();

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      throw new Error('OpenAI API key not configured');
    }

    console.log('Generating insights for profile:', displayProfile.name);

    const systemPrompt = `You are an AI assistant specializing in entertainment industry market analysis. Generate two DISTINCT types of insights for actors:

    1. MARKET TREND: Focus on current industry trends, casting patterns, what's hot in entertainment
    2. RECOMMENDATION: Focus on specific actionable career advice, networking tips, skill development

    These should be DIFFERENT types of insights - don't repeat the same advice twice.

    Respond with exactly this JSON format:
    {
      "marketTrend": {
        "title": "Brief trend title (max 5 words)",
        "description": "One sentence about current market/industry trend (max 15 words)"
      },
      "recommendation": {
        "title": "Brief action title (max 5 words)", 
        "description": "One sentence actionable career advice (max 15 words)"
      }
    }

    Make sure the market trend is about industry patterns and the recommendation is about personal action.`;

    const userPrompt = `Generate distinct market insights for this actor profile:
    - Name: ${displayProfile.name}
    - Role: ${displayProfile.role}
    - Location: ${displayProfile.location}
    - Actor Type: ${displayProfile.actorType}
    - Favorite Genres: ${displayProfile.favoriteGenres.join(', ')}
    - Is New User: ${displayProfile.isNewUser}
    
    Provide ONE market trend insight and ONE different career recommendation insight.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(errorData.error?.message || 'OpenAI API request failed');
    }

    const data = await response.json();
    const aiMessage = data.choices[0]?.message?.content || null;

    let insights;
    if (aiMessage) {
      try {
        insights = JSON.parse(aiMessage);
        console.log('Successfully parsed AI insights:', insights);
      } catch (parseError) {
        console.error('Failed to parse AI insights:', parseError);
        insights = getDefaultInsights(displayProfile.isNewUser);
      }
    } else {
      insights = getDefaultInsights(displayProfile.isNewUser);
    }

    return new Response(
      JSON.stringify({ insights }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('AI Insights Error:', error);
    
    // Always return fallback insights instead of erroring
    const fallbackInsights = getDefaultInsights(true);
    return new Response(
      JSON.stringify({ insights: fallbackInsights }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function getDefaultInsights(isNewUser: boolean) {
  if (isNewUser) {
    return {
      marketTrend: {
        title: "Industry Growing",
        description: "Streaming platforms increasing casting by 15% this quarter"
      },
      recommendation: {
        title: "Build Your Portfolio",
        description: "Create a professional headshot and demo reel first"
      }
    };
  } else {
    return {
      marketTrend: {
        title: "Drama Series Rising",
        description: "Period dramas and thrillers seeing 30% more castings"
      },
      recommendation: {
        title: "Network Actively",
        description: "Attend industry mixers and connect with casting directors"
      }
    };
  }
}
