
import { Card, CardContent } from "@/components/ui/card";
import { useOnboardingFlow } from "@/hooks/useOnboardingFlow";
import OnboardingHeader from "@/components/onboarding/OnboardingHeader";
import OnboardingCardHeader from "@/components/onboarding/OnboardingCardHeader";
import OnboardingChatArea from "@/components/onboarding/OnboardingChatArea";
import OnboardingInputArea from "@/components/onboarding/OnboardingInputArea";

const Onboarding = () => {
  const {
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
  } = useOnboardingFlow();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[rgb(163,92,215)] to-slate-900">
      <OnboardingHeader />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card className="bg-gray-900/95 backdrop-blur-sm border-gray-700 h-[600px] flex flex-col">
          <OnboardingCardHeader currentStep={currentStep} />

          <CardContent className="flex-1 flex flex-col p-6 bg-gray-900/95 min-h-0">
            <OnboardingChatArea messages={messages} isTyping={isTyping} />

            {(currentStep <= 6 || showContinueButton) && (
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

export default Onboarding;
