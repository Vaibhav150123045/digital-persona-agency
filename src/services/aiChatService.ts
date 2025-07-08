
import { supabase } from "@/integrations/supabase/client";

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface AIResponse {
  message: string;
  error?: string;
  limitExceeded?: boolean;
  usage?: {
    messagesUsed: number;
    tokensUsed: number;
    messagesLimit: number | string;
    tokensLimit: number | string;
    tier: string;
  };
}

export class AIChatService {
  constructor() {
    // No longer need to manage API keys on the frontend
  }

  hasApiKey(): boolean {
    // Always return true since we handle API keys on the backend
    return true;
  }

  setApiKey(key: string) {
    // No-op since we don't need frontend API keys anymore
    console.log('API key management is now handled server-side');
  }

  async getCurrentUsage(): Promise<any> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const today = new Date().toISOString().split('T')[0];
      
      console.log('Fetching usage for user:', user?.email, 'date:', today);
      
      // Query specifically for the current authenticated user's usage
      const { data, error } = await supabase
        .from('daily_chat_usage')
        .select('*')
        .eq('user_id', user?.id)
        .eq('date', today)
        .maybeSingle();

      if (error) {
        console.error('Error fetching usage:', error);
        return { messages_used: 0, tokens_used: 0 };
      }

      console.log('Raw usage data from DB for user:', user?.email, data);
      return data || { messages_used: 0, tokens_used: 0 };
    } catch (error) {
      console.error('Error getting current usage:', error);
      return { messages_used: 0, tokens_used: 0 };
    }
  }

  async sendMessage(messages: ChatMessage[], customSystemPrompt?: string): Promise<AIResponse> {
    try {
      console.log('Sending message to AI chat service:', { messageCount: messages.length });
      
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          messages,
          systemPrompt: customSystemPrompt
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        
        // Check if it's a rate limit error
        if (error.message && error.message.includes('limit exceeded')) {
          return {
            message: "You've reached your daily chat limit! Upgrade to continue chatting with your agent. 🚀",
            error: error.message,
            limitExceeded: true
          };
        }
        
        throw new Error(error.message || 'Failed to get AI response');
      }

      console.log('AI response received:', data);
      
      return {
        message: data?.message || "I'm sorry, I couldn't generate a response right now.",
        usage: data?.usage,
        limitExceeded: data?.limitExceeded || false
      };
    } catch (error) {
      console.error('AI Chat Service Error:', error);
      
      // Check if it's a fetch error with status 429 (rate limit)
      if (error instanceof Error && error.message.includes('429')) {
        return {
          message: "You've reached your daily chat limit! Upgrade to continue chatting with your agent. 🚀",
          error: error.message,
          limitExceeded: true
        };
      }
      
      return {
        message: "I'm having trouble connecting right now. Let me try to help you anyway! What specific questions do you have about your acting career? 🎭",
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const aiChatService = new AIChatService();
