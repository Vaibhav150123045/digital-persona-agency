
import { Star } from "lucide-react";

const OnboardingHeader = () => {
  return (
    <header className="bg-black/20 backdrop-blur-lg border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Star className="h-8 w-8 text-blue-400" />
          <span className="text-2xl font-bold text-white">spais</span>
          <span className="text-sm text-blue-300">Agency</span>
        </div>
      </div>
    </header>
  );
};

export default OnboardingHeader;
