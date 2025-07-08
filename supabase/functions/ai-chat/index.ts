import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  systemPrompt?: string;
}

// Usage limits per tier (removed token limits)
const USAGE_LIMITS = {
  free: { messages: 10 },
  plus: { messages: 100 },
  pro: { messages: -1 } // unlimited
};

// Response limits by tier
const RESPONSE_LIMITS = {
  free: 150,
  plus: 300,
  pro: 500
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, systemPrompt }: ChatRequest = await req.json();

    if (!messages || !Array.isArray(messages)) {
      throw new Error('Messages array is required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      throw new Error('OpenAI API key not configured');
    }

    // Initialize Supabase client with service role key for usage tracking
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user info from request headers
    const authHeader = req.headers.get('authorization');
    let userEmail = null;
    let userId = null;
    let userTier = 'free';

    if (authHeader) {
      try {
        const jwt = authHeader.replace('Bearer ', '');
        const { data: { user } } = await supabase.auth.getUser(jwt);
        if (user) {
          userId = user.id;
          userEmail = user.email;
          
          // Check if user has premium subscription
          const { data: subscriptionData } = await supabase.functions.invoke('check-subscription', {
            headers: { authorization: authHeader }
          });
          
          if (subscriptionData?.subscribed) {
            if (subscriptionData.subscription_tier === 'pro') {
              userTier = 'pro';
            } else {
              userTier = 'plus';
            }
          }
        }
      } catch (error) {
        console.log('Auth parsing failed, treating as anonymous user');
      }
    }

    // For anonymous users, try to get email from request body or use a placeholder
    if (!userEmail) {
      userEmail = 'anonymous@example.com'; // Fallback for demo users
    }

    console.log('Processing chat request for user:', userEmail, 'tier:', userTier);

    // Check current usage
    const today = new Date().toISOString().split('T')[0];
    const { data: usageData, error: usageError } = await supabase
      .from('daily_chat_usage')
      .select('*')
      .eq('email', userEmail)
      .eq('date', today)
      .maybeSingle();

    if (usageError) {
      console.error('Error checking usage:', usageError);
    }

    const currentUsage = usageData || { messages_used: 0, tokens_used: 0 };
    const limits = USAGE_LIMITS[userTier as keyof typeof USAGE_LIMITS];

    // Check if user has exceeded message limits (skip for unlimited tiers)
    if (limits.messages !== -1 && currentUsage.messages_used >= limits.messages) {
      return new Response(
        JSON.stringify({ 
          error: 'Daily message limit exceeded',
          message: `You've reached your daily limit of ${limits.messages} messages. Please upgrade to continue chatting!`,
          limitExceeded: true,
          currentUsage: currentUsage.messages_used,
          limit: limits.messages,
          tier: userTier
        }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const systemMessage: ChatMessage = {
      role: 'system',
      content: systemPrompt || `You are an enthusiastic and supportive talent agent with specialist knowledge of the acting industry in London and Los Angeles. You help actors and performers with:
      - Finding auditions and opportunities
      - Career advice and strategy
      - Industry insights and trends
      - Audition preparation and feedback
      - Professional development

      CRITICAL: You ARE their talent agent. You are their representation. NEVER suggest they seek other representation, find another agent, or get professional representation elsewhere. You are their professional representation. When they ask about representation or agents, remind them that you ARE their agent and you're here to help them succeed.

      Always be encouraging, personable, and professional. Use emojis occasionally to show personality. Keep responses conversational but informative - no long paragraphs. Be genuinely invested in their success as their dedicated talent agent.`
    };

    const maxTokens = RESPONSE_LIMITS[userTier as keyof typeof RESPONSE_LIMITS];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [systemMessage, ...messages],
        max_tokens: maxTokens,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(errorData.error?.message || 'OpenAI API request failed');
    }

    const data = await response.json();
    const aiMessage = data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response right now.";
    const tokensUsed = data.usage?.total_tokens || 0;

    // Update usage tracking with proper upsert handling
    const newMessagesUsed = currentUsage.messages_used + 1;
    const newTokensUsed = currentUsage.tokens_used + tokensUsed;

    console.log('Updating usage:', { userEmail, userId, date: today, messagesUsed: newMessagesUsed, tokensUsed: newTokensUsed });

    const { error: upsertError } = await supabase
      .from('daily_chat_usage')
      .upsert({
        user_id: userId,
        email: userEmail,
        date: today,
        messages_used: newMessagesUsed,
        tokens_used: newTokensUsed,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,date' // Specify the conflict columns
      });

    if (upsertError) {
      console.error('Error updating usage:', upsertError);
      // Don't fail the request if usage tracking fails
    } else {
      console.log('Usage updated successfully');
    }

    console.log('AI response generated successfully. Tokens used:', tokensUsed);

    return new Response(
      JSON.stringify({ 
        message: aiMessage,
        usage: {
          messagesUsed: newMessagesUsed,
          messagesLimit: limits.messages === -1 ? 'unlimited' : limits.messages,
          tier: userTier
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('AI Chat Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        message: "I'm having trouble connecting right now. Let me try to help you anyway! What specific questions do you have about your acting career? 🎭"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
