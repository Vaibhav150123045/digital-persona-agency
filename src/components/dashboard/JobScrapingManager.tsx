
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Search, Globe, RefreshCw } from "lucide-react";
import { jobScrapingService, type ScrapeJobsResult } from "@/services/jobScrapingService";

const JobScrapingManager = () => {
  const [selectedWebsites, setSelectedWebsites] = useState<string[]>([]);
  const [customWebsite, setCustomWebsite] = useState("");
  const [searchTerms, setSearchTerms] = useState("");
  const [isScrapingInProgress, setIsScrapingInProgress] = useState(false);
  const [lastResult, setLastResult] = useState<ScrapeJobsResult | null>(null);
  const { toast } = useToast();

  const presetWebsites = jobScrapingService.getPresetWebsites();

  const handleWebsiteToggle = (websiteUrl: string) => {
    setSelectedWebsites(prev => 
      prev.includes(websiteUrl) 
        ? prev.filter(url => url !== websiteUrl)
        : [...prev, websiteUrl]
    );
  };

  const addCustomWebsite = () => {
    if (customWebsite && !selectedWebsites.includes(customWebsite)) {
      setSelectedWebsites(prev => [...prev, customWebsite]);
      setCustomWebsite("");
    }
  };

  const startScraping = async () => {
    if (selectedWebsites.length === 0) {
      toast({
        title: "No websites selected",
        description: "Please select at least one website to scrape",
        variant: "destructive"
      });
      return;
    }

    setIsScrapingInProgress(true);
    setLastResult(null);

    try {
      const searchTermsArray = searchTerms
        .split(',')
        .map(term => term.trim())
        .filter(term => term.length > 0);

      const result = await jobScrapingService.scrapeActingJobs({
        websites: selectedWebsites,
        searchTerms: searchTermsArray.length > 0 ? searchTermsArray : undefined
      });

      setLastResult(result);

      if (result.success) {
        toast({
          title: "Scraping Complete!",
          description: `Found ${result.newJobs} new jobs from ${selectedWebsites.length} websites`,
        });
      } else {
        toast({
          title: "Scraping Failed",
          description: result.error || "An error occurred during scraping",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Scraping error:', error);
      toast({
        title: "Scraping Error",
        description: "Failed to complete the scraping process",
        variant: "destructive"
      });
    } finally {
      setIsScrapingInProgress(false);
    }
  };

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Search className="h-5 w-5 mr-2" />
          AI Job Scraper
        </CardTitle>
        <CardDescription className="text-white/70">
          Automatically search and import acting opportunities from casting websites
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Website Selection */}
        <div>
          <Label className="text-white text-sm font-medium mb-3 block">
            Select Websites to Scrape
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {presetWebsites.map((website) => (
              <div key={website.url} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
                <Checkbox
                  id={website.url}
                  checked={selectedWebsites.includes(website.url)}
                  onCheckedChange={() => handleWebsiteToggle(website.url)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label htmlFor={website.url} className="text-white text-sm font-medium cursor-pointer">
                    {website.name}
                  </Label>
                  <p className="text-white/60 text-xs mt-1">{website.description}</p>
                  <Badge variant="outline" className="text-xs mt-2 border-white/20 text-white/70">
                    {website.url.replace('https://www.', '')}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Website */}
        <div>
          <Label className="text-white text-sm font-medium mb-2 block">
            Add Custom Website
          </Label>
          <div className="flex space-x-2">
            <Input
              placeholder="https://example-casting-site.com"
              value={customWebsite}
              onChange={(e) => setCustomWebsite(e.target.value)}
              className="bg-white/5 border-white/20 text-white"
            />
            <Button 
              onClick={addCustomWebsite}
              variant="outline"
              size="sm"
              disabled={!customWebsite}
            >
              Add
            </Button>
          </div>
        </div>

        {/* Search Terms */}
        <div>
          <Label className="text-white text-sm font-medium mb-2 block">
            Search Terms (Optional)
          </Label>
          <Input
            placeholder="film, tv series, commercial (comma-separated)"
            value={searchTerms}
            onChange={(e) => setSearchTerms(e.target.value)}
            className="bg-white/5 border-white/20 text-white"
          />
          <p className="text-white/50 text-xs mt-1">
            Leave empty to scrape all available opportunities
          </p>
        </div>

        {/* Selected Websites Display */}
        {selectedWebsites.length > 0 && (
          <div>
            <Label className="text-white text-sm font-medium mb-2 block">
              Selected Websites ({selectedWebsites.length})
            </Label>
            <div className="flex flex-wrap gap-2">
              {selectedWebsites.map((url) => (
                <Badge 
                  key={url} 
                  variant="secondary" 
                  className="bg-purple-500/20 text-purple-300 border-purple-500/30"
                >
                  <Globe className="h-3 w-3 mr-1" />
                  {new URL(url).hostname.replace('www.', '')}
                  <button
                    onClick={() => setSelectedWebsites(prev => prev.filter(u => u !== url))}
                    className="ml-2 text-purple-200 hover:text-white"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Progress */}
        {isScrapingInProgress && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-white">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="text-sm">Scraping websites...</span>
            </div>
            <Progress value={33} className="w-full" />
            <p className="text-white/60 text-xs">
              This may take several minutes depending on the number of websites
            </p>
          </div>
        )}

        {/* Last Result */}
        {lastResult && !isScrapingInProgress && (
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-white font-medium mb-2">Last Scraping Result</h4>
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
          </div>
        )}

        {/* Start Scraping Button */}
        <Button 
          onClick={startScraping}
          disabled={selectedWebsites.length === 0 || isScrapingInProgress}
          className="w-full bg-purple-600 hover:bg-purple-700"
          size="lg"
        >
          {isScrapingInProgress ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Scraping in Progress...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Start Scraping ({selectedWebsites.length} websites)
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default JobScrapingManager;
