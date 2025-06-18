
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Bot, Star, Clock, MapPin, DollarSign } from "lucide-react";
import type { OpportunityMatch } from "@/services/autoSubmissionService";

interface AIRecommendationCardProps {
  match: OpportunityMatch;
}

const AIRecommendationCard = ({ match }: AIRecommendationCardProps) => {
  return (
    <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-white flex items-center gap-2">
              {match.opportunity.title}
              {match.eligible_for_auto_submit && (
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                  <Bot className="h-3 w-3 mr-1" />
                  Auto-Submit
                </Badge>
              )}
            </CardTitle>
            {match.opportunity.project_name && (
              <CardDescription className="text-white/70">{match.opportunity.project_name}</CardDescription>
            )}
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="text-white font-semibold">
                {Math.round(match.match_score * 100)}%
              </span>
            </div>
            <Progress 
              value={match.match_score * 100} 
              className="w-20 h-2"
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {match.opportunity.description && (
          <p className="text-white/80 text-sm line-clamp-2">{match.opportunity.description}</p>
        )}
        
        <div className="flex flex-wrap gap-3 text-sm text-white/70">
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
            {match.opportunity.role_type}
          </Badge>
          
          {match.opportunity.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {match.opportunity.location}
            </div>
          )}
          {match.opportunity.compensation_range && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              {match.opportunity.compensation_range}
            </div>
          )}
          {match.opportunity.application_deadline && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Deadline: {new Date(match.opportunity.application_deadline).toLocaleDateString()}
            </div>
          )}
        </div>

        <div className="bg-white/5 rounded-lg p-3">
          <p className="text-xs text-white/60 mb-1">AI Analysis:</p>
          <p className="text-sm text-white/80">{match.reasoning}</p>
        </div>

        {match.opportunity.genres && match.opportunity.genres.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {match.opportunity.genres.map((genre) => (
              <Badge key={genre} variant="outline" className="text-xs border-white/20 text-white/70">
                {genre}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <div className="text-xs text-white/50">
          Posted {new Date(match.opportunity.created_at).toLocaleDateString()}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            View Details
          </Button>
          {!match.eligible_for_auto_submit && (
            <Button 
              size="sm"
              className="bg-purple-600 hover:bg-purple-700"
            >
              Manual Submit
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default AIRecommendationCard;
