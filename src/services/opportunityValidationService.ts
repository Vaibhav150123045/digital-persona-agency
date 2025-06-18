
import { supabase } from "@/integrations/supabase/client";
import type { CastingOpportunity } from "@/types/casting";

export const opportunityValidationService = {
  async validateOpportunity(opportunity: CastingOpportunity): Promise<{
    isValid: boolean;
    issues: string[];
    score: number;
  }> {
    const issues: string[] = [];
    let score = 100;

    // Check required fields
    if (!opportunity.title || opportunity.title.length < 10) {
      issues.push("Title is too short or missing");
      score -= 20;
    }

    if (!opportunity.description || opportunity.description.length < 50) {
      issues.push("Description is too short or missing");
      score -= 15;
    }

    if (!opportunity.external_url) {
      issues.push("No external URL provided");
      score -= 25;
    } else {
      // Validate URL format
      try {
        new URL(opportunity.external_url);
      } catch {
        issues.push("Invalid URL format");
        score -= 20;
      }
    }

    if (!opportunity.location) {
      issues.push("Location not specified");
      score -= 10;
    }

    if (!opportunity.role_type || !['lead', 'supporting', 'background'].includes(opportunity.role_type)) {
      issues.push("Invalid or missing role type");
      score -= 15;
    }

    // Check for suspicious content
    if (this.containsSuspiciousContent(opportunity)) {
      issues.push("Contains suspicious content patterns");
      score -= 30;
    }

    const isValid = score >= 60; // Minimum 60% score to be considered valid

    return {
      isValid,
      issues,
      score
    };
  },

  containsSuspiciousContent(opportunity: CastingOpportunity): boolean {
    const suspiciousPatterns = [
      /click here/i,
      /download now/i,
      /free money/i,
      /work from home/i,
      /make \$\d+/i,
      /guaranteed/i,
      /no experience required/i,
      /urgent/i,
      /limited time/i
    ];

    const textToCheck = [
      opportunity.title,
      opportunity.description,
      opportunity.requirements
    ].join(' ').toLowerCase();

    return suspiciousPatterns.some(pattern => pattern.test(textToCheck));
  },

  async testSubmissionFlow(opportunityId: string): Promise<{
    canSubmit: boolean;
    error?: string;
  }> {
    try {
      // Test if we can create a submission (without actually saving it)
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { canSubmit: false, error: "User not authenticated" };
      }

      // Check if opportunity exists and is active
      const { data: opportunity, error } = await supabase
        .from('casting_opportunities')
        .select('id, status, external_url')
        .eq('id', opportunityId)
        .eq('status', 'active')
        .single();

      if (error || !opportunity) {
        return { canSubmit: false, error: "Opportunity not found or inactive" };
      }

      // Check if user hasn't already submitted
      const { data: existingSubmission } = await supabase
        .from('role_submissions')
        .select('id')
        .eq('opportunity_id', opportunityId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingSubmission) {
        return { canSubmit: false, error: "Already submitted to this opportunity" };
      }

      return { canSubmit: true };
    } catch (error) {
      console.error('Error testing submission flow:', error);
      return { canSubmit: false, error: "Failed to test submission flow" };
    }
  }
};

// Expose test functions globally for console testing
if (typeof window !== 'undefined') {
  (window as any).testOpportunitySubmission = async (opportunityId: string) => {
    console.log(`Testing submission for opportunity: ${opportunityId}`);
    const result = await opportunityValidationService.testSubmissionFlow(opportunityId);
    console.log('Submission test result:', result);
    return result;
  };

  (window as any).getAllOpportunityIds = async () => {
    const { data: opportunities, error } = await supabase
      .from('casting_opportunities')
      .select('id, title')
      .eq('status', 'active')
      .limit(10);
    
    if (error) {
      console.error('Error fetching opportunities:', error);
      return [];
    }
    
    console.log('Available opportunities for testing:');
    opportunities?.forEach(opp => {
      console.log(`- ${opp.id}: ${opp.title}`);
    });
    
    return opportunities?.map(opp => opp.id) || [];
  };
}
