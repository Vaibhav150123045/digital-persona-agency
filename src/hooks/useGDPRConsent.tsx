
import { useState, useEffect } from "react";

export interface ConsentPreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

const useGDPRConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [consent, setConsent] = useState<ConsentPreferences | null>(null);

  // Check if user is from EU/UK (simplified check)
  const isEUUser = () => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const euTimezones = [
      'Europe/', 'GMT', 'UTC'
    ];
    return euTimezones.some(tz => timezone.includes(tz));
  };

  useEffect(() => {
    // Check if consent has already been given
    const storedConsent = localStorage.getItem('gdpr-consent');
    
    if (storedConsent) {
      setConsent(JSON.parse(storedConsent));
    } else if (isEUUser()) {
      // Show banner only for EU users who haven't given consent
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    const preferences: ConsentPreferences = {
      essential: true,
      analytics: true,
      marketing: true
    };
    
    setConsent(preferences);
    localStorage.setItem('gdpr-consent', JSON.stringify(preferences));
    localStorage.setItem('gdpr-consent-date', new Date().toISOString());
    setShowBanner(false);
  };

  const rejectAll = () => {
    const preferences: ConsentPreferences = {
      essential: true, // Essential cookies are always required
      analytics: false,
      marketing: false
    };
    
    setConsent(preferences);
    localStorage.setItem('gdpr-consent', JSON.stringify(preferences));
    localStorage.setItem('gdpr-consent-date', new Date().toISOString());
    setShowBanner(false);
  };

  const updatePreferences = (preferences: { analytics: boolean; marketing: boolean }) => {
    const fullPreferences: ConsentPreferences = {
      essential: true, // Essential cookies are always required
      analytics: preferences.analytics,
      marketing: preferences.marketing
    };
    
    setConsent(fullPreferences);
    localStorage.setItem('gdpr-consent', JSON.stringify(fullPreferences));
    localStorage.setItem('gdpr-consent-date', new Date().toISOString());
    setShowBanner(false);
  };

  const closeBanner = () => {
    setShowBanner(false);
  };

  return {
    showBanner,
    consent,
    acceptAll,
    rejectAll,
    updatePreferences,
    closeBanner
  };
};

export default useGDPRConsent;
