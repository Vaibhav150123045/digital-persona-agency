
import { Card, CardContent } from "@/components/ui/card";
import { Bot } from "lucide-react";
import type { AgentActivity } from "@/types/casting";

interface AgentActivityCardProps {
  activity: AgentActivity;
}

const AgentActivityCard = ({ activity }: AgentActivityCardProps) => {
  return (
    <Card className="bg-white/5 border-white/10">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Bot className="h-5 w-5 text-purple-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-white font-medium">{activity.activity_type}</p>
            {activity.opportunity && (
              <p className="text-white/70 text-sm">Related to: {activity.opportunity.title}</p>
            )}
            {activity.details && (
              <div className="text-white/60 text-xs mt-1">
                {typeof activity.details === 'object' ? (
                  <pre className="whitespace-pre-wrap font-mono">
                    {JSON.stringify(activity.details, null, 2)}
                  </pre>
                ) : (
                  <span>{activity.details}</span>
                )}
              </div>
            )}
            <p className="text-white/50 text-xs mt-1">
              {new Date(activity.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentActivityCard;
