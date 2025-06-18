
import { Sparkles, User } from "lucide-react";
import { Message } from "@/types/onboarding";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div
      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
    >
      <div className={`max-w-[80%] ${message.sender === "user" ? "order-2" : "order-1"}`}>
        <div
          className={`rounded-2xl p-4 ${
            message.sender === "user"
              ? "bg-blue-600 text-white rounded-br-md"
              : "bg-gray-800 text-white border border-gray-700 rounded-bl-md"
          }`}
        >
          <div className="flex items-start space-x-3">
            {message.sender === "ai" && (
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-[rgb(163,92,215)] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm leading-relaxed">{message.content}</p>
              <p className="text-xs opacity-70 mt-2">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            {message.sender === "user" && (
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <User className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
