
import { supabase } from "@/integrations/supabase/client";
import { jobScrapingService } from "./jobScrapingService";

export const backgroundJobService = {
  async runPeriodicJobScraping(): Promise<void> {
    try {
      console.log('Running background job scraping...');
      
      // Use a mix of complex sites (for Browserless) and simple sites (for Firecrawl)
      const complexSites = [
        "https://www.spotlight.com/actors/auditions",
        "https://www.castingnetworks.com/auditions"
      ];
      
      const simpleSites = [
        "https://www.backstage.com/casting/"
      ];

      // Scrape complex sites first (these require authentication/dynamic content)
      const complexResult = await jobScrapingService.scrapeActingJobs({
        websites: complexSites,
        searchTerms: ["film", "tv", "commercial", "theater"]
      });

      console.log('Complex sites scraping result:', complexResult);

      // Then scrape simple sites
      const simpleResult = await jobScrapingService.scrapeActingJobs({
        websites: simpleSites,
        searchTerms: ["film", "tv", "commercial", "theater"]
      });

      console.log('Simple sites scraping result:', simpleResult);
      
      const totalNewJobs = (complexResult.newJobs || 0) + (simpleResult.newJobs || 0);
      
      if (totalNewJobs > 0) {
        console.log(`Background scraper found ${totalNewJobs} new opportunities`);
      }
    } catch (error) {
      console.error('Background job scraping failed:', error);
    }
  },

  async validateOpportunityUrl(url: string): Promise<boolean> {
    try {
      // Enhanced validation with better error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(url, { 
        method: 'HEAD', 
        mode: 'no-cors',
        signal: controller.signal 
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.log('URL validation failed for:', url, error);
      return false;
    }
  }
};
