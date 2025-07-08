
import OpportunityCard from "./OpportunityCard";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import type { CastingOpportunity } from "@/types/casting";

interface OpportunitiesListProps {
  opportunities: CastingOpportunity[];
  onQuickSubmit: (opportunityId: string) => void;
  onRemove: (opportunityId: string) => void;
}

const OpportunitiesList = ({ opportunities, onQuickSubmit, onRemove }: OpportunitiesListProps) => {
  if (opportunities.length === 0) {
    return (
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <Search className="h-12 w-12 text-white/30" />
            <div className="text-white/70">No casting opportunities found</div>
            <p className="text-white/50 text-sm">
              New opportunities will appear here when they become available.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {opportunities.map((opportunity) => (
        <OpportunityCard
          key={opportunity.id}
          opportunity={opportunity}
          onQuickSubmit={onQuickSubmit}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default OpportunitiesList;
