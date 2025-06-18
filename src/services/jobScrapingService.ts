
import { supabase } from "@/integrations/supabase/client";

export interface ScrapeJobsRequest {
  websites: string[];
  searchTerms?: string[];
}

export interface ScrapeJobsResult {
  success: boolean;
  message: string;
  totalFound: number;
  newJobs: number;
  duplicates: number;
  error?: string;
}

export const jobScrapingService = {
  async scrapeActingJobs(request: ScrapeJobsRequest): Promise<ScrapeJobsResult> {
    try {
      console.log('Starting job scraping request:', request);

      // Ensure searchTerms is properly formatted
      const formattedRequest = {
        ...request,
        searchTerms: Array.isArray(request.searchTerms) ? request.searchTerms : []
      };

      const { data, error } = await supabase.functions.invoke('scrape-acting-jobs', {
        body: formattedRequest
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Scraping result:', data);
      return data;
    } catch (error) {
      console.error('Error in scrapeActingJobs:', error);
      return {
        success: false,
        message: "Failed to scrape job websites",
        totalFound: 0,
        newJobs: 0,
        duplicates: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  getPresetWebsites(): { name: string; url: string; description: string; requiresAuth: boolean }[] {
    return [
      {
        name: "Backstage",
        url: "https://www.backstage.com/casting/",
        description: "Popular casting platform with film, TV, and theater opportunities",
        requiresAuth: false
      },
      {
        name: "Spotlight",
        url: "https://www.spotlight.com/actors/auditions",
        description: "UK-based casting directory for professional actors",
        requiresAuth: true
      },
      {
        name: "Casting Networks",
        url: "https://www.castingnetworks.com/auditions",
        description: "Comprehensive casting platform for all types of roles",
        requiresAuth: true
      },
      {
        name: "Actor's Access",
        url: "https://actorsaccess.com/auditions",
        description: "Breakdown Services casting platform",
        requiresAuth: true
      }
    ];
  },

  getBrowserlessCapabilities(): string[] {
    return [
      "Handle JavaScript-heavy websites",
      "Navigate authentication flows",
      "Interact with dynamic content",
      "Click 'Load More' buttons",
      "Handle anti-bot detection",
      "Extract data from complex layouts"
    ];
  }
};
