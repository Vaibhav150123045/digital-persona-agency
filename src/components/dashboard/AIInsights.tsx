
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface AIInsightsProps {
  displayProfile: any;
}

const AIInsights = ({ displayProfile }: AIInsightsProps) => {
  const [insights, setInsights] = useState<{
    marketTrend: { title: string; description: string };
    recommendation: { title: string; description: string };
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const generateInsights = async () => {
    if (!displayProfile || loading) return;
    
    setLoading(true);
    
    try {
      console.log('Generating AI insights for profile:', displayProfile.name);
      
      const { data, error } = await supabase.functions.invoke('ai-insights', {
        body: {
          displayProfile: {
            name: displayProfile.name,
            role: displayProfile.role,
            location: displayProfile.location,
            actorType: displayProfile.actorType || 'General',
            favoriteGenres: displayProfile.favoriteGenres || [],
            isNewUser: displayProfile.isNewUser
          }
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        setInsights(getDefaultInsights(displayProfile.isNewUser));
      } else if (data?.insights) {
        console.log('AI insights received:', data.insights);
        setInsights(data.insights);
      } else {
        console.log('No insights data, using fallback');
        setInsights(getDefaultInsights(displayProfile.isNewUser));
      }
    } catch (error) {
      console.error('Error generating AI insights:', error);
      setInsights(getDefaultInsights(displayProfile.isNewUser));
    } finally {
      setLoading(false);
    }
  };

  const getDefaultInsights = (isNewUser: boolean) => {
    if (isNewUser) {
      return {
        marketTrend: {
          title: "Industry Growing",
          description: "Streaming platforms increasing casting by 15% this quarter"
        },
        recommendation: {
          title: "Build Your Portfolio",
          description: "Create a professional headshot and demo reel first"
        }
      };
    } else {
      return {
        marketTrend: {
          title: "Drama Series Rising",
          description: "Period dramas and thrillers seeing 30% more castings"
        },
        recommendation: {
          title: "Network Actively",
          description: "Attend industry mixers and connect with casting directors"
        }
      };
    }
  };

  // Always show default insights initially - never auto-generate
  useEffect(() => {
    if (displayProfile) {
      setInsights(getDefaultInsights(displayProfile.isNewUser));
    }
  }, [displayProfile]);

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
            AI Insights
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={generateInsights}
            disabled={loading}
            className="text-white/70 hover:text-white h-8 w-8 p-0"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights ? (
          <>
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <div className="text-green-400 font-medium text-sm">{insights.marketTrend.title}</div>
              <div className="text-white text-sm">{insights.marketTrend.description}</div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <div className="text-blue-400 font-medium text-sm">{insights.recommendation.title}</div>
              <div className="text-white text-sm">{insights.recommendation.description}</div>
            </div>
          </>
        ) : (
          <div className="text-white/70 text-sm text-center py-4">
            Loading AI insights...
          </div>
        )}
        <div className="text-xs text-white/50 mt-2">
          Click the refresh button to get personalized AI insights
        </div>
      </CardContent>
    </Card>
  );
};

const getDefaultInsights = (isNewUser: boolean) => {
  if (isNewUser) {
    return {
      marketTrend: {
        title: "Industry Growing",
        description: "Streaming platforms increasing casting by 15% this quarter"
      },
      recommendation: {
        title: "Build Your Portfolio",
        description: "Create a professional headshot and demo reel first"
      }
    };
  } else {
    return {
      marketTrend: {
        title: "Drama Series Rising",
        description: "Period dramas and thrillers seeing 30% more castings"
      },
      recommendation: {
        title: "Network Actively",
        description: "Attend industry mixers and connect with casting directors"
      }
    };
  }
};

export default AIInsights;
