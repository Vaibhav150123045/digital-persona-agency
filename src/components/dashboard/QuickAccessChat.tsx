
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Sparkles } from "lucide-react";

interface QuickAccessChatProps {
  isFeatureLocked: boolean;
  onChatClick: () => void;
  onShowLockedFeature: () => void;
}

const QuickAccessChat = ({ isFeatureLocked, onChatClick, onShowLockedFeature }: QuickAccessChatProps) => {
  return (
    <Card 
      className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm border-slate-600/30 cursor-pointer hover:from-slate-800/60 hover:to-slate-700/60 transition-all shadow-lg" 
      onClick={onChatClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-spais-purple-500 to-spais-purple-600 rounded-full flex items-center justify-center shadow-md">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold drop-shadow-sm">
                Chat with Your Agent
              </h3>
              <p className="text-slate-300 text-sm font-medium drop-shadow-sm">
                Get personalized advice and find opportunities • Available 24/7
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-spais-purple-400 animate-pulse drop-shadow-sm" />
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-sm"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickAccessChat;
