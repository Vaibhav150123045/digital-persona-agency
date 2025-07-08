
import { supabase } from "@/integrations/supabase/client";
import type { CastingOpportunity } from "@/types/casting";

export interface ApiIntegrationConfig {
  name: string;
  enabled: boolean;
  apiKey?: string;
  baseUrl: string;
  requiresAuth: boolean;
  supportedFeatures: {
    listings: boolean;
    submissions: boolean;
    realTimeUpdates: boolean;
  };
}

export interface SyncResult {
  success: boolean;
  message: string;
  newOpportunities: number;
  updatedOpportunities: number;
  errors: string[];
}

export const castingApiService = {
  // Get available API integrations
  getAvailableIntegrations(): ApiIntegrationConfig[] {
    return [
      {
        name: "Spotlight",
        enabled: false,
        baseUrl: "https://app.spotlight.com/jobs/all-opportunities",
        requiresAuth: true,
        supportedFeatures: {
          listings: true,
          submissions: true,
          realTimeUpdates: true
        }
      },
      {
        name: "Casting Networks",
        enabled: false,
        baseUrl: "https://api.castingnetworks.com/v1",
        requiresAuth: true,
        supportedFeatures: {
          listings: true,
          submissions: true,
          realTimeUpdates: false
        }
      },
      {
        name: "Backstage",
        enabled: false,
        baseUrl: "https://api.backstage.com/v1",
        requiresAuth: true,
        supportedFeatures: {
          listings: true,
          submissions: false,
          realTimeUpdates: false
        }
      }
    ];
  },

  // Sync opportunities from Spotlight API
  async syncSpotlightOpportunities(): Promise<SyncResult> {
    try {
      console.log('Starting Spotlight API sync...');

      const { data, error } = await supabase.functions.invoke('sync-spotlight-opportunities', {
        body: {}
      });

      if (error) {
        console.error('Spotlight sync error:', error);
        throw error;
      }

      console.log('Spotlight sync result:', data);
      return data;
    } catch (error) {
      console.error('Error in syncSpotlightOpportunities:', error);
      return {
        success: false,
        message: "Failed to sync with Spotlight API",
        newOpportunities: 0,
        updatedOpportunities: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  },

  // Sync opportunities from all enabled integrations
  async syncAllIntegrations(): Promise<SyncResult[]> {
    const results: SyncResult[] = [];
    
    try {
      // For now, just sync Spotlight
      const spotlightResult = await this.syncSpotlightOpportunities();
      results.push(spotlightResult);
      
      // TODO: Add other integrations here
      
      return results;
    } catch (error) {
      console.error('Error syncing integrations:', error);
      return [{
        success: false,
        message: "Failed to sync integrations",
        newOpportunities: 0,
        updatedOpportunities: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      }];
    }
  },

  // Submit application via API
  async submitViaApi(opportunityId: string, platform: string, applicationData: any): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('submit-via-api', {
        body: {
          opportunityId,
          platform,
          applicationData
        }
      });

      if (error) throw error;
      return data.success;
    } catch (error) {
      console.error('API submission error:', error);
      return false;
    }
  }
};
