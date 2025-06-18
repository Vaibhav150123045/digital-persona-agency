
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AIRecommendationCard from "./AIRecommendationCard";
import type { OpportunityMatch } from "@/services/autoSubmissionService";

interface AIRecommendationsListProps {
  matches: OpportunityMatch[];
  autoEligibleCount: number;
}

const AIRecommendationsList = ({ matches, autoEligibleCount }: AIRecommendationsListProps) => {
  if (matches.length === 0) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-8 text-center">
          <p className="text-white/70">No opportunities found to analyze.</p>
          <p className="text-white/50 text-sm mt-2">Make sure there are active casting opportunities available!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">AI Recommendations</h3>
        <div className="flex gap-2">
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
            {matches.length} opportunities analyzed
          </Badge>
          {autoEligibleCount > 0 && (
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
              {autoEligibleCount} auto-eligible
            </Badge>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        {matches.map((match) => (
          <AIRecommendationCard key={match.opportunity.id} match={match} />
        ))}
      </div>
    </div>
  );
};

export default AIRecommendationsList;
