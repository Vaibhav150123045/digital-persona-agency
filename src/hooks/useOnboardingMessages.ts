
import { useState } from "react";
import { Message, OnboardingData } from "@/types/onboarding";
import { questions } from "@/utils/onboardingQuestions";
import { checkEmailExists } from "@/services/emailValidationService";
import { saveOnboardingData } from "@/services/onboardingDataService";
import { useToast } from "@/components/ui/use-toast";

export const useOnboardingMessages = () => {
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Welcome to spais Agency! 🎭 I'm so excited to meet you and help kickstart your acting career! I'm your personal AI agent, and I'll be working with you every step of the way. Let's get to know each other better! What's your name?",
      sender: "ai",
      timestamp: new Date()
    }
  ]);
  
  const [isTyping, setIsTyping] = useState(false);

  const addUserMessage = (content: string) => {
    const userMessage: Message = {
      id: messages.length + 1,
      content,
      sender: "user",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
  };

  const addAIMessage = (content: string) => {
    const aiMessage: Message = {
      id: messages.length + 1,
      content,
      sender: "ai",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, aiMessage]);
  };

  const handleEmailValidation = async (
    email: string, 
    userName: string,
    onSuccess: () => void
  ) => {
    console.log('🔍 EMAIL STEP TRIGGERED');
    console.log('User input:', email);
    
    setIsTyping(true);

    try {
      const emailExists = await checkEmailExists(email.toLowerCase().trim());
      
      setIsTyping(false);
      console.log('🎯 Final email validation result:', emailExists);

      if (emailExists) {
        console.log('❌ Email exists - showing error message');
        const errorResponse: Message = {
          id: messages.length + 2,
          content: `I'm sorry ${userName}, but it looks like someone is already using ${email}. Could you please try a different email address? I want to make sure you get your own personalized experience! 📧`,
          sender: "ai",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorResponse]);
        return false;
      } else {
        console.log('✅ Email is available - proceeding to next step');
        onSuccess();
        return true;
      }
    } catch (error) {
      console.error('💥 Error during email validation:', error);
      setIsTyping(false);
      const errorResponse: Message = {
        id: messages.length + 2,
        content: `I'm having trouble checking that email right now. Let's continue for now, but you might need to use a different email if this one is already taken.`,
        sender: "ai",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
      return true; // Allow progression on error
    }
  };

  const processNextStep = async (
    currentStep: number,
    onboardingData: OnboardingData,
    onStepComplete: () => void
  ) => {
    // Save data after location is collected (step 3 and onwards)
    if (currentStep >= 3) {
      try {
        await saveOnboardingData(onboardingData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to save your information. Please try again.",
          variant: "destructive"
        });
      }
    }

    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      
      if (currentStep < 6) {
        const nextQuestion = questions.find(q => q.step === currentStep + 1);
        if (nextQuestion) {
          const aiResponse: Message = {
            id: messages.length + 2,
            content: nextQuestion.question.replace("{name}", onboardingData.name),
            sender: "ai",
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiResponse]);
        }
        onStepComplete();
      } else {
        const finalResponse: Message = {
          id: messages.length + 2,
          content: `Perfect, ${onboardingData.name}! 🌟 I have everything I need to get started. You're all set up and ready to dive into the amazing world of opportunities waiting for you. Click continue when you're ready to explore your personalized dashboard!`,
          sender: "ai",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, finalResponse]);
        onStepComplete();
      }
    }, 1500 + Math.random() * 1000);
  };

  return {
    messages,
    setMessages,
    isTyping,
    setIsTyping,
    addUserMessage,
    addAIMessage,
    handleEmailValidation,
    processNextStep
  };
};
