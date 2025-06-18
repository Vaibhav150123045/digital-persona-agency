
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Bot } from "lucide-react";
import type { RoleSubmission } from "@/types/casting";

interface SubmissionCardProps {
  submission: RoleSubmission;
}

const SubmissionCard = ({ submission }: SubmissionCardProps) => {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'booked':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'callback':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-white">{submission.opportunity?.title || 'Opportunity'}</CardTitle>
            {submission.opportunity?.project_name && (
              <CardDescription className="text-white/70">{submission.opportunity.project_name}</CardDescription>
            )}
          </div>
          <Badge 
            variant={submission.status === 'booked' ? 'default' : 'secondary'}
            className={getStatusBadgeClass(submission.status)}
          >
            {submission.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2">
        <div className="flex flex-wrap gap-3 text-sm text-white/70">
          <div className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            Submitted: {submission.submitted_at ? new Date(submission.submitted_at).toLocaleDateString() : 'N/A'}
          </div>
          {submission.auto_submitted && (
            <div className="flex items-center gap-1">
              <Bot className="h-4 w-4" />
              Auto-submitted
            </div>
          )}
          {submission.ai_match_score && (
            <div className="text-purple-300">
              AI Match: {Math.round(submission.ai_match_score * 100)}%
            </div>
          )}
        </div>
        
        {submission.notes && (
          <p className="text-white/80 text-sm">{submission.notes}</p>
        )}
      </CardContent>

      <CardFooter>
        <div className="text-xs text-white/50">
          Last updated {new Date(submission.updated_at).toLocaleDateString()}
        </div>
      </CardFooter>
    </Card>
  );
};

export default SubmissionCard;
