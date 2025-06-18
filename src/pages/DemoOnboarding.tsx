
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Star } from "lucide-react";
import { Message, OnboardingData } from "@/types/onboarding";
import { questions } from "@/utils/onboardingQuestions";
import ChatMessage from "@/components/onboarding/ChatMessage";
import TypingIndicator from "@/components/onboarding/TypingIndicator";
import OnboardingInputArea from "@/components/onboarding/OnboardingInputArea";
import { Badge } from "@/components/ui/badge";

const DemoOnboarding = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Welcome to spais Agency! 🎭 I'm so excited to meet you and help kickstart your acting career! I'm your personal AI agent, and I'll be working with you every step of the way. Let's get to know each other better! What's your name?",
      sender: "ai",
      timestamp: new Date()
    }
  ]);
  
  const [currentInput, setCurrentInput] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    name: "",
    email: "",
    actorType: "",
    favoriteGenres: [],
    picture: null
  });

  const sendMessage = (content: string) => {
    const userMessage: Message = {
      id: messages.length + 1,
      content,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput("");
    
    // Update onboarding data based on current step
    const newData = { ...onboardingData };
    switch (currentStep) {
      case 1:
        newData.name = content;
        break;
      case 2:
        newData.email = content;
        break;
      case 3:
        newData.actorType = content;
        break;
    }
    setOnboardingData(newData);

    // Show typing indicator
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      setIsTyping(false);
      
      if (currentStep < 5) {
        const nextQuestion = questions.find(q => q.step === currentStep + 1);
        if (nextQuestion) {
          const aiResponse: Message = {
            id: messages.length + 2,
            content: nextQuestion.question.replace("{name}", newData.name),
            sender: "ai",
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiResponse]);
        }
        setCurrentStep(prev => prev + 1);
      } else {
        // Final response before showing continue button
        const finalResponse: Message = {
          id: messages.length + 2,
          content: `Perfect, ${newData.name}! 🌟 I have everything I need to get started. You're all set up and ready to dive into the amazing world of opportunities waiting for you. Click continue when you're ready to explore your personalized dashboard!`,
          sender: "ai",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, finalResponse]);
        setShowContinueButton(true);
      }
    }, 1500 + Math.random() * 1000);
  };

  const handleGenreToggle = (genre: string) => {
    const newGenres = onboardingData.favoriteGenres.includes(genre)
      ? onboardingData.favoriteGenres.filter(g => g !== genre)
      : [...onboardingData.favoriteGenres, genre];
    
    setOnboardingData(prev => ({ ...prev, favoriteGenres: newGenres }));
  };

  const submitGenres = () => {
    if (onboardingData.favoriteGenres.length === 0) return;
    
    const genreText = onboardingData.favoriteGenres.length === 1 
      ? onboardingData.favoriteGenres[0]
      : onboardingData.favoriteGenres.slice(0, -1).join(", ") + " and " + onboardingData.favoriteGenres.slice(-1);
    
    sendMessage(`I love working in: ${genreText}`);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setOnboardingData(prev => ({ ...prev, picture: file }));
      sendMessage(`I've uploaded my profile picture: ${file.name}`);
    }
  };

  const skipPicture = () => {
    sendMessage("I'll skip uploading a picture for now");
  };

  const handleContinue = () => {
    navigate("/demo-dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[rgb(163,92,215)] to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Star className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">spais</span>
            <span className="text-sm text-blue-300">Agency</span>
          </div>
          <Badge variant="outline" className="text-orange-400 border-orange-400 bg-orange-400/10">
            DEMO MODE
          </Badge>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card className="bg-gray-900/95 backdrop-blur-sm border-gray-700 h-[600px] flex flex-col">
          <CardHeader className="bg-gray-800/80 border-b border-gray-700 flex-shrink-0">
            <CardTitle className="text-white flex items-center">
              <div className="relative">
                <Sparkles className="h-8 w-8 mr-3 text-blue-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Welcome to spais Agency!</h3>
                <p className="text-sm text-blue-200 font-normal">Let's get you set up • Step {currentStep} of 5</p>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-6 bg-gray-900/95 min-h-0">
            {/* Chat Messages */}
            <ScrollArea className="flex-1 pr-4 mb-6">
              <div className="space-y-6">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                
                {isTyping && <TypingIndicator />}
              </div>
            </ScrollArea>

            {/* Input Area */}
            {currentStep <= 5 && (
              <div className="space-y-4 flex-shrink-0">
                <OnboardingInputArea
                  currentStep={currentStep}
                  currentInput={currentInput}
                  setCurrentInput={setCurrentInput}
                  onboardingData={onboardingData}
                  isTyping={isTyping}
                  showContinueButton={showContinueButton}
                  onSendMessage={sendMessage}
                  onGenreToggle={handleGenreToggle}
                  onSubmitGenres={submitGenres}
                  onFileUpload={handleFileUpload}
                  onSkipPicture={skipPicture}
                  onContinue={handleContinue}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DemoOnboarding;
