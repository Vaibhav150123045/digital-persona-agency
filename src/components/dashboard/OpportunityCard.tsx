
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign, Clock, Trash2, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { castingService } from "@/services/castingService";
import type { CastingOpportunity } from "@/types/casting";

interface OpportunityCardProps {
  opportunity: CastingOpportunity;
  onQuickSubmit: (opportunityId: string) => void;
  onRemove?: (opportunityId: string) => void;
}

const OpportunityCard = ({ opportunity, onQuickSubmit, onRemove }: OpportunityCardProps) => {
  const { toast } = useToast();

  const handleRemove = async () => {
    try {
      await castingService.removeOpportunity(opportunity.id);
      toast({
        title: "Opportunity Removed",
        description: "The casting opportunity has been removed from your list"
      });
      if (onRemove) {
        onRemove(opportunity.id);
      }
    } catch (error) {
      console.error('Error removing opportunity:', error);
      toast({
        title: "Error",
        description: "Failed to remove the opportunity",
        variant: "destructive"
      });
    }
  };

  const handleViewDetails = () => {
    if (opportunity.external_url) {
      // Store the opportunity ID in localStorage to track when user returns
      localStorage.setItem('lastViewedOpportunity', JSON.stringify({
        id: opportunity.id,
        title: opportunity.title,
        project_name: opportunity.project_name,
        timestamp: Date.now()
      }));
      
      window.open(opportunity.external_url, '_blank', 'noopener,noreferrer');
    } else {
      toast({
        title: "No Link Available",
        description: "This opportunity doesn't have an external link available",
        variant: "destructive"
      });
    }
  };

  // Normalize display values to ensure consistency
  const displayLocation = opportunity.location || "Location not specified";
  const displayCompensation = opportunity.compensation_range || "Compensation not specified";
  const displayDescription = opportunity.description || "No description available";
  const displayProjectName = opportunity.project_name || "";
  const displayGenres = opportunity.genres || [];
  const displaySource = opportunity.source_platform || "Unknown source";

  return (
    <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-white text-lg font-semibold leading-tight">
              {opportunity.title}
            </CardTitle>
            {displayProjectName && (
              <CardDescription className="text-white/70 mt-1 text-sm">
                {displayProjectName}
              </CardDescription>
            )}
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
              {opportunity.role_type}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/20 h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 pt-0">
        <p className="text-white/80 text-sm leading-relaxed line-clamp-2">
          {displayDescription}
        </p>
        
        <div className="flex flex-wrap gap-4 text-sm text-white/70">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-white/50" />
            <span>{displayLocation}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <DollarSign className="h-4 w-4 text-white/50" />
            <span>{displayCompensation}</span>
          </div>
          {opportunity.application_deadline && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-white/50" />
              <span>Deadline: {new Date(opportunity.application_deadline).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {displayGenres.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {displayGenres.map((genre) => (
              <Badge key={genre} variant="outline" className="text-xs border-white/20 text-white/60 bg-white/5">
                {genre}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center gap-1 text-xs text-white/50">
          <span>Source: {displaySource}</span>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center pt-4">
        <div className="text-xs text-white/50">
          Posted {new Date(opportunity.created_at).toLocaleDateString()}
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleViewDetails}
            className="border-white/30 bg-white/5 text-white hover:bg-white/20 hover:text-white hover:border-white/50 transition-all duration-200 font-medium"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            View Details
          </Button>
          <Button 
            size="sm"
            onClick={() => onQuickSubmit(opportunity.id)}
            className="bg-purple-600 hover:bg-purple-700 text-white transition-colors"
          >
            Quick Submit
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default OpportunityCard;
