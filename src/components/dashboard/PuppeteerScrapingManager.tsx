
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Bot, Play, Loader2, Zap } from "lucide-react";
import { puppeteerJobScrapingService, type PuppeteerScrapeResult } from "@/services/puppeteerJobScrapingService";

const PuppeteerScrapingManager = () => {
  const [isScrapingInProgress, setIsScrapingInProgress] = useState(false);
  const [lastResult, setLastResult] = useState<PuppeteerScrapeResult | null>(null);
  const { toast } = useToast();

  const startPuppeteerScraping = async () => {
    setIsScrapingInProgress(true);
    setLastResult(null);

    try {
      const websites = [
        "https://www.backstage.com/casting/",
        "https://www.castingnetworks.com/auditions",
        "https://www.spotlight.com/actors/auditions"
      ];

      const result = await puppeteerJobScrapingService.scrapeWithPuppeteer({
        websites,
        searchTerms: ["film", "tv", "commercial", "theater", "lead", "supporting"]
      });

      setLastResult(result);

      if (result.success) {
        toast({
          title: "Puppeteer Scraping Complete!",
          description: `Found ${result.newJobs} new jobs from ${websites.length} websites using browser automation`,
        });
      } else {
        toast({
          title: "Puppeteer Scraping Failed",
          description: result.error || "An error occurred during browser scraping",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Puppeteer scraping error:', error);
      toast({
        title: "Puppeteer Scraping Error",
        description: "Failed to complete the browser scraping process",
        variant: "destructive"
      });
    } finally {
      setIsScrapingInProgress(false);
    }
  };

  const capabilities = puppeteerJobScrapingService.getCapabilities();

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Bot className="h-5 w-5 mr-2" />
          Puppeteer Browser Scraper
        </CardTitle>
        <CardDescription className="text-white/70">
          Advanced browser automation for complex casting websites
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Capabilities */}
        <div>
          <h4 className="text-white text-sm font-medium mb-3">Enhanced Capabilities</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {capabilities.map((capability, index) => (
              <Badge 
                key={index}
                variant="outline" 
                className="text-xs border-purple-500/30 text-purple-300 justify-start"
              >
                <Zap className="h-3 w-3 mr-1" />
                {capability}
              </Badge>
            ))}
          </div>
        </div>

        {/* Last Result */}
        {lastResult && !isScrapingInProgress && (
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-white font-medium mb-2">Latest Puppeteer Results</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400">{lastResult.totalFound}</div>
                <div className="text-white/60 text-xs">Jobs Found</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">{lastResult.newJobs}</div>
                <div className="text-white/60 text-xs">New Jobs</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">{lastResult.duplicates}</div>
                <div className="text-white/60 text-xs">Duplicates</div>
              </div>
            </div>
            <p className="text-white/70 text-sm mt-3">{lastResult.message}</p>
            <Badge className="mt-2 bg-purple-500/20 text-purple-300">
              Method: {lastResult.method || 'puppeteer'}
            </Badge>
          </div>
        )}

        {/* Scraping Button */}
        <Button 
          onClick={startPuppeteerScraping}
          disabled={isScrapingInProgress}
          className="w-full bg-purple-600 hover:bg-purple-700"
          size="lg"
        >
          {isScrapingInProgress ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Browser Scraping in Progress...
            </>
          ) : (
            <>
              <Bot className="h-4 w-4 mr-2" />
              Start Puppeteer Scraping
            </>
          )}
        </Button>

        <div className="text-xs text-white/50 text-center">
          Uses real browser automation for better success rates
        </div>
      </CardContent>
    </Card>
  );
};

export default PuppeteerScrapingManager;
