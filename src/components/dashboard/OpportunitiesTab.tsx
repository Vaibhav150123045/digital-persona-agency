
import { Card, CardContent } from "@/components/ui/card";
import ApplicationStatusDialog from "./ApplicationStatusDialog";
import { useApplicationStatusDialog } from "@/hooks/useApplicationStatusDialog";
import { useOpportunities } from "@/hooks/useOpportunities";
import { useOpportunityFilters } from "@/hooks/useOpportunityFilters";
import OpportunitiesHeader from "./OpportunitiesHeader";
import OpportunitiesList from "./OpportunitiesList";

const OpportunitiesTab = () => {
  const {
    opportunities,
    setOpportunities,
    loading,
    handleQuickSubmit,
    handleRemoveOpportunity,
    handleClearAllOpportunities
  } = useOpportunities();

  const { filteredOpportunities } = useOpportunityFilters(opportunities);
  const { dialogOpportunity, isDialogOpen, closeDialog } = useApplicationStatusDialog();

  const handleApplicationStatusUpdate = (opportunityId: string, applied: boolean) => {
    if (applied) {
      setOpportunities(prev => prev.filter(opp => opp.id !== opportunityId));
    } else {
      setOpportunities(prev => {
        const filtered = prev.filter(opp => opp.id !== opportunityId);
        const movedOpportunity = prev.find(opp => opp.id === opportunityId);
        return movedOpportunity ? [...filtered, movedOpportunity] : filtered;
      });
    }
  };

  const displayedOpportunitiesCount = filteredOpportunities.length;

  if (loading) {
    return (
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardContent className="p-8 text-center">
          <div className="text-white">Loading opportunities...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <OpportunitiesHeader
        opportunitiesCount={displayedOpportunitiesCount}
        onClearAll={handleClearAllOpportunities}
      />

      <OpportunitiesList
        opportunities={filteredOpportunities}
        onQuickSubmit={handleQuickSubmit}
        onRemove={handleRemoveOpportunity}
      />

      <ApplicationStatusDialog
        opportunity={dialogOpportunity}
        isOpen={isDialogOpen}
        onClose={closeDialog}
        onStatusUpdate={handleApplicationStatusUpdate}
      />
    </div>
  );
};

export default OpportunitiesTab;
