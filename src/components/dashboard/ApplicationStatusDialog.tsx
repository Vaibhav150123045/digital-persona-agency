
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { castingService } from "@/services/castingService";
import type { CastingOpportunity } from "@/types/casting";

interface ApplicationStatusDialogProps {
  opportunity: CastingOpportunity | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (opportunityId: string, applied: boolean) => void;
}

const ApplicationStatusDialog = ({ 
  opportunity, 
  isOpen, 
  onClose, 
  onStatusUpdate 
}: ApplicationStatusDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResponse = async (applied: boolean) => {
    if (!opportunity) return;

    setIsSubmitting(true);
    try {
      if (applied) {
        // Create a submission record
        await castingService.createSubmission({
          opportunity_id: opportunity.id,
          status: 'submitted',
          submitted_at: new Date().toISOString(),
          auto_submitted: false,
          notes: 'Manual application - user confirmed via dialog',
          user_id: '' // This will be set by the service
        });
        
        toast({
          title: "Application Recorded",
          description: "The opportunity has been moved to your submitted pipeline."
        });
      } else {
        // Just update the callback to move to bottom of queue
        toast({
          title: "Noted",
          description: "The opportunity has been moved to the bottom of your queue."
        });
      }
      
      onStatusUpdate(opportunity.id, applied);
      onClose();
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: "Error",
        description: "Failed to update application status. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!opportunity) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Did you apply to this role?
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{opportunity.title}</span>
            {opportunity.project_name && (
              <span className="block text-xs mt-1">{opportunity.project_name}</span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex gap-3 mt-6">
          <Button
            onClick={() => handleResponse(true)}
            disabled={isSubmitting}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            Yes, I Applied
          </Button>
          <Button
            onClick={() => handleResponse(false)}
            disabled={isSubmitting}
            variant="outline"
            className="flex-1"
          >
            No, I Didn't Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationStatusDialog;
