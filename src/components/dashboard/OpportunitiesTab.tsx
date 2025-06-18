
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Briefcase, Search, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { castingService } from "@/services/castingService";
import type { CastingOpportunity, RoleSubmission, AgentActivity } from "@/types/casting";
import AIRecommendations from "./AIRecommendations";
import OpportunitiesHeader from "./OpportunitiesHeader";
import OpportunityCard from "./OpportunityCard";
import SubmissionCard from "./SubmissionCard";
import AgentActivityCard from "./AgentActivityCard";
import "@/services/opportunityValidationService";

const OpportunitiesTab = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<CastingOpportunity[]>([]);
  const [submissions, setSubmissions] = useState<RoleSubmission[]>([]);
  const [agentActivity, setAgentActivity] = useState<AgentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, [refreshKey, user]);

  const loadData = async () => {
    try {
      console.log('Loading opportunities data...');
      setLoading(true);
      
      // Load opportunities first (these are public and don't require auth)
      const opportunitiesData = await castingService.getCastingOpportunities({ limit: 50 });
      console.log('Loaded opportunities:', opportunitiesData.length);
      
      // Try to load user-specific data only if user is authenticated
      let submissionsData: RoleSubmission[] = [];
      let activityData: AgentActivity[] = [];
      
      if (user) {
        try {
          console.log('Loading user submissions...');
          submissionsData = await castingService.getUserSubmissions();
          console.log('Loaded submissions:', submissionsData.length);
          setSubmissions(submissionsData);
        } catch (submissionError) {
          console.log('Could not load submissions:', submissionError);
          setSubmissions([]);
        }
        
        try {
          console.log('Loading agent activity...');
          activityData = await castingService.getUserAgentActivities(20);
          console.log('Loaded agent activities:', activityData.length);
          setAgentActivity(activityData);
        } catch (activityError) {
          console.log('Could not load agent activity:', activityError);
          setAgentActivity([]);
        }
      } else {
        setSubmissions([]);
        setAgentActivity([]);
      }
      
      // Filter out opportunities that have already been submitted to
      const submittedOpportunityIds = new Set(submissionsData.map(s => s.opportunity_id));
      const availableOpportunities = opportunitiesData.filter(opp => 
        !submittedOpportunityIds.has(opp.id)
      );
      
      console.log('Available opportunities after filtering:', availableOpportunities.length);
      setOpportunities(availableOpportunities);
      
    } catch (error) {
      console.error('Error loading opportunities data:', error);
      toast({
        title: "Error",
        description: "Failed to load opportunities data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleQuickSubmit = async (opportunityId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit applications",
        variant: "destructive"
      });
      return;
    }

    try {
      const submission = await castingService.createSubmission({
        user_id: '', // Will be set by the service
        opportunity_id: opportunityId,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        auto_submitted: false
      });

      toast({
        title: "Submission Successful",
        description: "Your application has been submitted successfully"
      });

      // Refresh data to update all lists
      refreshData();
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit your application",
        variant: "destructive"
      });
    }
  };

  const handleRemoveOpportunity = (opportunityId: string) => {
    // Remove the opportunity from the local state immediately for better UX
    setOpportunities(prev => prev.filter(opp => opp.id !== opportunityId));
  };

  // Function to refresh data - can be called when agent runs complete
  const refreshData = () => {
    console.log('Triggering data refresh...');
    setRefreshing(true);
    setRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-white">Loading opportunities...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <OpportunitiesHeader opportunitiesCount={opportunities.length} />
        <Button 
          onClick={refreshData}
          disabled={refreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      <Tabs defaultValue="ai-recommendations" className="w-full">
        <TabsList className="bg-white/5 border-white/10">
          <TabsTrigger value="ai-recommendations" className="data-[state=active]:bg-white/10">
            <Bot className="h-4 w-4 mr-2" />
            AI Recommendations
          </TabsTrigger>
          <TabsTrigger value="opportunities" className="data-[state=active]:bg-white/10">
            All Opportunities ({opportunities.length})
          </TabsTrigger>
          <TabsTrigger value="submissions" className="data-[state=active]:bg-white/10">
            My Submissions ({submissions.length})
          </TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-white/10">
            Agent Activity ({agentActivity.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai-recommendations" className="space-y-4">
          <div className="space-y-4">
            <AIRecommendations availableOpportunities={opportunities} />
            <div className="flex justify-center">
              <Button 
                onClick={refreshData}
                variant="outline"
                size="sm"
                disabled={refreshing}
              >
                <Bot className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4">
          {opportunities.length === 0 ? (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-8 text-center">
                <p className="text-white/70">No casting opportunities available at the moment.</p>
                <p className="text-white/50 text-sm mt-2">Check back later for new opportunities!</p>
                <Button 
                  onClick={refreshData}
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  disabled={refreshing}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh Opportunities
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {opportunities.map((opportunity) => (
                <OpportunityCard 
                  key={opportunity.id} 
                  opportunity={opportunity} 
                  onQuickSubmit={handleQuickSubmit}
                  onRemove={handleRemoveOpportunity}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          {!user ? (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-8 text-center">
                <p className="text-white/70">Please log in to view your submissions.</p>
              </CardContent>
            </Card>
          ) : submissions.length === 0 ? (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-8 text-center">
                <p className="text-white/70">You haven't submitted to any opportunities yet.</p>
                <p className="text-white/50 text-sm mt-2">Browse available opportunities to get started!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {submissions.map((submission) => (
                <SubmissionCard key={submission.id} submission={submission} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          {!user ? (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-8 text-center">
                <p className="text-white/70">Please log in to view agent activity.</p>
              </CardContent>
            </Card>
          ) : agentActivity.length === 0 ? (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-8 text-center">
                <p className="text-white/70">No agent activity yet.</p>
                <p className="text-white/50 text-sm mt-2">Your AI agent will show activity here once it starts working!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {agentActivity.map((activity) => (
                <AgentActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OpportunitiesTab;
