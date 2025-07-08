
import { useState, useEffect } from "react";

export interface ConsentPreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

const useGDPRConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [consent, setConsent] = useState<ConsentPreferences | null>(null);

  // Check if user is from EU/UK (more comprehensive check)
  const isEUUser = () => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const language = navigator.language.toLowerCase();
    
    console.log('GDPR Detection - Timezone:', timezone);
    console.log('GDPR Detection - Language:', language);
    
    // EU/UK timezones
    const euTimezones = [
      'Europe/', 'GMT', 'UTC', 'Atlantic/Reykjavik', 'Atlantic/Canary'
    ];
    
    // EU/UK language codes
    const euLanguages = [
      'en-gb', 'de', 'fr', 'it', 'es', 'pt', 'nl', 'pl', 'cs', 'sk', 
      'hu', 'ro', 'bg', 'hr', 'sl', 'lt', 'lv', 'et', 'fi', 'sv', 
      'da', 'no', 'is', 'mt', 'el', 'cy'
    ];
    
    const isEUTimezone = euTimezones.some(tz => timezone.includes(tz));
    const isEULanguage = euLanguages.some(lang => language.includes(lang));
    
    console.log('GDPR Detection - EU Timezone:', isEUTimezone);
    console.log('GDPR Detection - EU Language:', isEULanguage);
    
    // For now, show for everyone to test (remove this line later)
    const isEU = true; // Temporary - always show banner
    
    console.log('GDPR Detection - Final result:', isEU);
    return isEU;
  };

  useEffect(() => {
    // TEMPORARY: Clear stored consent to show banner for testing
    // Remove these lines once testing is complete
    localStorage.removeItem('gdpr-consent');
    localStorage.removeItem('gdpr-consent-date');
    console.log('GDPR - Cleared stored consent for testing');
    
    // Check if consent has already been given
    const storedConsent = localStorage.getItem('gdpr-consent');
    
    console.log('GDPR - Stored consent:', storedConsent);
    
    if (storedConsent) {
      setConsent(JSON.parse(storedConsent));
    } else if (isEUUser()) {
      // Show banner for EU users who haven't given consent
      console.log('GDPR - Showing banner');
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
