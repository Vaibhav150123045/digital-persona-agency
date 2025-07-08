
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { OnboardingData } from "@/types/onboarding";
import { useOnboardingMessages } from "./useOnboardingMessages";
import { saveOnboardingData } from "@/services/onboardingDataService";

export const useOnboardingFlow = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    messages,
    setMessages,
    isTyping,
    setIsTyping,
    addUserMessage,
    addAIMessage,
    handleEmailValidation,
    processNextStep
  } = useOnboardingMessages();
  
  const [currentInput, setCurrentInput] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    name: "",
    email: "",
    location: "",
    actorType: "",
    favoriteGenres: [],
    picture: null
  });

  const sendMessage = async (content: string) => {
    addUserMessage(content);
    setCurrentInput("");
    
    // Update onboarding data based on current step
    const newData = { ...onboardingData };
    switch (currentStep) {
      case 1:
        newData.name = content;
        break;
      case 2:
        newData.email = content.toLowerCase().trim();
        break;
      case 3:
        newData.location = content;
        break;
      case 4:
        newData.actorType = content;
        break;
    }
    setOnboardingData(newData);

    // Special handling for email validation in step 2
    if (currentStep === 2) {
      const isValid = await handleEmailValidation(
        content.toLowerCase().trim(),
        newData.name,
        () => {
          processNextStep(currentStep, newData, () => setCurrentStep(prev => prev + 1));
        }
      );
      if (!isValid) return; // Don't advance if email exists
    } else {
      await processNextStep(currentStep, newData, () => {
        if (currentStep >= 6) {
          setShowContinueButton(true);
        }
        setCurrentStep(prev => prev + 1);
      });
    }
  };

  const handleGenreToggle = (genre: string) => {
    const newGenres = onboardingData.favoriteGenres.includes(genre)
      ? onboardingData.favoriteGenres.filter(g => g !== genre)
      : [...onboardingData.favoriteGenres, genre];
    
    const newData = { ...onboardingData, favoriteGenres: newGenres };
    setOnboardingData(newData);
    
    // Save updated data
    if (newData.name && newData.email) {
      saveOnboardingData(newData).catch(error => {
        toast({
          title: "Error",
          description: "Failed to save your information. Please try again.",
          variant: "destructive"
        });
      });
    }
  };

  const submitGenres = () => {
    if (onboardingData.favoriteGenres.length === 0) return;
    
    const genreText = onboardingData.favoriteGenres.length === 1 
      ? onboardingData.favoriteGenres[0]
      : onboardingData.favoriteGenres.slice(0, -1).join(", ") + " and " + onboardingData.favoriteGenres.slice(-1);
    
    sendMessage(`I love working in: ${genreText}`);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleFileUpload called");
    const file = event.target.files?.[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    console.log("File selected:", file.name, file.type, file.size);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.log("Invalid file type:", file.type);
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.log("File too large:", file.size);
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log("Processing file upload...");
      
      // Update the onboarding data with the file
      const newData = { ...onboardingData, picture: file };
      setOnboardingData(newData);
      
      // Save the updated data with the picture
      await saveOnboardingData(newData);
      
      // Show success message with image preview
      addUserMessage(`I've uploaded my profile picture: ${file.name}`);
      
      // Show typing indicator
      setIsTyping(true);
      
      // AI response
      setTimeout(() => {
        setIsTyping(false);
        addAIMessage(`Great choice! I can see your profile picture looks fantastic. ${onboardingData.name}, you're all set! 🌟 I have everything I need to get started. You're ready to dive into the amazing world of opportunities waiting for you. Click continue when you're ready to explore your personalized dashboard!`);
        setCurrentStep(7);
        setShowContinueButton(true);
      }, 1500);

      toast({
        title: "Image uploaded successfully!",
        description: "Your profile picture has been saved.",
      });

      console.log("File upload completed successfully");

    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image. Please try again.",
        variant: "destructive"
      });
    }

    // Reset the input value to allow selecting the same file again
    event.target.value = '';
  };

  const skipPicture = () => {
    sendMessage("I'll skip uploading a picture for now");
  };

  const handleContinue = () => {
    console.log("Navigating to dashboard...");
    console.log("Current window location:", window.location.href);
    
    // Don't clear the onboarding session immediately - let Dashboard handle it
    // Just navigate to dashboard
    console.log("About to navigate to /dashboard");
    navigate("/dashboard", { replace: true });
    
    // Add a timeout to check if navigation worked
    setTimeout(() => {
      console.log("After navigation - window location:", window.location.href);
    }, 100);
  };

  return {
    messages,
    currentInput,
    setCurrentInput,
    currentStep,
    isTyping,
    showContinueButton,
    onboardingData,
    sendMessage,
    handleGenreToggle,
    submitGenres,
    handleFileUpload,
    skipPicture,
    handleContinue
  };
};
