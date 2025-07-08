
import { supabase } from "@/integrations/supabase/client";

export interface PuppeteerScrapeRequest {
  websites: string[];
  searchTerms?: string[];
}

export interface PuppeteerScrapeResult {
  success: boolean;
  message: string;
  totalFound: number;
  newJobs: number;
  duplicates: number;
  rejected: number;
  method: string;
  error?: string;
}

export const puppeteerJobScrapingService = {
  async scrapeWithPuppeteer(request: PuppeteerScrapeRequest): Promise<PuppeteerScrapeResult> {
    try {
      console.log('Starting Puppeteer job scraping request:', request);

      const { data, error } = await supabase.functions.invoke('puppeteer-job-scraper', {
        body: request
      });

      if (error) {
        console.error('Puppeteer scraping error:', error);
        throw error;
      }

      console.log('Puppeteer scraping result:', data);
      return data;
    } catch (error) {
      console.error('Error in Puppeteer scraping service:', error);
      return {
        success: false,
        message: "Failed to scrape job websites with Puppeteer",
        totalFound: 0,
        newJobs: 0,
        duplicates: 0,
        rejected: 0,
        method: 'puppeteer',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  getCapabilities(): string[] {
    return [
      "Handle JavaScript-heavy websites",
      "Navigate authentication flows", 
      "Click load more buttons automatically",
      "Extract data from dynamic content",
      "Handle anti-bot detection better",
      "Take screenshots for debugging",
      "Custom selector strategies per platform",
      "Real browser rendering"
    ];
  }
};
