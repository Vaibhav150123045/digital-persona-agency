
import { Button } from "@/components/ui/button";
import { Settings, Filter } from "lucide-react";
import { PreferencesDialog } from "@/components/preferences";

interface OpportunitiesHeaderProps {
  opportunitiesCount: number;
}

const OpportunitiesHeader = ({ opportunitiesCount }: OpportunitiesHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-white">Casting Opportunities</h2>
        <p className="text-white/70">Discover and apply to roles that match your profile</p>
      </div>
      <div className="flex space-x-2">
        <PreferencesDialog 
          trigger={
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Preferences
            </Button>
          } 
        />
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>
    </div>
  );
};

export default OpportunitiesHeader;
