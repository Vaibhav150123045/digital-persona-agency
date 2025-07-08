
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/types/onboarding";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";

interface OnboardingChatAreaProps {
  messages: Message[];
  isTyping: boolean;
}

const OnboardingChatArea = ({ messages, isTyping }: OnboardingChatAreaProps) => {
  return (
    <ScrollArea className="flex-1 pr-4 mb-6">
      <div className="space-y-6">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isTyping && <TypingIndicator />}
      </div>
    </ScrollArea>
  );
};

export default OnboardingChatArea;
