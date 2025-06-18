
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign, Clock, Trash2 } from "lucide-react";
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

  return (
    <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-white">{opportunity.title}</CardTitle>
            {opportunity.project_name && (
              <CardDescription className="text-white/70">{opportunity.project_name}</CardDescription>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              {opportunity.role_type}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {opportunity.description && (
          <p className="text-white/80 text-sm line-clamp-2">{opportunity.description}</p>
        )}
        
        <div className="flex flex-wrap gap-3 text-sm text-white/70">
          {opportunity.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {opportunity.location}
            </div>
          )}
          {opportunity.compensation_range && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              {opportunity.compensation_range}
            </div>
          )}
          {opportunity.application_deadline && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Deadline: {new Date(opportunity.application_deadline).toLocaleDateString()}
            </div>
          )}
        </div>

        {opportunity.genres && opportunity.genres.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {opportunity.genres.map((genre) => (
              <Badge key={genre} variant="outline" className="text-xs border-white/20 text-white/70">
                {genre}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <div className="text-xs text-white/50">
          Posted {new Date(opportunity.created_at).toLocaleDateString()}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            View Details
          </Button>
          <Button 
            size="sm"
            onClick={() => onQuickSubmit(opportunity.id)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Quick Submit
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default OpportunityCard;
