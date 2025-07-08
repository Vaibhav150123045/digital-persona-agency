
import { useState, useEffect } from 'react';
import type { CastingOpportunity } from '@/types/casting';

interface StoredOpportunity {
  id: string;
  title: string;
  project_name?: string;
  timestamp: number;
}

export const useApplicationStatusDialog = () => {
  const [dialogOpportunity, setDialogOpportunity] = useState<CastingOpportunity | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const checkForReturnedUser = () => {
      const stored = localStorage.getItem('lastViewedOpportunity');
      if (stored) {
        try {
          const parsed: StoredOpportunity = JSON.parse(stored);
          const timeElapsed = Date.now() - parsed.timestamp;
          
          // Show dialog if user returned within 10 minutes and window was focused
          if (timeElapsed < 10 * 60 * 1000) {
            // Create a minimal opportunity object for the dialog
            const opportunity: CastingOpportunity = {
              id: parsed.id,
              title: parsed.title,
              project_name: parsed.project_name,
              role_type: 'lead', // Default value
              status: 'active',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            } as CastingOpportunity;
            
            setDialogOpportunity(opportunity);
            setIsDialogOpen(true);
            
            // Clear the stored opportunity
            localStorage.removeItem('lastViewedOpportunity');
          } else {
            // Clean up old stored data
            localStorage.removeItem('lastViewedOpportunity');
          }
        } catch (error) {
          console.error('Error parsing stored opportunity:', error);
          localStorage.removeItem('lastViewedOpportunity');
        }
      }
    };

    // Check when the window regains focus (user returns to tab)
    const handleWindowFocus = () => {
      checkForReturnedUser();
    };

    // Check immediately on mount
    checkForReturnedUser();

    // Listen for window focus events
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, []);

  const closeDialog = () => {
    setIsDialogOpen(false);
    setDialogOpportunity(null);
  };

  return {
    dialogOpportunity,
    isDialogOpen,
    closeDialog
  };
};
