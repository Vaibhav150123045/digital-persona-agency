
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Kanban, Plus, Calendar, MapPin, DollarSign } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { castingService } from "@/services/castingService";
import type { RoleSubmission } from "@/types/casting";

interface AuditionCard {
  id: string;
  title: string;
  role: string;
  platform: string;
  deadline: string;
  location: string;
  rate: string;
  type: string;
  stage: "draft" | "submitted" | "viewed" | "audition" | "booked";
  submission?: RoleSubmission;
}

const KanbanBoard = () => {
  const { user } = useAuth();
  const [auditions, setAuditions] = useState<AuditionCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSubmissions();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadSubmissions = async () => {
    try {
      const submissions = await castingService.getUserSubmissions();
      
      const auditionCards: AuditionCard[] = submissions.map(submission => {
        const opportunity = submission.opportunity;
        if (!opportunity) return null;

        // Map submission status to kanban stage
        let stage: AuditionCard['stage'] = 'submitted';
        if (submission.status === 'viewed') stage = 'viewed';
        else if (submission.status === 'callback') stage = 'audition';
        else if (submission.status === 'booked') stage = 'booked';

        return {
          id: submission.id,
          title: opportunity.title,
          role: opportunity.role_type,
          platform: opportunity.source_platform || 'Unknown',
          deadline: opportunity.application_deadline 
            ? new Date(opportunity.application_deadline).toLocaleDateString()
            : 'No deadline',
          location: opportunity.location || 'Location TBD',
          rate: opportunity.compensation_range || 'Rate TBD',
          type: submission.auto_submitted ? 'Auto-Submitted' : 'Manual',
          stage,
          submission
        };
      }).filter(Boolean) as AuditionCard[];

      setAuditions(auditionCards);
    } catch (error) {
      console.error('Error loading submissions:', error);
      setAuditions([]);
    } finally {
      setLoading(false);
    }
  };

  const stages = [
    { id: "draft", title: "Draft", color: "border-gray-500" },
    { id: "submitted", title: "Submitted", color: "border-blue-500" },
    { id: "viewed", title: "Viewed", color: "border-yellow-500" },
    { id: "audition", title: "Audition", color: "border-purple-500" },
    { id: "booked", title: "Booked", color: "border-green-500" }
  ];

  const getAuditionsByStage = (stage: string) => {
    return auditions.filter(audition => audition.stage === stage);
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "netflix": return "text-red-400 border-red-400";
      case "hbo max": return "text-purple-400 border-purple-400";
      case "apple tv+": return "text-blue-400 border-blue-400";
      case "amazon prime": return "text-orange-400 border-orange-400";
      case "disney+": return "text-blue-300 border-blue-300";
      default: return "text-gray-400 border-gray-400";
    }
  };

  if (loading) {
    return (
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardContent className="p-8 text-center">
          <div className="text-white">Loading audition pipeline...</div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardContent className="p-8 text-center">
          <p className="text-white/70">Please log in to view your audition pipeline.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-white flex items-center">
            <Kanban className="h-5 w-5 mr-2" />
            Audition Pipeline
          </CardTitle>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Audition
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {auditions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-white/70">No submissions yet.</p>
            <p className="text-white/50 text-sm mt-2">Submit to opportunities to see them in your pipeline!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {stages.map((stage) => (
              <div key={stage.id} className="space-y-4">
                <div className={`border-t-2 ${stage.color} pt-2`}>
                  <h3 className="text-white font-medium text-center">{stage.title}</h3>
                  <p className="text-gray-400 text-sm text-center">
                    {getAuditionsByStage(stage.id).length} items
                  </p>
                </div>
                
                <div className="space-y-3 min-h-[400px]">
                  {getAuditionsByStage(stage.id).map((audition) => (
                    <Card key={audition.id} className="bg-white/10 border-white/20 cursor-pointer hover:bg-white/15 transition-colors">
                      <CardContent className="p-3">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <h4 className="text-white font-medium text-sm">{audition.title}</h4>
                            <Badge variant="outline" className={getPlatformColor(audition.platform)}>
                              {audition.platform}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-300 text-sm">{audition.role}</p>
                          
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                              <Calendar className="h-3 w-3" />
                              <span>{audition.deadline}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                              <MapPin className="h-3 w-3" />
                              <span>{audition.location}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                              <DollarSign className="h-3 w-3" />
                              <span>{audition.rate}</span>
                            </div>
                          </div>
                          
                          <Badge variant="outline" className="text-blue-300 border-blue-300 text-xs">
                            {audition.type}
                          </Badge>

                          {audition.submission?.ai_match_score && (
                            <Badge variant="outline" className="text-purple-300 border-purple-300 text-xs">
                              {Math.round(audition.submission.ai_match_score * 100)}% match
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {/* Drop zone placeholder */}
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center">
                    <p className="text-gray-500 text-sm">Drop here</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KanbanBoard;
