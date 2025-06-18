
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Play, Search, Settings } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { jobScrapingService } from "@/services/jobScrapingService";
import type { UserSubmissionPreferences } from "@/types/casting";

interface AIAgentControlPanelProps {
  preferences: UserSubmissionPreferences;
  autoEligibleCount: number;
  running: boolean;
  onRunAgent: () => void;
}

const AIAgentControlPanel = ({ 
  preferences, 
  autoEligibleCount, 
  running, 
  onRunAgent 
}: AIAgentControlPanelProps) => {
  const [scraping, setScraping] = useState(false);
  const { toast } = useToast();

  const handleRunScraping = async () => {
    setScraping(true);
    try {
      console.log('Starting manual job scraping...');
      
      const websites = [
        "https://www.backstage.com/casting/",
        "https://www.spotlight.com/actors/auditions",
        "https://www.castingnetworks.com/auditions"
      ];

      const result = await jobScrapingService.scrapeActingJobs({
        websites,
        searchTerms: ["film", "tv", "commercial", "theater", "lead", "supporting"]
      });

      console.log('Scraping result:', result);

      toast({
        title: result.success ? "Scraping Complete" : "Scraping Failed",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });

      if (result.success && result.newJobs > 0) {
        // Refresh the page to show new opportunities
        window.location.reload();
      }
    } catch (error) {
      console.error('Error running scraping:', error);
      toast({
        title: "Scraping Error",
        description: "Failed to run job scraping",
        variant: "destructive"
      });
    } finally {
      setScraping(false);
    }
  };

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Bot className="h-5 w-5" />
          AI Agent Control Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-white/70">Auto Submit:</span>
            <Badge 
              variant={preferences.auto_submit_enabled ? "default" : "secondary"}
              className="ml-2"
            >
              {preferences.auto_submit_enabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
          <div>
            <span className="text-white/70">Min Match Score:</span>
            <span className="text-white ml-2">{(preferences.min_match_score * 100).toFixed(0)}%</span>
          </div>
          <div>
            <span className="text-white/70">Auto Eligible:</span>
            <Badge className="ml-2 bg-green-500/20 text-green-300">
              {autoEligibleCount} opportunities
            </Badge>
          </div>
          <div>
            <span className="text-white/70">Status:</span>
            <span className="text-white ml-2">{running ? "Running..." : "Ready"}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={onRunAgent}
            disabled={running}
            className="flex-1"
          >
            <Play className="h-4 w-4 mr-2" />
            {running ? "Running Agent..." : "Run AI Agent"}
          </Button>
          
          <Button 
            onClick={handleRunScraping}
            disabled={scraping}
            variant="outline"
            className="flex-1"
          >
            <Search className="h-4 w-4 mr-2" />
            {scraping ? "Scraping..." : "Run Job Scraping"}
          </Button>
        </div>

        {preferences.auto_submit_enabled && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-md">
            <p className="text-amber-300 text-sm">
              ⚠️ Auto-submission is enabled. The agent will automatically apply to {autoEligibleCount} matching opportunities.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAgentControlPanel;
