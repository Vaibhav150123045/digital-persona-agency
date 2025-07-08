import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, User, Sparkles, Coffee, Heart } from "lucide-react";
import { aiChatService } from "@/services/aiChatService";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ChatUsageIndicator from "./ChatUsageIndicator";
import ChatUpgradePrompt from "./ChatUpgradePrompt";

interface Message {
  id: number;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  typing?: boolean;
}

interface ChatInterface {
  userProfile?: any;
}

const ChatInterface = ({ userProfile }: ChatInterface) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [currentUsage, setCurrentUsage] = useState<any>(null);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if user has reached their daily limit
  const isAtLimit = () => {
    if (!currentUsage || !user) return false; // Don't limit non-authenticated users
    const tier = currentUsage.tier || 'free';
    if (tier === 'pro') return false; // Pro has unlimited messages
    
    const limits = {
      free: 10,
      plus: 100
    };
    
    const limit = limits[tier as keyof typeof limits];
    const messagesUsed = currentUsage.messagesUsed || 0;
    
    console.log('Checking limit for user:', user?.email, {
      messagesUsed,
      limit,
      tier,
      isAtLimit: messagesUsed >= limit
    });
    
    return messagesUsed >= limit;
  };

  // Initialize usage data when component mounts
  useEffect(() => {
    const initializeUsage = async () => {
      if (user) {
        try {
          console.log('Initializing usage data for user:', user.email);
          const usageData = await aiChatService.getCurrentUsage();
          console.log('Initializing usage data for user:', user.email, usageData);
          setCurrentUsage(usageData);
        } catch (error) {
          console.error('Error initializing usage for user:', user?.email, error);
        }
      } else {
        console.log('No authenticated user, skipping usage initialization');
        // For non-authenticated users, set default usage
        setCurrentUsage({ messages_used: 0, tier: 'free' });
      }
    };

    initializeUsage();
  }, [user]); // Reinitialize when user changes

  useEffect(() => {
    const loadChatHistory = async () => {
      console.log('Loading chat history, user:', user, 'userProfile:', userProfile);
      
      // First, try to get onboarding data if no authenticated user
      if (!user) {
        try {
          const sessionId = localStorage.getItem('onboarding_session_id');
          console.log('Session ID from localStorage:', sessionId);
          
          if (sessionId) {
            const { data, error } = await supabase
              .from('onboarding_sessions')
              .select('*')
              .eq('session_id', sessionId)
              .single();

            console.log('Onboarding data from DB:', data, 'Error:', error);

            if (data && !error) {
              setOnboardingData(data);
              // Create welcome message immediately with onboarding data
              const welcomeMessage = createWelcomeMessage(data, false);
              setMessages([welcomeMessage]);
              setIsLoading(false);
              return;
            }
          }
        } catch (error) {
          console.error('Error loading onboarding data:', error);
        }
        
        // If no onboarding data found but userProfile exists, use that
        if (userProfile && userProfile.name) {
          console.log('Using userProfile for welcome message:', userProfile);
          const welcomeMessage = createWelcomeMessage(userProfile, false);
          setMessages([welcomeMessage]);
          setIsLoading(false);
          return;
        }
        
        // Last fallback - try to get onboarding data one more time with different approach
        try {
          const sessionId = localStorage.getItem('onboarding_session_id');
          if (sessionId) {
            const { data } = await supabase
              .from('onboarding_sessions')
              .select('*')
              .eq('session_id', sessionId)
              .maybeSingle();
            
            if (data) {
              console.log('Found onboarding data on second attempt:', data);
              const welcomeMessage = createWelcomeMessage(data, false);
              setMessages([welcomeMessage]);
              setIsLoading(false);
              return;
            }
          }
        } catch (error) {
          console.error('Error on second onboarding data attempt:', error);
        }
        
        // Create basic welcome message for non-authenticated users without onboarding data
        console.log('Creating generic welcome message - no profile data found');
        const welcomeMessage = createWelcomeMessage(null, false);
        setMessages([welcomeMessage]);
        setIsLoading(false);
        return;
      }

      try {
        // Get user profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        console.log('Profile data from DB for user:', user.email, profile);

        // Get chat history
        const { data: chatData } = await supabase
          .from('chat_histories')
          .select('chat_history')
          .eq('user_email', user.email)
          .single();

        console.log('Chat history from DB for user:', user.email, chatData);

        if (chatData?.chat_history && Array.isArray(chatData.chat_history) && chatData.chat_history.length > 0) {
          // Convert stored chat history to Message format
          const loadedMessages = chatData.chat_history.map((msg: any, index: number) => ({
            id: index + 1,
            content: msg.content,
            sender: msg.sender,
            timestamp: new Date(msg.timestamp)
          }));
          
          console.log('Loaded existing chat history for user:', user.email, loadedMessages.length, 'messages');
          setMessages(loadedMessages);
          
          // Add a "welcome back" message at the end for returning users
          const profileToUse = profile || userProfile;
          const welcomeBackMessage = createWelcomeMessage(profileToUse, true);
          setMessages(prev => [...prev, welcomeBackMessage]);
        } else {
          console.log('No existing chat history found for user:', user.email, 'creating initial welcome message');
          // Create welcome message with personalized info for first-time users
          const profileToUse = profile || userProfile;
          const welcomeMessage = createWelcomeMessage(profileToUse, false);
          setMessages([welcomeMessage]);
        }
      } catch (error) {
        console.error('Error loading chat history for user:', user?.email, error);
        // Fallback to basic welcome message
        const welcomeMessage = createWelcomeMessage(userProfile, false);
        setMessages([welcomeMessage]);
      } finally {
        setIsLoading(false);
      }
    };

    loadChatHistory();
  }, [user, userProfile]);

  const createWelcomeMessage = (profileData: any, isReturningUser: boolean): Message => {
    console.log('createWelcomeMessage called with:', profileData, 'isReturningUser:', isReturningUser);
    
    let welcomeContent = "";
    
    if (profileData && profileData.name) {
      console.log('Using personalized greeting for:', profileData.name);
      
      if (isReturningUser) {
        // Welcome back message for returning users
        welcomeContent = `Welcome back, ${profileData.name}! 👋 I see we've chatted before. I'm ready to pick up where we left off and help you with whatever you need today!`;
        
        if (profileData.actor_type) {
          welcomeContent += ` I remember you're a ${profileData.actor_type} actor`;
          if (profileData.favorite_genres && profileData.favorite_genres.length > 0) {
            welcomeContent += ` who loves ${profileData.favorite_genres.join(', ')}`;
          }
          welcomeContent += ".";
        }
        
        welcomeContent += " What would you like to work on today? 🎭";
      } else {
        // Initial welcome message for new users
        welcomeContent = `Hey ${profileData.name}! 👋 Welcome${user ? ' back' : ''}! I'm Ayla, your personal talent agent, and I'm so excited to work with you today!`;
        
        if (profileData.actor_type) {
          welcomeContent += ` I see you're a ${profileData.actor_type} actor`;
          if (profileData.favorite_genres && profileData.favorite_genres.length > 0) {
            welcomeContent += ` who loves ${profileData.favorite_genres.join(', ')}`;
          }
          welcomeContent += ".";
        }
        
        if (profileData.location) {
          welcomeContent += ` I know you're based in ${profileData.location}, so I'll keep that in mind when looking for opportunities.`;
        }
        
        welcomeContent += " I've been looking over your profile and I have some fantastic opportunities lined up. What's on your mind? Need help finding the perfect audition, or maybe you want to strategize about your next career move?";
      }
    } else {
      console.log('Using generic greeting - no name found in profile data');
      if (isReturningUser) {
        welcomeContent = "Welcome back! 👋 I see we've chatted before. I'm ready to pick up where we left off and help you with whatever you need today! What would you like to work on? 🎭";
      } else {
        welcomeContent = "Hey there! 👋 I'm Ayla, your personal talent agent, and I'm so excited to work with you today! I've been looking over your profile and I have some fantastic opportunities lined up. What's on your mind? Need help finding the perfect audition, or maybe you want to strategize about your next career move?";
      }
    }

    console.log('Welcome message created:', welcomeContent);
    return {
      id: Date.now(), // Use timestamp to avoid ID conflicts with existing messages
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
    let systemPrompt = `You are an enthusiastic and supportive talent agent with specialist knowledge of the acting industry in London and Los Angeles. You help actors and performers with:
    - Finding auditions and opportunities
    - Career advice and strategy
    - Industry insights and trends
    - Audition preparation and feedback
    - Professional development

    CRITICAL: You ARE their talent agent. You are their representation. NEVER suggest they seek other representation, find another agent, or get professional representation elsewhere. You are their professional representation. When they ask about representation or agents, remind them that you ARE their agent and you're here to help them succeed.

    Always be encouraging, personable, and professional. Use emojis occasionally to show personality. Keep responses conversational but informative - no long paragraphs. Be genuinely invested in their success as their dedicated talent agent.`;

    // Use either authenticated user profile or onboarding data
    const dataSource = userProfile || onboardingData;
    
    if (dataSource) {
      systemPrompt += `\n\nIMPORTANT CONTEXT ABOUT THIS USER:`;
      if (dataSource.name) systemPrompt += `\n- Name: ${dataSource.name}`;
      if (dataSource.actor_type) systemPrompt += `\n- Actor Type: ${dataSource.actor_type}`;
      if (dataSource.favorite_genres && dataSource.favorite_genres.length > 0) {
        systemPrompt += `\n- Favorite Genres: ${dataSource.favorite_genres.join(', ')}`;
      }
      if (dataSource.location) systemPrompt += `\n- Location: ${dataSource.location}`;
      if (dataSource.role) systemPrompt += `\n- Role: ${dataSource.role}`;
      
      systemPrompt += `\n\nRemember this information about the user and reference it naturally in your conversations. ${user ? 'You have a history with this user, so act like you know them personally.' : 'This user just completed onboarding, so welcome them warmly and reference their information.'} You are their dedicated talent agent working exclusively for their success.`;
    }

    return systemPrompt;
  };

  const handleUsageUpdate = (usage: any) => {
    console.log('Usage updated in ChatInterface for user:', user?.email, usage);
    setCurrentUsage(usage);
  };

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleUpgrade = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout');
      if (error) {
        console.error('Checkout error:', error);
      } else if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Checkout error:', error);
    }
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
    const currentInput = inputMessage;
    setInputMessage("");
    setIsTyping(true);

    try {
      // Convert messages to the format expected by the AI service
      const chatHistory = updatedMessages
        .filter(msg => !msg.typing)
        .map(msg => ({
          role: msg.sender === "user" ? "user" as const : "assistant" as const,
          content: msg.content
        }));

      // Create system prompt with user context (including onboarding data)
      const systemPrompt = await createSystemPrompt();

      // Get AI response with usage tracking
      const response = await aiChatService.sendMessage(chatHistory, systemPrompt);
      
      setIsTyping(false);

      // Check if limit was exceeded
      if (response.limitExceeded) {
        setShowUpgradePrompt(true);
        const limitMessage: Message = {
          id: updatedMessages.length + 1,
          content: response.message,
          sender: "ai",
          timestamp: new Date()
        };
        setMessages([...updatedMessages, limitMessage]);
        return;
      }

      // Update usage info immediately after successful response
      if (response.usage) {
        console.log('Updating usage from response for user:', user?.email, response.usage);
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

  const quickActions = [
    { text: "Find me auditions that match my type", icon: "🎬" },
    { text: "How's my submission rate looking?", icon: "📊" },
    { text: "Any feedback from my recent auditions?", icon: "💭" },
    { text: "What should I focus on this week?", icon: "🎯" }
  ];

  if (showUpgradePrompt) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <ChatUpgradePrompt
            tier={currentUsage?.tier || 'free'}
            messagesUsed={currentUsage?.messagesUsed || 0}
            limit={currentUsage?.messagesLimit || 10}
            onClose={() => setShowUpgradePrompt(false)}
          />
        </div>
        <div className="space-y-4">
          <ChatUsageIndicator
            usage={currentUsage}
            onUpgrade={handleUpgrade}
            onUsageUpdate={handleUsageUpdate}
          />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-gray-900/95 backdrop-blur-sm border-gray-700 h-[700px] flex items-center justify-center">
            <div className="text-white">Loading conversation...</div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Chat Interface - Fixed Height */}
      <div className="lg:col-span-2">
        <Card className="bg-gray-900/95 backdrop-blur-sm border-gray-700 h-[700px] flex flex-col">
          <CardHeader className="bg-gray-800/80 border-b border-gray-700 flex-shrink-0">
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative">
                  <Sparkles className="h-8 w-8 mr-3 text-blue-400" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">1-2-1</h3>
                  <p className="text-sm text-blue-200 font-normal">
                    AI-powered responses • Online now
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
                <Heart className="h-4 w-4 text-red-400" />
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            {/* Chat Messages - Scrollable Area */}
            <div className="flex-1 p-6 pt-0 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="space-y-6 pr-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] ${
                          message.sender === "user"
                            ? "order-2"
                            : "order-1"
                        }`}
                      >
                        <div
                          className={`rounded-2xl p-4 ${
                            message.sender === "user"
                              ? "bg-blue-600 text-white rounded-br-md"
                              : "bg-gray-800 text-white border border-gray-700 rounded-bl-md"
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            {message.sender === "ai" && (
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-[rgb(163,92,215)] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <Sparkles className="h-4 w-4 text-white" />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="text-sm leading-relaxed">{message.content}</p>
                              <p className="text-xs opacity-70 mt-2">
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                            {message.sender === "user" && (
                              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <User className="h-4 w-4 text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="max-w-[75%]">
                        <div className="bg-gray-800 text-white border border-gray-700 rounded-2xl rounded-bl-md p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-[rgb(163,92,215)] rounded-full flex items-center justify-center">
                              <Sparkles className="h-4 w-4 text-white" />
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
            </div>

            {/* Chat Input - Fixed at Bottom */}
            <div className="flex-shrink-0 p-6 pt-0 bg-gray-900/95 border-t border-gray-700">
              <div className="space-y-4">
                <div className="flex space-x-3">
                  <div className="flex-1 relative">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder={isAtLimit() ? "Daily limit reached - upgrade to continue chatting!" : "Ask me anything... I'm here to help! 💪"}
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 rounded-xl pr-12 h-12"
                      onKeyPress={(e) => e.key === "Enter" && !isAtLimit() && sendMessage()}
                      disabled={isTyping || isAtLimit()}
                    />
                    <Button 
                      onClick={sendMessage} 
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 rounded-lg h-8 w-8 p-0"
                      disabled={isTyping || !inputMessage.trim() || isAtLimit()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-white border-gray-600 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs justify-start h-auto py-2 px-3"
                      onClick={() => !isAtLimit() && setInputMessage(action.text)}
                      disabled={isTyping || isAtLimit()}
                    >
                      <span className="mr-2">{action.icon}</span>
                      {action.text}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar with Usage & Agent Info */}
      <div className="space-y-6">
        <ChatUsageIndicator
          usage={currentUsage}
          onUpgrade={handleUpgrade}
          onUsageUpdate={handleUsageUpdate}
        />

        {/* Agent Info & Stats */}
        <Card className="bg-gray-900/95 backdrop-blur-sm border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Coffee className="h-5 w-5 mr-2 text-amber-400" />
              Your Agent
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-[rgb(163,92,215)] rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-white font-semibold">Ayla</h3>
              <p className="text-gray-300 text-sm">Your Personal Talent Agent</p>
              <div className="flex items-center justify-center mt-2 text-sm text-green-400">
                <div className="w-2 h-2 rounded-full mr-2 animate-pulse bg-green-400"></div>
                AI-Powered • 24/7
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-blue-400 text-sm font-medium">This Week's Wins</div>
                <div className="text-white text-lg font-bold">3 Auditions Booked</div>
                <div className="text-gray-300 text-xs">2 callbacks pending</div>
              </div>

              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-purple-400 text-sm font-medium">Success Rate</div>
                <div className="text-white text-lg font-bold">78%</div>
                <div className="text-gray-300 text-xs">Above industry average</div>
              </div>

              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-green-400 text-sm font-medium">Active Opportunities</div>
                <div className="text-white text-lg font-bold">12 Matches</div>
                <div className="text-gray-300 text-xs">Ready to submit</div>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <h4 className="text-white font-medium mb-3">Recent Achievements 🏆</h4>
              <div className="space-y-2 text-sm">
                <div className="text-gray-300">• Landed Netflix audition</div>
                <div className="text-gray-300">• 5-star casting director review</div>
                <div className="text-gray-300">• Featured in industry spotlight</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatInterface;
