
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface OpportunitiesHeaderProps {
  opportunitiesCount: number;
  onClearAll: () => void;
}

const OpportunitiesHeader = ({ opportunitiesCount, onClearAll }: OpportunitiesHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-white">Available Opportunities</h2>
        <p className="text-white/70">{opportunitiesCount} opportunities found</p>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
          {opportunitiesCount} Active
        </Badge>
        <Button
          onClick={onClearAll}
          variant="destructive"
          size="sm"
          className="bg-red-600 hover:bg-red-700"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>
    </div>
  );
};

export default OpportunitiesHeader;
