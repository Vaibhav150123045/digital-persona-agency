
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, Eye, EyeOff } from "lucide-react";

interface ApiKeyInputProps {
  onApiKeySet: (key: string) => void;
  hasApiKey: boolean;
}

const ApiKeyInput = ({ onApiKeySet, hasApiKey }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = () => {
    if (apiKey.trim()) {
      onApiKeySet(apiKey.trim());
      setApiKey("");
    }
  };

  if (hasApiKey) {
    return (
      <div className="text-center text-green-400 text-sm mb-4">
        ✅ API Key configured - AI responses enabled
      </div>
    );
  }

  return (
    <Card className="bg-blue-900/20 border-blue-400/30 mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-sm flex items-center">
          <Key className="h-4 w-4 mr-2" />
          Enable AI Responses
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-blue-200 text-xs">
          Add your OpenAI API key to get intelligent, personalized responses from your AI agent.
        </p>
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Input
              type={showKey ? "text" : "password"}
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white text-xs pr-8"
              onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </Button>
          </div>
          <Button 
            onClick={handleSubmit} 
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-xs"
            disabled={!apiKey.trim()}
          >
            Set
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyInput;
