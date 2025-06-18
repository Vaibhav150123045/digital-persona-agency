
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Check } from "lucide-react";
import { OnboardingData } from "@/types/onboarding";

interface OnboardingInputAreaProps {
  currentStep: number;
  currentInput: string;
  setCurrentInput: (value: string) => void;
  onboardingData: OnboardingData;
  isTyping: boolean;
  showContinueButton: boolean;
  onSendMessage: (message: string) => void;
  onGenreToggle: (genre: string) => void;
  onSubmitGenres: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSkipPicture: () => void;
  onContinue: () => void;
}

const OnboardingInputArea = ({
  currentStep,
  currentInput,
  setCurrentInput,
  onboardingData,
  isTyping,
  showContinueButton,
  onSendMessage,
  onGenreToggle,
  onSubmitGenres,
  onFileUpload,
  onSkipPicture,
  onContinue,
}: OnboardingInputAreaProps) => {
  const actorTypeOptions = ["Stage", "Screen", "Both"];
  const genreOptions = ["Drama", "Comedy", "Action", "Horror", "Romance", "Thriller", "Sci-Fi", "Fantasy", "Musical"];

  if (showContinueButton) {
    return (
      <div className="flex justify-center">
        <Button 
          onClick={onContinue}
          className="bg-gradient-to-r from-blue-600 to-[rgb(163,92,215)] hover:from-blue-700 hover:to-[rgb(143,72,195)] px-8 py-3 text-lg font-semibold rounded-xl"
        >
          Continue to Dashboard
        </Button>
      </div>
    );
  }

  if (currentStep === 3) {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3">
          {actorTypeOptions.map((option) => (
            <Button
              key={option}
              variant="outline"
              className="bg-white/5 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/15 hover:border-white/50 hover:text-white justify-start py-4 text-base font-medium transition-all duration-300 rounded-xl shadow-lg"
              onClick={() => onSendMessage(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  if (currentStep === 4) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {genreOptions.map((option) => (
            <Button
              key={option}
              variant={onboardingData.favoriteGenres.includes(option) ? "default" : "outline"}
              size="sm"
              className={
                onboardingData.favoriteGenres.includes(option)
                  ? "bg-gradient-to-r from-blue-500/90 to-[rgb(163,92,215)]/90 backdrop-blur-sm text-white border-2 border-blue-400/50 hover:from-blue-600/90 hover:to-[rgb(143,72,195)]/90 hover:border-blue-300/60 py-3 text-sm font-medium transition-all duration-300 rounded-lg shadow-lg"
                  : "bg-white/5 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/15 hover:border-white/50 hover:text-white py-3 text-sm font-medium transition-all duration-300 rounded-lg shadow-lg"
              }
              onClick={() => onGenreToggle(option)}
            >
              {onboardingData.favoriteGenres.includes(option) && (
                <Check className="h-4 w-4 mr-1" />
              )}
              {option}
            </Button>
          ))}
        </div>
        {onboardingData.favoriteGenres.length > 0 && (
          <div className="flex justify-center">
            <Button
              onClick={onSubmitGenres}
              className="bg-gradient-to-r from-green-500/90 to-emerald-600/90 backdrop-blur-sm hover:from-green-600/90 hover:to-emerald-700/90 border border-green-400/30 px-6 py-2 rounded-xl font-medium text-white shadow-lg transition-all duration-300"
            >
              Continue with {onboardingData.favoriteGenres.length} genre{onboardingData.favoriteGenres.length > 1 ? 's' : ''}
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (currentStep === 5) {
    return (
      <div className="space-y-3">
        <div className="flex space-x-3">
          <label className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={onFileUpload}
              className="hidden"
            />
            <Button className="w-full bg-blue-500/90 backdrop-blur-sm hover:bg-blue-600/90 border border-blue-400/30 py-3 text-base font-medium text-white rounded-xl shadow-lg transition-all duration-300">
              <Upload className="h-4 w-4 mr-2" />
              Upload Picture
            </Button>
          </label>
          <Button
            variant="outline"
            onClick={onSkipPicture}
            className="bg-white/5 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/15 hover:border-white/50 hover:text-white py-3 px-6 text-base font-medium rounded-xl shadow-lg transition-all duration-300"
          >
            Skip
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex space-x-3">
      <Input
        value={currentInput}
        onChange={(e) => setCurrentInput(e.target.value)}
        placeholder={currentStep === 1 ? "Enter your name..." : currentStep === 2 ? "Enter your email..." : "Type your answer..."}
        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 rounded-xl"
        onKeyPress={(e) => e.key === "Enter" && currentInput.trim() && onSendMessage(currentInput)}
      />
      <Button 
        onClick={() => onSendMessage(currentInput)} 
        className="bg-blue-600 hover:bg-blue-700 rounded-xl"
        disabled={!currentInput.trim() || isTyping}
      >
        Send
      </Button>
    </div>
  );
};

export default OnboardingInputArea;
