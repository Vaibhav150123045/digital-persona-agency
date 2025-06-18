
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Lock, Sparkles } from "lucide-react";

interface QuickAccessChatProps {
  isFeatureLocked: boolean;
  onChatClick: () => void;
  onShowLockedFeature: () => void;
}

const QuickAccessChat = ({ isFeatureLocked, onChatClick, onShowLockedFeature }: QuickAccessChatProps) => {
  return (
    <Card 
      className={`${isFeatureLocked 
        ? "bg-gradient-to-r from-gray-900/20 to-gray-800/20 backdrop-blur-sm border-gray-500/20" 
        : "bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm border-blue-300/20 cursor-pointer hover:from-blue-900/30 hover:to-purple-900/30"
      } transition-all`} 
      onClick={() => isFeatureLocked ? onShowLockedFeature() : onChatClick()}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold">
                {isFeatureLocked ? "Complete Signup to Chat" : "Chat with Your Agent"}
              </h3>
              <p className={`text-sm ${isFeatureLocked ? "text-gray-400" : "text-blue-200"}`}>
                {isFeatureLocked 
                  ? "Finish your account setup to get personalized advice" 
                  : "Get personalized advice and find opportunities • Available 24/7"
                }
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isFeatureLocked ? (
              <Lock className="h-5 w-5 text-gray-400" />
            ) : (
              <>
                <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickAccessChat;
