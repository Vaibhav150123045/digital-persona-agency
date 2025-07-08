
import { supabase } from "@/integrations/supabase/client";

export const databaseCleanupService = {
  async removeSampleOpportunities(): Promise<{ success: boolean; message: string; removedCount: number }> {
    try {
      console.log('Removing sample opportunities...');
      
      // Delete opportunities that match our sample data titles
      const sampleTitles = [
        "Lead Actor - Independent Drama Film",
        "Supporting Character - Netflix Series", 
        "Featured Role - Commercial Campaign",
        "Background Extra - Hollywood Blockbuster",
        "Voice Actor - Animated Feature"
      ];

      // Update status to 'closed' instead of deleting (this should work with RLS)
      const { data, error } = await supabase
        .from('casting_opportunities')
        .update({ status: 'closed' })
        .in('title', sampleTitles)
        .select();

      if (error) {
        console.error('Error removing sample opportunities:', error);
        throw error;
      }

      const removedCount = data?.length || 0;
      console.log(`Successfully removed ${removedCount} sample opportunities`);

      return {
        success: true,
        message: `Removed ${removedCount} sample opportunities`,
        removedCount
      };

    } catch (error) {
      console.error('Failed to remove sample opportunities:', error);
      return {
        success: false,
        message: `Failed to remove sample opportunities: ${error.message}`,
        removedCount: 0
      };
    }
  },

  async clearAllOpportunities(): Promise<{ success: boolean; message: string; removedCount: number }> {
    try {
      console.log('Clearing all opportunities...');
      
      // Since we can't delete due to RLS, let's update the status to 'closed'
      // This will effectively remove them from the active opportunities list
      const { data, error } = await supabase
        .from('casting_opportunities')
        .update({ status: 'closed' })
        .eq('status', 'active')
        .select();

      if (error) {
        console.error('Error clearing all opportunities:', error);
        throw error;
      }

      const removedCount = data?.length || 0;
      console.log(`Successfully cleared ${removedCount} opportunities`);

      return {
        success: true,
        message: `Cleared ${removedCount} opportunities`,
        removedCount
      };

    } catch (error) {
      console.error('Failed to clear all opportunities:', error);
      return {
        success: false,
        message: `Failed to clear opportunities: ${error.message}`,
        removedCount: 0
      };
    }
  },

  async cleanupAllTestData(): Promise<{ success: boolean; message: string }> {
    try {
      // Clear all opportunities
      const clearResult = await this.clearAllOpportunities();
      
      return {
        success: clearResult.success,
        message: clearResult.message
      };
    } catch (error) {
      console.error('Failed to cleanup test data:', error);
      return {
        success: false,
        message: `Cleanup failed: ${error.message}`
      };
    }
  }
};
