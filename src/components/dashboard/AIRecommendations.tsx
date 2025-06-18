
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { autoSubmissionService, OpportunityMatch } from "@/services/autoSubmissionService";
import { castingService } from "@/services/castingService";
import AIAgentControlPanel from "./AIAgentControlPanel";
import AIRecommendationsList from "./AIRecommendationsList";
import type { UserSubmissionPreferences, CastingOpportunity } from "@/types/casting";

interface AIRecommendationsProps {
  availableOpportunities?: CastingOpportunity[];
}

const AIRecommendations = ({ availableOpportunities }: AIRecommendationsProps) => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<OpportunityMatch[]>([]);
  const [preferences, setPreferences] = useState<UserSubmissionPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user && availableOpportunities) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [user, availableOpportunities]);

  const loadData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      console.log('Loading AI recommendations data...');
      
      const prefsData = await castingService.getUserPreferences();
      console.log('User preferences:', prefsData);
      
      setPreferences(prefsData);
      
      if (prefsData && availableOpportunities && availableOpportunities.length > 0) {
        console.log('Finding matching opportunities from available list:', availableOpportunities.length);
        const matchesData = await autoSubmissionService.findMatchingOpportunitiesFromList(prefsData, availableOpportunities);
        console.log('Found matches:', matchesData);
        setMatches(matchesData.slice(0, 10));
      } else {
        console.log('No preferences or available opportunities found');
        setMatches([]);
      }
    } catch (error) {
      console.error('Error loading AI recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to load AI recommendations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const runAgent = async () => {
    if (!user) return;
    
    setRunning(true);
    try {
      console.log('Running AI agent...');
      const result = await autoSubmissionService.runAgentCycle();
      
      toast({
        title: result.success ? "Agent Run Complete" : "Agent Run Failed",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });

      if (result.success) {
        await loadData();
      }
    } catch (error) {
      console.error('Error running agent:', error);
      toast({
        title: "Error",
        description: "Failed to run AI agent",
        variant: "destructive"
      });
    } finally {
      setRunning(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-8 text-center">
          <div className="text-white">Loading AI recommendations...</div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-8 text-center">
          <p className="text-white/70">Please log in to view AI recommendations.</p>
        </CardContent>
      </Card>
    );
  }

  if (!preferences) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-8 text-center">
          <p className="text-white/70">Please configure your preferences to see AI recommendations.</p>
        </CardContent>
      </Card>
    );
  }

  const autoEligibleCount = matches.filter(m => m.eligible_for_auto_submit).length;

  return (
    <div className="space-y-6">
      <AIAgentControlPanel
        preferences={preferences}
        autoEligibleCount={autoEligibleCount}
        running={running}
        onRunAgent={runAgent}
      />

      <AIRecommendationsList 
        matches={matches}
        autoEligibleCount={autoEligibleCount}
      />
    </div>
  );
};

export default AIRecommendations;
