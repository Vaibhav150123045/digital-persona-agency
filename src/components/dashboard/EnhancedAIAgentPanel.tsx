
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Bot, Brain, Search, Zap, Activity, Settings, RefreshCw } from "lucide-react";
import { enhancedJobScrapingService } from "@/services/enhancedJobScrapingService";
import { useAuth } from "@/contexts/AuthContext";

const EnhancedAIAgentPanel = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);
  const [agentStatus, setAgentStatus] = useState<'idle' | 'processing' | 'analyzing' | 'applying'>('idle');
  const [progress, setProgress] = useState(0);

  const runEnhancedScraping = async () => {
    setIsScraping(true);
    setProgress(0);
    
    try {
      console.log('Starting enhanced scraping process...');
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const result = await enhancedJobScrapingService.scrapeAndProcessOpportunities();
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setLastResult(result);
      
      toast({
        title: result.success ? "Enhanced Scraping Complete!" : "Scraping Failed",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });

      if (result.success && result.processed_opportunities > 0) {
        // Auto-refresh page to show new opportunities
        setTimeout(() => window.location.reload(), 2000);
      }
      
    } catch (error) {
      console.error('Enhanced scraping error:', error);
      toast({
        title: "Scraping Error",
        description: "Failed to complete enhanced scraping process",
        variant: "destructive"
      });
    } finally {
      setIsScraping(false);
      setProgress(0);
    }
  };

  const runAutonomousAgent = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to run the autonomous agent",
        variant: "destructive"
      });
      return;
    }

    setIsRunning(true);
    setAgentStatus('analyzing');
    
    try {
      console.log('Running autonomous agent...');
      
      const result = await enhancedJobScrapingService.runAutonomousAgent(user.id);
      
      setAgentStatus('idle');
      
      toast({
        title: result.success ? "Agent Run Complete!" : "Agent Run Failed",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });

      // Show detailed results
      if (result.success && result.applications_created > 0) {
        toast({
          title: "Applications Created!",
          description: `Your AI agent created ${result.applications_created} applications automatically`,
        });
      }
      
    } catch (error) {
      console.error('Autonomous agent error:', error);
      setAgentStatus('idle');
      toast({
        title: "Agent Error",
        description: "Failed to run autonomous agent",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'bg-blue-500';
      case 'analyzing': return 'bg-purple-500';
      case 'applying': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'processing': return 'Processing Opportunities';
      case 'analyzing': return 'Analyzing Matches';
      case 'applying': return 'Creating Applications';
      default: return 'Ready';
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Control Panel */}
      <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <Bot className="h-6 w-6 text-purple-400" />
            Enhanced AI Agent
            <Badge className={`${getStatusColor(agentStatus)} text-white`}>
              {getStatusText(agentStatus)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Agent Status */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">🤖</div>
              <div className="text-sm text-white/70">AI Agent</div>
              <div className="text-xs text-white/50">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">🧠</div>
              <div className="text-sm text-white/70">Smart Analysis</div>
              <div className="text-xs text-white/50">OpenAI Powered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">⚡</div>
              <div className="text-sm text-white/70">Auto Apply</div>
              <div className="text-xs text-white/50">Enabled</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">📈</div>
              <div className="text-sm text-white/70">Success Rate</div>
              <div className="text-xs text-white/50">Learning</div>
            </div>
          </div>

          {/* Progress Bar */}
          {(isScraping || isRunning) && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white/70">
                <span>
                  {isScraping ? "Scraping & Processing..." : "Running Agent..."}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={runEnhancedScraping}
              disabled={isScraping || isRunning}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              size="lg"
            >
              {isScraping ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Scraping & Processing...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Find New Opportunities
                </>
              )}
            </Button>

            <Button
              onClick={runAutonomousAgent}
              disabled={isScraping || isRunning || !user}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              size="lg"
            >
              {isRunning ? (
                <>
                  <Bot className="h-4 w-4 mr-2 animate-pulse" />
                  Agent Running...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Run Autonomous Agent
                </>
              )}
            </Button>
          </div>

          {/* Last Result */}
          {lastResult && (
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Last Scraping Result
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-blue-400">
                    {lastResult.raw_opportunities_found}
                  </div>
                  <div className="text-xs text-white/60">Found</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-purple-400">
                    {lastResult.processed_opportunities}
                  </div>
                  <div className="text-xs text-white/60">AI Processed</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-green-400">
                    {lastResult.confidence_scores?.high || 0}
                  </div>
                  <div className="text-xs text-white/60">High Quality</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-orange-400">
                    {lastResult.new_opportunities}
                  </div>
                  <div className="text-xs text-white/60">New</div>
                </div>
              </div>
              <p className="text-white/70 text-sm mt-3">{lastResult.message}</p>
            </div>
          )}

          {/* Features List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h5 className="text-white font-medium flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-400" />
                AI Capabilities
              </h5>
              <ul className="text-white/70 space-y-1">
                <li>• Smart opportunity analysis</li>
                <li>• Personalized cover letters</li>
                <li>• Intelligent match scoring</li>
                <li>• Market trend analysis</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h5 className="text-white font-medium flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-400" />
                Automation Features
              </h5>
              <ul className="text-white/70 space-y-1">
                <li>• Autonomous job scraping</li>
                <li>• Auto-application creation</li>
                <li>• Real-time monitoring</li>
                <li>• Performance tracking</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAIAgentPanel;
