
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface AIInsightsProps {
  displayProfile: any;
}

const AIInsights = ({ displayProfile }: AIInsightsProps) => {
  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayProfile.isNewUser ? (
          <>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <div className="text-blue-400 font-medium text-sm">Welcome!</div>
              <div className="text-white text-sm">Complete your signup to start receiving personalized opportunities</div>
            </div>
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <div className="text-green-400 font-medium text-sm">Getting Started</div>
              <div className="text-white text-sm">Your AI agent is analyzing your preferences</div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <div className="text-green-400 font-medium text-sm">Market Trend</div>
              <div className="text-white text-sm">Drama series casting up 23% this month</div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <div className="text-blue-400 font-medium text-sm">Recommendation</div>
              <div className="text-white text-sm">Focus on commercial auditions - high success rate</div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsights;
