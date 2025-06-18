
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles } from "lucide-react";

interface FeatureLockedCardProps {
  onUnlock: () => void;
}

const FeatureLockedCard = ({ onUnlock }: FeatureLockedCardProps) => {
  return (
    <Card className="bg-gradient-to-r from-gray-900/20 to-gray-800/20 backdrop-blur-sm border-gray-500/20">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-white text-xl">Feature Locked</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-gray-300">
          Complete your account setup to unlock this premium feature and access the full power of spais Agency.
        </p>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
          <Sparkles className="h-4 w-4 text-yellow-400" />
          <span>Premium feature included in your plan</span>
        </div>
        <Button 
          onClick={onUnlock}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        >
          Complete Setup
        </Button>
      </CardContent>
    </Card>
  );
};

export default FeatureLockedCard;
