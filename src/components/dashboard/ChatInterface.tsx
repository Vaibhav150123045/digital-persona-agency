import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, User, Sparkles, Heart, Coffee } from "lucide-react";
import { aiChatService } from "@/services/aiChatService";
import ApiKeyInput from "./ApiKeyInput";

interface Message {
  id: number;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  typing?: boolean;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hey there! 👋 I'm your personal talent agent, and I'm so excited to work with you today! I've been looking over your profile and I have some fantastic opportunities lined up. What's on your mind? Need help finding the perfect audition, or maybe you want to strategize about your next career move?",
      sender: "ai",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(aiChatService.hasApiKey());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      content: inputMessage,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage("");
    setIsTyping(true);

    try {
      // Convert messages to the format expected by the AI service
      const chatHistory = messages
        .filter(msg => !msg.typing)
        .map(msg => ({
          role: msg.sender === "user" ? "user" as const : "assistant" as const,
          content: msg.content
        }));

      // Add the current user message
      chatHistory.push({
        role: "user" as const,
        content: currentInput
      });

      // Get AI response
      const response = await aiChatService.sendMessage(chatHistory);
      
      setIsTyping(false);
      const aiResponse: Message = {
        id: messages.length + 2,
        content: response.message,
        sender: "ai",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      setIsTyping(false);
      const errorResponse: Message = {
        id: messages.length + 2,
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment! 😊",
        sender: "ai",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    }
  };

  const handleApiKeySet = (key: string) => {
    aiChatService.setApiKey(key);
    setHasApiKey(true);
  };

  const quickActions = [
    { text: "Find me auditions that match my type", icon: "🎬" },
    { text: "How's my submission rate looking?", icon: "📊" },
    { text: "Any feedback from my recent auditions?", icon: "💭" },
    { text: "What should I focus on this week?", icon: "🎯" }
  ];

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
                  <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse ${hasApiKey ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Your Personal Agent</h3>
                  <p className="text-sm text-blue-200 font-normal">
                    {hasApiKey ? "AI-powered responses • Online now" : "Demo mode • Add API key for AI responses"}
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
            {/* API Key Input */}
            <div className="flex-shrink-0 p-6 pb-0">
              <ApiKeyInput onApiKeySet={handleApiKeySet} hasApiKey={hasApiKey} />
            </div>

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
                      placeholder="Ask me anything... I'm here to help! 💪"
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 rounded-xl pr-12 h-12"
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <Button 
                      onClick={sendMessage} 
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 rounded-lg h-8 w-8 p-0"
                      disabled={isTyping}
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
                      onClick={() => setInputMessage(action.text)}
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
            <h3 className="text-white font-semibold">Alex AI</h3>
            <p className="text-gray-300 text-sm">Your Personal Talent Agent</p>
            <div className={`flex items-center justify-center mt-2 text-sm ${hasApiKey ? 'text-green-400' : 'text-yellow-400'}`}>
              <div className={`w-2 h-2 rounded-full mr-2 animate-pulse ${hasApiKey ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
              {hasApiKey ? "AI-Powered • 24/7" : "Demo Mode"}
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
  );
};

export default ChatInterface;
