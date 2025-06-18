
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Zap, Settings, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { castingApiService, type ApiIntegrationConfig, type SyncResult } from "@/services/castingApiService";

const ApiIntegrationsManager = () => {
  const [integrations, setIntegrations] = useState<ApiIntegrationConfig[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const availableIntegrations = castingApiService.getAvailableIntegrations();
    setIntegrations(availableIntegrations);
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const results = await castingApiService.syncAllIntegrations();
      
      const totalNew = results.reduce((sum, result) => sum + result.newOpportunities, 0);
      const totalUpdated = results.reduce((sum, result) => sum + result.updatedOpportunities, 0);
      const hasErrors = results.some(result => !result.success);

      if (hasErrors) {
        toast({
          title: "Sync Completed with Issues",
          description: `Found ${totalNew} new opportunities, updated ${totalUpdated}. Check logs for errors.`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Sync Successful",
          description: `Found ${totalNew} new opportunities and updated ${totalUpdated} existing ones.`
        });
      }

      setLastSync(new Date());
    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: "Sync Failed",
        description: "Failed to sync with casting platforms",
        variant: "destructive"
      });
    } finally {
      setSyncing(false);
    }
  };

  const getStatusIcon = (integration: ApiIntegrationConfig) => {
    if (integration.enabled) {
      return <CheckCircle className="h-4 w-4 text-green-400" />;
    }
    return <AlertCircle className="h-4 w-4 text-yellow-400" />;
  };

  const getStatusText = (integration: ApiIntegrationConfig) => {
    if (integration.enabled) return "Connected";
    if (integration.requiresAuth) return "Needs API Key";
    return "Available";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">API Integrations</h2>
          <p className="text-white/70">Connect with major casting platforms for better opportunities</p>
        </div>
        <div className="flex items-center gap-3">
          {lastSync && (
            <span className="text-xs text-white/50">
              Last sync: {lastSync.toLocaleTimeString()}
            </span>
          )}
          <Button 
            onClick={handleSync}
            disabled={syncing}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {syncing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Sync All
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {integrations.map((integration) => (
          <Card key={integration.name} className="bg-white/5 border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(integration)}
                  <div>
                    <CardTitle className="text-white">{integration.name}</CardTitle>
                    <CardDescription className="text-white/70">
                      {getStatusText(integration)}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={integration.enabled ? "default" : "secondary"}>
                    {integration.enabled ? "Active" : "Inactive"}
                  </Badge>
                  <Switch 
                    checked={integration.enabled}
                    disabled={integration.requiresAuth && !integration.apiKey}
                  />
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {integration.supportedFeatures.listings && (
                    <Badge variant="outline" className="text-xs border-green-500/30 text-green-300">
                      Listings
                    </Badge>
                  )}
                  {integration.supportedFeatures.submissions && (
                    <Badge variant="outline" className="text-xs border-blue-500/30 text-blue-300">
                      Direct Submissions
                    </Badge>
                  )}
                  {integration.supportedFeatures.realTimeUpdates && (
                    <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-300">
                      Real-time Updates
                    </Badge>
                  )}
                </div>

                {integration.requiresAuth && !integration.apiKey && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                    <p className="text-xs text-yellow-300">
                      API key required to enable this integration
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Configure
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-white">Coming Soon</h3>
            <p className="text-white/70 text-sm">
              More integrations including Actor's Access, ManCat, and regional platforms
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiIntegrationsManager;
