
import { supabase } from "@/integrations/supabase/client";
import { jobScrapingService } from "./jobScrapingService";

export interface EnhancedScrapeResult {
  success: boolean;
  message: string;
  raw_opportunities_found: number;
  processed_opportunities: number;
  new_opportunities: number;
  failed_processing: number;
  confidence_scores: {
    high: number;
    medium: number;
    low: number;
  };
}

export const enhancedJobScrapingService = {
  async scrapeAndProcessOpportunities(): Promise<EnhancedScrapeResult> {
    try {
      console.log('Starting enhanced job scraping and processing...');
      
      // Step 1: Run traditional scraping
      const scrapeResult = await jobScrapingService.scrapeActingJobs({
        websites: [
          "https://www.backstage.com/casting/",
          "https://www.spotlight.com/actors/auditions",
          "https://www.castingnetworks.com/auditions",
          "https://actorsaccess.com/auditions"
        ],
        searchTerms: ["film", "tv", "commercial", "theater", "lead", "supporting", "principal"]
      });

      if (!scrapeResult.success) {
        throw new Error(scrapeResult.message);
      }

      // Step 2: Get newly scraped opportunities (those without AI processing)
      const { data: unprocessedOpportunities, error } = await supabase
        .from('casting_opportunities')
        .select(`
          *,
          opportunity_intelligence!left(id)
        `)
        .is('opportunity_intelligence.id', null)
        .eq('status', 'active')
        .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Last hour
        .limit(20);

      if (error) {
        throw new Error(`Error fetching unprocessed opportunities: ${error.message}`);
      }

      console.log(`Found ${unprocessedOpportunities?.length || 0} unprocessed opportunities`);

      if (!unprocessedOpportunities || unprocessedOpportunities.length === 0) {
        return {
          success: true,
          message: "No new opportunities to process",
          raw_opportunities_found: scrapeResult.totalFound,
          processed_opportunities: 0,
          new_opportunities: scrapeResult.newJobs,
          failed_processing: 0,
          confidence_scores: { high: 0, medium: 0, low: 0 }
        };
      }

      // Step 3: Process with AI
      const opportunitiesForAI = unprocessedOpportunities.map(opp => ({
        title: opp.title,
        description: opp.description,
        requirements: opp.requirements,
        location: opp.location,
        compensation_range: opp.compensation_range,
        source_url: opp.external_url || '',
        raw_content: `${opp.title} ${opp.description || ''} ${opp.requirements || ''}`.substring(0, 2000)
      }));

      const { data: processResult, error: processError } = await supabase.functions.invoke(
        'intelligent-opportunity-processor',
        {
          body: { opportunities: opportunitiesForAI }
        }
      );

      if (processError) {
        console.error('AI processing error:', processError);
        throw new Error(`AI processing failed: ${processError.message}`);
      }

      // Step 4: Analyze confidence scores from recent intelligence data
      const { data: intelligenceData } = await supabase
        .from('opportunity_intelligence' as any)
        .select('confidence_score')
        .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());

      const confidenceScores = { high: 0, medium: 0, low: 0 };
      intelligenceData?.forEach((intel: any) => {
        if (intel.confidence_score >= 0.8) confidenceScores.high++;
        else if (intel.confidence_score >= 0.6) confidenceScores.medium++;
        else confidenceScores.low++;
      });

      return {
        success: true,
        message: `Successfully processed ${processResult.processed_count} opportunities with AI`,
        raw_opportunities_found: scrapeResult.totalFound,
        processed_opportunities: processResult.processed_count,
        new_opportunities: scrapeResult.newJobs,
        failed_processing: opportunitiesForAI.length - processResult.processed_count,
        confidence_scores: confidenceScores
      };

    } catch (error) {
      console.error('Enhanced scraping error:', error);
      return {
        success: false,
        message: `Enhanced scraping failed: ${error.message}`,
        raw_opportunities_found: 0,
        processed_opportunities: 0,
        new_opportunities: 0,
        failed_processing: 0,
        confidence_scores: { high: 0, medium: 0, low: 0 }
      };
    }
  },

  async runAutonomousAgent(userId?: string): Promise<any> {
    try {
      console.log('Running autonomous agent...');
      
      // Get current user if not provided
      if (!userId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');
        userId = user.id;
      }

      const { data: result, error } = await supabase.functions.invoke(
        'autonomous-agent-runner',
        {
          body: { user_id: userId, action: 'run' }
        }
      );

      if (error) {
        throw new Error(`Agent run failed: ${error.message}`);
      }

      return result;
    } catch (error) {
      console.error('Autonomous agent error:', error);
      throw error;
    }
  }
};
