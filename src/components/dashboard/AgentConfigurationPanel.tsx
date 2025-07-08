
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Settings, Save } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface AgentConfig {
  id?: string;
  user_id: string;
  aggressiveness_level: 'conservative' | 'moderate' | 'aggressive';
  auto_apply_enabled: boolean;
  max_applications_per_day: number;
  preferred_opportunity_types: string[];
  minimum_confidence_score: number;
  custom_instructions?: string;
}

const AgentConfigurationPanel = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [config, setConfig] = useState<AgentConfig>({
    user_id: '',
    aggressiveness_level: 'moderate',
    auto_apply_enabled: false,
    max_applications_per_day: 5,
    preferred_opportunity_types: [],
    minimum_confidence_score: 70,
    custom_instructions: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadConfiguration();
    }
  }, [user]);

  const loadConfiguration = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('agent_configurations')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setConfig({
          id: data.id,
          user_id: data.user_id,
          aggressiveness_level: data.aggressiveness_level as 'conservative' | 'moderate' | 'aggressive',
          auto_apply_enabled: data.auto_apply_enabled,
          max_applications_per_day: data.max_applications_per_day,
          preferred_opportunity_types: data.preferred_opportunity_types || [],
          minimum_confidence_score: data.minimum_confidence_score,
          custom_instructions: data.custom_instructions || ''
        });
      } else {
        // Set default config with user ID
        setConfig(prev => ({ ...prev, user_id: user.id }));
      }
    } catch (error) {
      console.error('Error loading agent configuration:', error);
      toast({
        title: "Error loading configuration",
        description: "Using default settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveConfiguration = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('agent_configurations')
        .upsert({
          ...config,
          user_id: user.id
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "Configuration saved",
        description: "Your AI agent settings have been updated"
      });
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast({
        title: "Error saving configuration",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleOpportunityTypeToggle = (type: string) => {
    setConfig(prev => ({
      ...prev,
      preferred_opportunity_types: prev.preferred_opportunity_types.includes(type)
        ? prev.preferred_opportunity_types.filter(t => t !== type)
        : [...prev.preferred_opportunity_types, type]
    }));
  };

  if (loading) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-8 text-center">
          <div className="text-white">Loading configuration...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Settings className="h-5 w-5" />
          Agent Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Aggressiveness Level */}
        <div className="space-y-2">
          <Label className="text-white">Agent Aggressiveness</Label>
          <Select
            value={config.aggressiveness_level}
            onValueChange={(value: 'conservative' | 'moderate' | 'aggressive') =>
              setConfig(prev => ({ ...prev, aggressiveness_level: value }))
            }
          >
            <SelectTrigger className="bg-white/5 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="conservative">Conservative - High selectivity</SelectItem>
              <SelectItem value="moderate">Moderate - Balanced approach</SelectItem>
              <SelectItem value="aggressive">Aggressive - Apply to more opportunities</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Auto Apply Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-white">Auto-Apply</Label>
            <p className="text-sm text-white/60">
              Automatically submit applications for high-match opportunities
            </p>
          </div>
          <Switch
            checked={config.auto_apply_enabled}
            onCheckedChange={(checked) =>
              setConfig(prev => ({ ...prev, auto_apply_enabled: checked }))
            }
          />
        </div>

        {/* Max Applications Per Day */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label className="text-white">Max Applications Per Day</Label>
            <span className="text-white text-sm">{config.max_applications_per_day}</span>
          </div>
          <Slider
            value={[config.max_applications_per_day]}
            onValueChange={([value]) =>
              setConfig(prev => ({ ...prev, max_applications_per_day: value }))
            }
            max={20}
            min={1}
            step={1}
            className="w-full"
          />
        </div>

        {/* Minimum Confidence Score */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label className="text-white">Minimum Confidence Score</Label>
            <span className="text-white text-sm">{config.minimum_confidence_score}%</span>
          </div>
          <Slider
            value={[config.minimum_confidence_score]}
            onValueChange={([value]) =>
              setConfig(prev => ({ ...prev, minimum_confidence_score: value }))
            }
            max={100}
            min={50}
            step={5}
            className="w-full"
          />
        </div>

        {/* Preferred Opportunity Types */}
        <div className="space-y-3">
          <Label className="text-white">Preferred Opportunity Types</Label>
          <div className="grid grid-cols-2 gap-3">
            {['Film', 'TV Series', 'Commercial', 'Theater', 'Voice Over', 'Background'].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={type}
                  checked={config.preferred_opportunity_types.includes(type)}
                  onChange={() => handleOpportunityTypeToggle(type)}
                  className="rounded border-white/20 bg-white/5"
                />
                <Label htmlFor={type} className="text-white text-sm">
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Instructions */}
        <div className="space-y-2">
          <Label className="text-white">Custom Instructions</Label>
          <Textarea
            value={config.custom_instructions}
            onChange={(e) =>
              setConfig(prev => ({ ...prev, custom_instructions: e.target.value }))
            }
            placeholder="Add any specific instructions for your AI agent..."
            className="bg-white/5 border-white/20 text-white min-h-[100px]"
          />
        </div>

        {/* Save Button */}
        <Button
          onClick={saveConfiguration}
          disabled={saving || !user}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {saving ? (
            <>
              <Save className="h-4 w-4 mr-2 animate-pulse" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Configuration
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AgentConfigurationPanel;
