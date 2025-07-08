
import { supabase } from "@/integrations/supabase/client";

export const userOpportunityService = {
  async dismissOpportunity(opportunityId: string): Promise<{ success: boolean; message: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('dismissed_opportunities')
        .insert({
          user_id: user.id,
          opportunity_id: opportunityId,
          dismissed_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error dismissing opportunity:', error);
        throw error;
      }

      return {
        success: true,
        message: 'Opportunity dismissed successfully'
      };
    } catch (error: any) {
      console.error('Failed to dismiss opportunity:', error);
      return {
        success: false,
        message: `Failed to dismiss opportunity: ${error.message}`
      };
    }
  },

  async dismissAllActiveOpportunities(): Promise<{ success: boolean; message: string; dismissedCount: number }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      console.log('Getting all active opportunities for user to dismiss...');

      // First get all active opportunities
      const { data: activeOpportunities, error: fetchError } = await supabase
        .from('casting_opportunities')
        .select('id')
        .eq('status', 'active');

      if (fetchError) {
        console.error('Error fetching active opportunities:', fetchError);
        throw fetchError;
      }

      if (!activeOpportunities || activeOpportunities.length === 0) {
        return {
          success: true,
          message: 'No opportunities to dismiss',
          dismissedCount: 0
        };
      }

      console.log(`Found ${activeOpportunities.length} active opportunities to dismiss`);

      // Create dismissal records for all active opportunities for this user
      const dismissalRecords = activeOpportunities.map(opp => ({
        user_id: user.id,
        opportunity_id: opp.id,
        dismissed_at: new Date().toISOString()
      }));

      const { data, error } = await supabase
        .from('dismissed_opportunities')
        .upsert(dismissalRecords, { 
          onConflict: 'user_id,opportunity_id',
          ignoreDuplicates: true 
        })
        .select();

      if (error) {
        console.error('Error dismissing opportunities:', error);
        throw error;
      }

      const dismissedCount = data?.length || 0;
      console.log(`Successfully dismissed ${dismissedCount} opportunities for user`);

      return {
        success: true,
        message: `Dismissed ${dismissedCount} opportunities`,
        dismissedCount
      };
    } catch (error: any) {
      console.error('Failed to dismiss all opportunities:', error);
      return {
        success: false,
        message: `Failed to dismiss opportunities: ${error.message}`,
        dismissedCount: 0
      };
    }
  },

  async getDismissedOpportunityIds(): Promise<string[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('dismissed_opportunities')
        .select('opportunity_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching dismissed opportunities:', error);
        return [];
      }

      return data?.map(item => item.opportunity_id) || [];
    } catch (error) {
      console.error('Failed to get dismissed opportunities:', error);
      return [];
    }
  }
};
