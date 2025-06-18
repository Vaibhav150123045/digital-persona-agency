
import { useState, useEffect } from "react";
import { X, Shield, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface GDPRBannerProps {
  onAccept: () => void;
  onReject: () => void;
  onClose: () => void;
  onUpdatePreferences: (preferences: { analytics: boolean; marketing: boolean }) => void;
}

const GDPRBanner = ({ onAccept, onReject, onClose, onUpdatePreferences }: GDPRBannerProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [marketingEnabled, setMarketingEnabled] = useState(false);

  const handleSavePreferences = () => {
    onUpdatePreferences({ analytics: analyticsEnabled, marketing: marketingEnabled });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Cookie className="h-6 w-6 text-spais-purple-500 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                We value your privacy
              </h3>
              <p className="text-gray-700 text-sm mb-3">
                We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content. 
                You can manage your preferences or reject all non-essential cookies.
              </p>
              
              {showDetails && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4 text-sm">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900">Essential Cookies</h4>
                      <p className="text-gray-600">Required for basic site functionality and security.</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-500">Always enabled</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Analytics Cookies</h4>
                      <p className="text-gray-600">Help us understand how visitors interact with our website.</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-500">Optional</span>
                        <Switch
                          checked={analyticsEnabled}
                          onCheckedChange={setAnalyticsEnabled}
                        />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Marketing Cookies</h4>
                      <p className="text-gray-600">Used to deliver relevant advertisements and track campaign performance.</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-500">Optional</span>
                        <Switch
                          checked={marketingEnabled}
                          onCheckedChange={setMarketingEnabled}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 items-center">
                <Button
                  onClick={onAccept}
                  className="bg-gradient-to-r from-spais-purple-500 to-spais-purple-600 hover:from-spais-purple-600 hover:to-spais-purple-700 text-white"
                >
                  Accept All
                </Button>
                <Button
                  onClick={onReject}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Reject All
                </Button>
                <Button
                  onClick={() => setShowDetails(!showDetails)}
                  variant="ghost"
                  className="text-spais-purple-600 hover:text-spais-purple-700 hover:bg-spais-purple-50"
                >
                  {showDetails ? 'Hide Details' : 'Manage Preferences'}
                </Button>
                {showDetails && (
                  <Button
                    onClick={handleSavePreferences}
                    variant="outline"
                    className="border-spais-purple-300 text-spais-purple-700 hover:bg-spais-purple-50"
                  >
                    Save Preferences
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GDPRBanner;
