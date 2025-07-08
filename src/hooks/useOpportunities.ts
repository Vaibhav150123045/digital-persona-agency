
import { useState, useEffect } from "react";
import { castingService } from "@/services/castingService";
import { userOpportunityService } from "@/services/userOpportunityService";
import { useToast } from "@/components/ui/use-toast";
import type { CastingOpportunity } from "@/types/casting";

export const useOpportunities = () => {
  const [opportunities, setOpportunities] = useState<CastingOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadOpportunities = async () => {
    try {
      setLoading(true);
      console.log('Loading opportunities...');
      
      const data = await castingService.getCastingOpportunities();
      console.log('Opportunities loaded via service:', data?.length || 0);
      setOpportunities(data);
    } catch (error) {
      console.error('Error loading opportunities:', error);
      toast({
        title: "Error",
        description: "Failed to load casting opportunities",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSubmit = async (opportunityId: string) => {
    try {
      await castingService.createSubmission({
        opportunity_id: opportunityId,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        auto_submitted: false,
        user_id: ''
      });
      
      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully"
      });
      
      setOpportunities(prev => prev.filter(opp => opp.id !== opportunityId));
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: "Failed to submit application",
        variant: "destructive"
      });
    }
  };

  const handleRemoveOpportunity = async (opportunityId: string) => {
    try {
      const result = await userOpportunityService.dismissOpportunity(opportunityId);
      
      if (result.success) {
        setOpportunities(prev => prev.filter(opp => opp.id !== opportunityId));
        toast({
          title: "Opportunity Dismissed",
          description: "This opportunity has been removed from your list"
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      console.error('Error dismissing opportunity:', error);
      toast({
        title: "Error",
        description: `Failed to dismiss opportunity: ${error?.message || 'Unknown error'}`,
        variant: "destructive"
      });
    }
  };

  const handleClearAllOpportunities = async () => {
    try {
      setLoading(true);
      console.log('Starting to dismiss all opportunities for user...');
      
      const result = await userOpportunityService.dismissAllActiveOpportunities();
      
      if (result.success) {
        console.log('Successfully dismissed opportunities:', result.dismissedCount);
        setOpportunities([]);
        
        toast({
          title: "Opportunities Cleared",
          description: result.message
        });
      } else {
        throw new Error(result.message);
      }
      
    } catch (error: any) {
      console.error('Error clearing opportunities:', error);
      
      toast({
        title: "Error",
        description: `Failed to clear opportunities: ${error?.message || 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOpportunities();
  }, []);

  return {
    opportunities,
    setOpportunities,
    loading,
    handleQuickSubmit,
    handleRemoveOpportunity,
    handleClearAllOpportunities,
    loadOpportunities
  };
};
