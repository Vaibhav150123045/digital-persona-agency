import { castingService } from './castingService';
import type { UserSubmissionPreferences, CastingOpportunity } from '@/types/casting';

export interface OpportunityMatch {
  opportunity: CastingOpportunity;
  match_score: number;
  reasoning: string;
  eligible_for_auto_submit: boolean;
}

export interface AgentRunResult {
  success: boolean;
  message: string;
  submissions_created?: number;
  opportunities_analyzed?: number;
}

export const autoSubmissionService = {
  async findMatchingOpportunities(preferences: UserSubmissionPreferences): Promise<OpportunityMatch[]> {
    try {
      console.log('Finding matching opportunities with preferences:', preferences);
      
      // Get all active opportunities
      const opportunities = await castingService.getCastingOpportunities({ status: 'active', limit: 50 });
      console.log('Found opportunities to analyze:', opportunities.length);
      
      if (opportunities.length === 0) {
        console.log('No opportunities available to match against');
        return [];
      }
      
      return this.scoreOpportunities(opportunities, preferences);
    } catch (error) {
      console.error('Error finding matching opportunities:', error);
      throw error;
    }
  },

  async findMatchingOpportunitiesFromList(preferences: UserSubmissionPreferences, opportunities: CastingOpportunity[]): Promise<OpportunityMatch[]> {
    try {
      console.log('Finding matching opportunities from provided list:', opportunities.length);
      
      if (opportunities.length === 0) {
        console.log('No opportunities provided to match against');
        return [];
      }
      
      return this.scoreOpportunities(opportunities, preferences);
    } catch (error) {
      console.error('Error finding matching opportunities from list:', error);
      throw error;
    }
  },

  scoreOpportunities(opportunities: CastingOpportunity[], preferences: UserSubmissionPreferences): OpportunityMatch[] {
    // Convert percentage to decimal for comparison
    const minMatchThreshold = preferences.min_match_score / 100;
    console.log('Minimum match threshold (decimal):', minMatchThreshold);
    console.log('Auto submit enabled:', preferences.auto_submit_enabled);
    
    // Basic filtering and scoring
    const matches: OpportunityMatch[] = opportunities.map(opportunity => {
      let score = 0.5; // Base score
      let reasoning = "Basic compatibility analysis: ";
      const reasons = [];
      
      // Role type matching
      if (preferences.preferred_role_types?.includes(opportunity.role_type)) {
        score += 0.2;
        reasons.push("matches preferred role type");
      }
      
      // Genre matching
      if (preferences.preferred_genres?.length && opportunity.genres?.length) {
        const genreMatches = opportunity.genres.some(genre => 
          preferences.preferred_genres!.includes(genre)
        );
        if (genreMatches) {
          score += 0.2;
          reasons.push("matches preferred genres");
        }
      }
      
      // Adult content filtering
      if (preferences.exclude_adult_content && opportunity.genres?.some(genre => 
        genre.toLowerCase().includes('adult') || genre.toLowerCase().includes('mature')
      )) {
        score -= 0.3;
        reasons.push("contains adult content (excluded)");
      }
      
      // Location consideration (basic)
      if (opportunity.location && opportunity.location.toLowerCase().includes('los angeles')) {
        score += 0.1;
        reasons.push("favorable location");
      }
      
      // Ensure score is between 0 and 1
      score = Math.max(0, Math.min(1, score));
      
      if (reasons.length === 0) {
        reasons.push("general compatibility");
      }
      
      reasoning += reasons.join(", ");
      
      // Fix floating-point comparison with epsilon tolerance
      const EPSILON = 0.000001;
      const scoreCheck = (score + EPSILON) >= minMatchThreshold;
      const autoSubmitCheck = preferences.auto_submit_enabled;
      
      console.log(`Detailed check for "${opportunity.title}":`, {
        score: score,
        threshold: minMatchThreshold,
        scoreCheck,
        autoSubmitEnabled: autoSubmitCheck,
        finalEligible: autoSubmitCheck && scoreCheck,
        scoreExact: score.toFixed(10),
        thresholdExact: minMatchThreshold.toFixed(10),
        usesEpsilon: true
      });
      
      // Determine if eligible for auto-submission with epsilon-tolerant comparison
      const eligible_for_auto_submit = autoSubmitCheck && scoreCheck;
      
      return {
        opportunity,
        match_score: score,
        reasoning,
        eligible_for_auto_submit
      };
    });
    
    // Sort by match score (highest first)
    matches.sort((a, b) => b.match_score - a.match_score);
    
    console.log('Generated matches:', matches.length, 'eligible for auto-submit:', 
      matches.filter(m => m.eligible_for_auto_submit).length);
    
    return matches;
  },

  async runAgentCycle(): Promise<AgentRunResult> {
    try {
      console.log('Starting agent cycle...');
      
      // Get user preferences
      const preferences = await castingService.getUserPreferences();
      if (!preferences) {
        return {
          success: false,
          message: "No user preferences found. Please configure your preferences first."
        };
      }
      
      if (!preferences.auto_submit_enabled) {
        return {
          success: false,
          message: "Auto-submission is disabled. Enable it in your preferences to use the agent."
        };
      }
      
      // Find matching opportunities
      const matches = await this.findMatchingOpportunities(preferences);
      const eligibleMatches = matches.filter(m => m.eligible_for_auto_submit);
      
      if (eligibleMatches.length === 0) {
        return {
          success: true,
          message: `Analyzed ${matches.length} opportunities, but none meet your auto-submission criteria (${preferences.min_match_score}% minimum match).`,
          opportunities_analyzed: matches.length,
          submissions_created: 0
        };
      }
      
      // Get existing submissions to avoid duplicates
      let existingSubmissions = [];
      try {
        existingSubmissions = await castingService.getUserSubmissions();
      } catch (error) {
        console.log('Could not load existing submissions:', error);
        // Continue without duplicate checking if user not authenticated
      }
      
      const submittedOpportunityIds = new Set(existingSubmissions.map(s => s.opportunity_id));
      
      // Filter out already submitted opportunities
      const newEligibleMatches = eligibleMatches.filter(match => 
        !submittedOpportunityIds.has(match.opportunity.id)
      );
      
      if (newEligibleMatches.length === 0) {
        return {
          success: true,
          message: `Found ${eligibleMatches.length} eligible opportunities, but you've already submitted to all of them.`,
          opportunities_analyzed: matches.length,
          submissions_created: 0
        };
      }
      
      // Create submissions for eligible matches
      let submissionsCreated = 0;
      const errors = [];
      
      for (const match of newEligibleMatches) {
        try {
          await castingService.createSubmission({
            user_id: '', // Will be set by the service
            opportunity_id: match.opportunity.id,
            status: 'submitted',
            submitted_at: new Date().toISOString(),
            auto_submitted: true,
            ai_match_score: match.match_score,
            ai_reasoning: match.reasoning
          });
          
          submissionsCreated++;
          
          // Log agent activity
          try {
            await castingService.createAgentActivity({
              activity_type: 'auto_submission',
              opportunity_id: match.opportunity.id,
              details: {
                match_score: match.match_score,
                reasoning: match.reasoning
              }
            });
          } catch (activityError) {
            console.log('Could not log agent activity:', activityError);
            // Continue even if activity logging fails
          }
          
        } catch (error) {
          console.error('Error creating submission:', error);
          errors.push(error);
        }
      }
      
      if (submissionsCreated === 0 && errors.length > 0) {
        return {
          success: false,
          message: "Failed to create any submissions. You may need to be logged in.",
          opportunities_analyzed: matches.length
        };
      }
      
      return {
        success: true,
        message: `Successfully submitted to ${submissionsCreated} opportunities out of ${newEligibleMatches.length} eligible matches.`,
        opportunities_analyzed: matches.length,
        submissions_created: submissionsCreated
      };
      
    } catch (error) {
      console.error('Error in agent cycle:', error);
      return {
        success: false,
        message: "Agent run failed. Please check your authentication and try again."
      };
    }
  }
};
