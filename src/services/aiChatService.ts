
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface AIResponse {
  message: string;
  error?: string;
}

export class AIChatService {
  private apiKey: string | null = null;

  constructor() {
    // For now, we'll use localStorage for the API key
    this.apiKey = localStorage.getItem('openai_api_key');
  }

  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('openai_api_key', key);
  }

  hasApiKey(): boolean {
    return !!this.apiKey;
  }

  async sendMessage(messages: ChatMessage[]): Promise<AIResponse> {
    if (!this.apiKey) {
      return {
        message: "I'd love to help, but I need an OpenAI API key to provide intelligent responses. Please add your API key in the settings!",
        error: "No API key configured"
      };
    }

    try {
      const systemPrompt: ChatMessage = {
        role: 'system',
        content: `You are an enthusiastic and supportive talent agent with specialist knowledge of the acting industry in London and Los Angelese. You help actors and performers with:
        - Finding auditions and opportunities
        - Career advice and strategy
        - Industry insights and trends
        - Audition preparation and feedback
        - Professional development

        Always be encouraging, personable, and professional. Use emojis occasionally to show personality. Keep responses conversational but informative - no long paragraphs. Be genuinely invested in their success.`
      };

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [systemPrompt, ...messages],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'API request failed');
      }

      const data = await response.json();
      return {
        message: data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response right now."
      };
    } catch (error) {
      console.error('AI Chat Service Error:', error);
      return {
        message: "I'm having trouble connecting right now. Let me try to help you anyway! What specific questions do you have about your acting career? 🎭",
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const aiChatService = new AIChatService();
