import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Crown, MessageSquare, Zap, Plus } from "lucide-react";
import { aiChatService } from "@/services/aiChatService";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ChatUsageIndicatorProps {
  usage?: {
    messagesUsed: number;
    tokensUsed: number;
    messagesLimit: number | string;
    tokensLimit: number | string;
    tier: string;
  };
  onUpgrade: () => void;
  onUsageUpdate?: (usage: any) => void;
}

const ChatUsageIndicator = ({ usage, onUpgrade, onUsageUpdate }: ChatUsageIndicatorProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentUsage, setCurrentUsage] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [credits, setCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsageAndSubscription = async () => {
    if (user) {
      try {
        console.log('Fetching usage and subscription for user:', user.email);
        
        // Get current usage - this should now be user-specific
        const usageData = await aiChatService.getCurrentUsage();
        console.log('Fetched usage data for user:', user.email, usageData);
        setCurrentUsage(usageData);

        // Get subscription info
        try {
          const { data } = await supabase.functions.invoke('check-subscription');
          setSubscription(data);
          console.log('Subscription data for user:', user.email, data);
        } catch (error) {
          console.error('Error checking subscription for user:', user.email, error);
        }

        // Get credits (mock for now - you'll need to implement credits table)
        setCredits(0); // TODO: Fetch from credits table
        
        // Calculate tier and limits
        const tier = subscription?.subscribed ? 
          (subscription.subscription_tier === 'pro' ? 'pro' : 'plus') : 'free';
        
        const limits = {
          free: { messages: 10 },
          plus: { messages: 100 },
          pro: { messages: -1 }
        };
        
        const currentLimits = limits[tier as keyof typeof limits];
        
        // Notify parent component of usage update with current data
        if (onUsageUpdate && usageData) {
          const usageUpdate = {
            messagesUsed: usageData.messages_used || 0,
            messagesLimit: currentLimits.messages,
            tier: tier,
            userId: user.id // Include user ID for debugging
          };
          console.log('Sending usage update to parent for user:', user.email, usageUpdate);
          onUsageUpdate(usageUpdate);
        }
      } catch (error) {
        console.error('Error fetching usage for user:', user?.email, error);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('No authenticated user, skipping usage fetch');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsageAndSubscription();
  }, [user]); // Refetch when user changes

  // Update local state when usage prop changes (from parent)
  useEffect(() => {
    if (usage && user) {
      console.log('Usage prop updated for user:', user.email, usage);
      setCurrentUsage({
        messages_used: usage.messagesUsed,
        tokens_used: usage.tokensUsed || 0
      });
    }
  }, [usage, user]);

  // Use the most current usage data available
  const displayUsage = usage || currentUsage;
  const tier = subscription?.subscribed ? 
    (subscription.subscription_tier === 'pro' ? 'pro' : 'plus') : 'free';

  const limits = {
    free: { messages: 10 },
    plus: { messages: 100 },
    pro: { messages: -1 }
  };

  const currentLimits = limits[tier as keyof typeof limits];
  const messagesUsed = displayUsage?.messages_used || displayUsage?.messagesUsed || 0;

  console.log('ChatUsageIndicator render for user:', user?.email, {
    displayUsage,
    messagesUsed,
    currentLimits,
    tier,
    usage,
    currentUsage
  });

  const getUsageColor = (used: number, limit: number) => {
    if (limit === -1) return "bg-green-500"; // Unlimited
    const percentage = (used / limit) * 100;
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-blue-500";
  };

  const getTierInfo = () => {
    switch (tier) {
      case 'pro':
        return { name: 'Pro', color: 'text-purple-400', icon: Crown };
      case 'plus':
        return { name: 'Plus', color: 'text-blue-400', icon: Zap };
      default:
        return { name: 'Essential (Free)', color: 'text-gray-400', icon: MessageSquare };
    }
  };

  const handleUpgrade = async (targetTier: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { tier: targetTier }
      });
      
      if (error) {
        console.error('Checkout error:', error);
        toast({
          title: "Checkout Error",
          description: error.message,
          variant: "destructive"
        });
      } else if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Error",
        description: "Failed to create checkout session.",
        variant: "destructive"
      });
    }
  };

  const handleBuyCredits = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-credit-purchase', {
        body: { amount: 5, price: 300 } // 5 credits for $3.00 (in cents)
      });
      
      if (error) {
        console.error('Credit purchase error:', error);
        toast({
          title: "Payment Error",
          description: error.message,
          variant: "destructive"
        });
      } else if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Credit purchase error:', error);
      toast({
        title: "Payment Error",
        description: "Failed to create payment session.",
        variant: "destructive"
      });
    }
  };

  const tierInfo = getTierInfo();
  const TierIcon = tierInfo.icon;

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardContent className="p-4">
          <div className="text-white text-sm">Loading usage...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TierIcon className={`h-4 w-4 ${tierInfo.color}`} />
            <span className={`text-sm font-medium ${tierInfo.color}`}>
              {tierInfo.name}
            </span>
          </div>
          {tier === 'free' && (
            <div className="relative group">
              <Button
                size="sm"
                onClick={() => handleUpgrade('plus')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Crown className="h-3 w-3 mr-1" />
                Upgrade
              </Button>
              
              {/* Upgrade options tooltip */}
              <div className="absolute right-0 top-full mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="space-y-2">
                  <div className="text-xs text-gray-300 mb-2">Choose your plan:</div>
                  <Button
                    size="sm"
                    onClick={() => handleUpgrade('plus')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-xs"
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    Plus - $22.99/mo
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleUpgrade('pro')}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-xs"
                  >
                    <Crown className="h-3 w-3 mr-1" />
                    Pro - $42.99/mo
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {/* Messages Usage */}
          <div>
            <div className="flex items-center justify-between text-xs text-gray-300 mb-1">
              <span>Daily Messages</span>
              <span>
                {messagesUsed} / {currentLimits.messages === -1 ? '∞' : currentLimits.messages}
              </span>
            </div>
            {currentLimits.messages !== -1 && (
              <Progress 
                value={(messagesUsed / currentLimits.messages) * 100} 
                className="h-2"
                indicatorClassName={getUsageColor(messagesUsed, currentLimits.messages)}
              />
            )}
          </div>

          {/* Credits Display */}
          <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/30">
            <div className="flex items-center justify-between text-xs text-gray-300 mb-3">
              <span className="font-medium">Extra Credits</span>
              <span className="text-green-400 font-semibold">{credits} available</span>
            </div>
            <Button
              size="sm"
              onClick={handleBuyCredits}
              className="w-full text-sm font-medium bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-none shadow-md"
            >
              <Plus className="h-4 w-4 mr-2" />
              Buy 5 Credits for $3
            </Button>
          </div>
        </div>

        {/* Updated warning messages based on usage */}
        {tier === 'free' && currentLimits.messages !== -1 && (
          <>
            {messagesUsed >= currentLimits.messages ? (
              <div className="text-xs text-red-400 bg-red-400/10 rounded p-2">
                🚫 You've hit your daily limit of {currentLimits.messages} messages. Upgrade for unlimited access!
              </div>
            ) : messagesUsed >= 8 ? (
              <div className="text-xs text-yellow-400 bg-yellow-400/10 rounded p-2">
                ⚠️ You're approaching your daily limit. Upgrade for unlimited access!
              </div>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ChatUsageIndicator;
