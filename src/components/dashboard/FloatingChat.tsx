import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, User, Sparkles, X, Minimize2, Maximize2 } from "lucide-react";
import { aiChatService } from "@/services/aiChatService";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ChatUsageIndicator from "./ChatUsageIndicator";

interface Message {
  id: number;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  typing?: boolean;
}

const FloatingChat = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentUsage, setCurrentUsage] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if user has reached their daily limit
  const isAtLimit = () => {
    if (!currentUsage || !user) return false;
    const tier = currentUsage.tier || 'free';
    if (tier === 'pro') return false;
    
    const limits = {
      free: 10,
      plus: 100
    };
    
    const limit = limits[tier as keyof typeof limits];
    const messagesUsed = currentUsage.messagesUsed || 0;
    
    return messagesUsed >= limit;
  };

  // Initialize chat when opened
  useEffect(() => {
    if (isOpen && messages.length === 0 && isLoading) {
      initializeChat();
    }
  }, [isOpen, user]);

  const initializeChat = async () => {
    try {
      // Get usage data
      if (user) {
        const usageData = await aiChatService.getCurrentUsage();
        setCurrentUsage(usageData);

        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setUserProfile(profile);

        // Try to load existing chat history
        const { data: chatData } = await supabase
          .from('chat_histories')
          .select('chat_history')
          .eq('user_email', user.email)
          .single();

        if (chatData?.chat_history && Array.isArray(chatData.chat_history) && chatData.chat_history.length > 0) {
          // Convert stored chat history to Message format
          const loadedMessages = chatData.chat_history.map((msg: any, index: number) => ({
            id: index + 1,
            content: msg.content,
            sender: msg.sender,
            timestamp: new Date(msg.timestamp)
          }));
          
          setMessages(loadedMessages);
          
          // Add a "welcome back" message for returning users
          const welcomeBackMessage = createWelcomeMessage(profile, true);
          setMessages(prev => [...prev, welcomeBackMessage]);
        } else {
          // Create initial welcome message for new users
          const welcomeMessage = createWelcomeMessage(profile, false);
          setMessages([welcomeMessage]);
        }
      } else {
        // For non-authenticated users, try to get onboarding data
        const sessionId = localStorage.getItem('onboarding_session_id');
        if (sessionId) {
          const { data } = await supabase
            .from('onboarding_sessions')
            .select('*')
            .eq('session_id', sessionId)
            .single();
          if (data) {
            setOnboardingData(data);
          }
        }
        setCurrentUsage({ messages_used: 0, tier: 'free' });
        
        // Create welcome message for non-authenticated users
        const welcomeMessage = createWelcomeMessage(onboardingData, false);
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
      // Fallback welcome message
      const welcomeMessage = createWelcomeMessage(null, false);
      setMessages([welcomeMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const createWelcomeMessage = (profileData: any, isReturningUser: boolean): Message => {
    let welcomeContent = "";
    
    if (profileData && profileData.name) {
      if (isReturningUser) {
        // Welcome back message for returning users - more natural and conversational
        welcomeContent = `Welcome back, ${profileData.name}! 👋 Ready to pick up where we left off? What would you like to work on today? 🎭`;
      } else {
        // Initial welcome message for new users - simple and friendly
        welcomeContent = `Hi ${profileData.name}! 👋 I'm Ayla, your AI talent agent. How can I help you today? 🎭`;
      }
    } else {
      if (isReturningUser) {
        welcomeContent = "Welcome back! 👋 Ready to pick up where we left off? What would you like to work on today? 🎭";
      } else {
        welcomeContent = "Hi there! 👋 I'm Ayla, your AI talent agent. How can I help you today? 🎭";
      }
    }

    return {
      id: Date.now(),
      content: welcomeContent,
      sender: "ai",
      timestamp: new Date()
    };
  };

  const saveChatHistory = async (updatedMessages: Message[]) => {
    if (!user) return;

    try {
      // Convert messages to a format suitable for storage
      const chatHistory = updatedMessages.map(msg => ({
        content: msg.content,
        sender: msg.sender,
        timestamp: msg.timestamp.toISOString()
      }));

      await supabase
        .from('chat_histories')
        .upsert({
          user_email: user.email,
          chat_history: chatHistory,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_email'
        });
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  const createSystemPrompt = async () => {
    let systemPrompt = `You are Ayla, an enthusiastic and supportive AI talent agent with specialist knowledge of the acting industry in London and Los Angeles. You help actors and performers with:
    - Finding auditions and opportunities
    - Career advice and strategy
    - Industry insights and trends
    - Audition preparation and feedback
    - Professional development

    Your name is Ayla and you should introduce yourself as Ayla when asked about your name or identity.

    CRITICAL: You ARE their talent agent. You are their representation. NEVER suggest they seek other representation, find another agent, or get professional representation elsewhere. You are their professional representation.

    Always be encouraging, personable, and professional. Use emojis occasionally to show personality. Keep responses conversational but informative - no long paragraphs.`;

    const dataSource = userProfile || onboardingData;
    
    if (dataSource) {
      systemPrompt += `\n\nIMPORTANT CONTEXT ABOUT THIS USER:`;
      if (dataSource.name) systemPrompt += `\n- Name: ${dataSource.name}`;
      if (dataSource.actor_type) {
        const actorTypeText = dataSource.actor_type.toLowerCase() === 'both' 
          ? 'versatile actor who works in both stage and screen'
          : `${dataSource.actor_type.toLowerCase()} actor`;
        systemPrompt += `\n- Actor Type: ${actorTypeText}`;
      }
      if (dataSource.favorite_genres && dataSource.favorite_genres.length > 0) {
        systemPrompt += `\n- Favorite Genres: ${dataSource.favorite_genres.join(', ')}`;
      }
      if (dataSource.location) systemPrompt += `\n- Location: ${dataSource.location}`;
      if (dataSource.role) systemPrompt += `\n- Role: ${dataSource.role}`;
    }

    return systemPrompt;
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isAtLimit()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      content: inputMessage,
      sender: "user",
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage("");
    setIsTyping(true);

    try {
      const chatHistory = updatedMessages
        .filter(msg => !msg.typing)
        .map(msg => ({
          role: msg.sender === "user" ? "user" as const : "assistant" as const,
          content: msg.content
        }));

      const systemPrompt = await createSystemPrompt();
      const response = await aiChatService.sendMessage(chatHistory, systemPrompt);
      
      setIsTyping(false);

      if (response.usage) {
        const updatedUsage = {
          messagesUsed: response.usage.messagesUsed,
          messagesLimit: response.usage.messagesLimit,
          tier: response.usage.tier
        };
        setCurrentUsage(updatedUsage);
      }
      
      const aiResponse: Message = {
        id: updatedMessages.length + 1,
        content: response.message,
        sender: "ai",
        timestamp: new Date()
      };
      
      const finalMessages = [...updatedMessages, aiResponse];
      setMessages(finalMessages);
      
      // Save the conversation (only if authenticated)
      if (user) {
        await saveChatHistory(finalMessages);
      }
    } catch (error) {
      setIsTyping(false);
      const errorResponse: Message = {
        id: updatedMessages.length + 1,
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment! 😊",
        sender: "ai",
        timestamp: new Date()
      };
      
      const finalMessages = [...updatedMessages, errorResponse];
      setMessages(finalMessages);
      if (user) {
        await saveChatHistory(finalMessages);
      }
    }
  };

  const handleUsageUpdate = (usage: any) => {
    setCurrentUsage(usage);
  };

  const handleUpgrade = (tier: string) => {
    // Implement upgrade logic here
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Don't render anything if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg z-50"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
        }`}>
          <Card className="bg-gray-900/95 backdrop-blur-sm border-gray-700 h-full flex flex-col shadow-2xl">
            {/* Header */}
            <CardHeader className="bg-gray-800/80 border-b border-gray-700 flex-shrink-0 p-4">
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative">
                    <Sparkles className="h-6 w-6 mr-2 text-blue-400" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Ayla</h3>
                    <p className="text-xs text-blue-200 font-normal">Your AI Agent</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="text-gray-400 hover:text-white h-8 w-8 p-0"
                  >
                    {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>

            {/* Content - only show when not minimized */}
            {!isMinimized && (
              <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                {/* Messages */}
                <div className="flex-1 p-4 overflow-hidden">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full text-white">
                      Loading conversation...
                    </div>
                  ) : (
                    <ScrollArea className="h-full">
                      <div className="space-y-4 pr-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div className={`max-w-[85%] ${message.sender === "user" ? "order-2" : "order-1"}`}>
                              <div
                                className={`rounded-2xl p-3 ${
                                  message.sender === "user"
                                    ? "bg-blue-600 text-white rounded-br-md"
                                    : "bg-gray-800 text-white border border-gray-700 rounded-bl-md"
                                }`}
                              >
                                <div className="flex items-start space-x-2">
                                  {message.sender === "ai" && (
                                    <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                      <Sparkles className="h-3 w-3 text-white" />
                                    </div>
                                  )}
                                  <div className="flex-1">
                                    <p className="text-sm leading-relaxed">{message.content}</p>
                                    <p className="text-xs opacity-70 mt-1">
                                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                  </div>
                                  {message.sender === "user" && (
                                    <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                      <User className="h-3 w-3 text-white" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {isTyping && (
                          <div className="flex justify-start">
                            <div className="max-w-[85%]">
                              <div className="bg-gray-800 text-white border border-gray-700 rounded-2xl rounded-bl-md p-3">
                                <div className="flex items-center space-x-2">
                                  <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                                    <Sparkles className="h-3 w-3 text-white" />
                                  </div>
                                  <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>
                  )}
                </div>

                {/* Input */}
                <div className="flex-shrink-0 p-4 bg-gray-900/95 border-t border-gray-700">
                  {/* Compact Usage Indicator - only show when at or near limit */}
                  {currentUsage && (
                    (() => {
                      const tier = currentUsage.tier || 'free';
                      const limits = { free: 10, plus: 100 };
                      const limit = limits[tier as keyof typeof limits];
                      const messagesUsed = currentUsage.messagesUsed || 0;
                      const percentage = limit ? (messagesUsed / limit) * 100 : 0;
                      
                      // Only show when approaching or at limit (70% or higher)
                      if (tier !== 'pro' && percentage >= 70) {
                        return (
                          <div className="mb-3 px-3 py-2 bg-gray-800/50 rounded-lg border border-gray-600/30">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-300">
                                {messagesUsed >= limit ? '🚫 Daily limit reached' : '⚠️ Approaching limit'}
                              </span>
                              <span className="text-blue-400 font-medium">
                                {messagesUsed}/{limit === -1 ? '∞' : limit}
                              </span>
                            </div>
                            {messagesUsed >= limit && (
                              <div className="mt-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleUpgrade('plus')}
                                  className="w-full text-xs bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                >
                                  Upgrade for unlimited access
                                </Button>
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    })()
                  )}
                  
                  <div className="flex space-x-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder={isAtLimit() ? "Daily limit reached!" : "Ask me anything..."}
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 rounded-xl flex-1 h-10 text-sm"
                      onKeyPress={(e) => e.key === "Enter" && !isAtLimit() && sendMessage()}
                      disabled={isTyping || isAtLimit() || isLoading}
                    />
                    <Button 
                      onClick={sendMessage} 
                      className="bg-blue-600 hover:bg-blue-700 rounded-lg h-10 w-10 p-0"
                      disabled={isTyping || !inputMessage.trim() || isAtLimit() || isLoading}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </>
  );
};

export default FloatingChat;
