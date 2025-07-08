
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface OnboardingCardHeaderProps {
  currentStep: number;
}

const OnboardingCardHeader = ({ currentStep }: OnboardingCardHeaderProps) => {
  const isComplete = currentStep > 6;
  
  return (
    <CardHeader className="bg-gray-800/80 border-b border-gray-700 flex-shrink-0">
      <CardTitle className="text-white flex items-center">
        <div className="relative">
          <Sparkles className="h-8 w-8 mr-3 text-blue-400" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Welcome to spais Agency!</h3>
          <p className="text-sm text-blue-200 font-normal">
            {isComplete ? "Setup Complete!" : `Let's get you set up • Step ${currentStep} of 6`}
          </p>
        </div>
      </CardTitle>
    </CardHeader>
  );
};

export default OnboardingCardHeader;
