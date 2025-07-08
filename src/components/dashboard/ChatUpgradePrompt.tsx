
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, MessageSquare, Zap, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ChatUpgradePromptProps {
  tier: string;
  messagesUsed: number;
  limit: number;
  onClose: () => void;
}

const ChatUpgradePrompt = ({ tier, messagesUsed, limit, onClose }: ChatUpgradePromptProps) => {
  const { toast } = useToast();

  const handleUpgrade = async (targetTier: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { tier: targetTier }
      });
      
      if (error) {
        toast({
          title: "Checkout Error",
          description: error.message,
          variant: "destructive"
        });
      } else if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      toast({
        title: "Checkout Error",
        description: "Failed to create checkout session.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-4">
          <MessageSquare className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-white text-2xl">Daily Limit Reached</CardTitle>
        <p className="text-gray-300">
          You've used {messagesUsed} of your {limit} daily messages. Upgrade to continue chatting with your AI agent!
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Plus Plan */}
          <Card className="bg-blue-500/10 border-blue-500/30 relative">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-5 w-5 text-blue-400" />
                <h3 className="text-white font-semibold">Plus Plan</h3>
              </div>
              <div className="text-2xl font-bold text-white mb-1">$22.99</div>
              <div className="text-sm text-gray-300 mb-4">per month</div>
              
              <ul className="space-y-2 text-sm text-gray-300 mb-4">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-400" />
                  100 messages/day
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-400" />
                  20,000 tokens/day
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-400" />
                  Priority support
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-400" />
                  Advanced AI responses
                </li>
              </ul>
              
              <Button 
                onClick={() => handleUpgrade('plus')}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Upgrade to Plus
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="bg-purple-500/10 border-purple-500/30 relative">
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full">
                MOST POPULAR
              </span>
            </div>
            
            <CardContent className="p-4 pt-6">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="h-5 w-5 text-purple-400" />
                <h3 className="text-white font-semibold">Pro Plan</h3>
              </div>
              <div className="text-2xl font-bold text-white mb-1">$42.99</div>
              <div className="text-sm text-gray-300 mb-4">per month</div>
              
              <ul className="space-y-2 text-sm text-gray-300 mb-4">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-400" />
                  Unlimited messages
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-400" />
                  Unlimited tokens
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-400" />
                  Premium AI model
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-400" />
                  24/7 priority support
                </li>
              </ul>
              
              <Button 
                onClick={() => handleUpgrade('pro')}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Pro
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            Continue with free plan tomorrow
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatUpgradePrompt;
