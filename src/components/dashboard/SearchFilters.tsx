
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Calendar, MapPin, DollarSign, Star } from "lucide-react";

const SearchFilters = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const mockOpportunities = [
    {
      id: 1,
      title: "Lead Role - Sci-Fi Series",
      platform: "Netflix",
      roleType: "Lead",
      location: "Los Angeles, CA",
      deadline: "Dec 10, 2024",
      rate: "$2,500/day",
      status: "Open",
      match: 95
    },
    {
      id: 2,
      title: "Supporting Character - Drama Film",
      platform: "HBO Max",
      roleType: "Supporting",
      location: "New York, NY",
      deadline: "Dec 8, 2024",
      rate: "$1,800/day",
      status: "Urgent",
      match: 88
    },
    {
      id: 3,
      title: "Guest Star - Comedy Series",
      platform: "Apple TV+",
      roleType: "Guest Star",
      location: "Atlanta, GA",
      deadline: "Dec 15, 2024",
      rate: "$1,200/day",
      status: "Open",
      match: 82
    },
    {
      id: 4,
      title: "Recurring Role - Mystery Series",
      platform: "Amazon Prime",
      roleType: "Recurring",
      location: "Vancouver, BC",
      deadline: "Dec 12, 2024",
      rate: "$1,500/day",
      status: "Closing Soon",
      match: 91
    }
  ];

  const filterOptions = {
    platforms: ["Netflix", "HBO Max", "Apple TV+", "Amazon Prime", "Disney+", "Hulu"],
    roleTypes: ["Lead", "Supporting", "Guest Star", "Recurring", "Background", "Featured"],
    locations: ["Los Angeles, CA", "New York, NY", "Atlanta, GA", "Vancouver, BC", "Chicago, IL"],
    statuses: ["Open", "Urgent", "Closing Soon", "New"]
  };

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "text-green-400 border-green-400";
      case "Urgent": return "text-red-400 border-red-400";
      case "Closing Soon": return "text-yellow-400 border-yellow-400";
      case "New": return "text-blue-400 border-blue-400";
      default: return "text-gray-400 border-gray-400";
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "Netflix": return "text-red-400 border-red-400";
      case "HBO Max": return "text-purple-400 border-purple-400";
      case "Apple TV+": return "text-blue-400 border-blue-400";
      case "Amazon Prime": return "text-orange-400 border-orange-400";
      default: return "text-gray-400 border-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardContent className="p-4">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search opportunities by title, platform, role type..."
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-white font-medium mb-2">Platform</h4>
            <div className="flex flex-wrap gap-2">
              {filterOptions.platforms.map((platform) => (
                <Button
                  key={platform}
                  variant="outline"
                  size="sm"
                  className={`${
                    activeFilters.includes(platform)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "text-gray-800 bg-white border-gray-300 hover:bg-gray-100"
                  }`}
                  onClick={() => toggleFilter(platform)}
                >
                  {platform}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium mb-2">Role Type</h4>
            <div className="flex flex-wrap gap-2">
              {filterOptions.roleTypes.map((roleType) => (
                <Button
                  key={roleType}
                  variant="outline"
                  size="sm"
                  className={`${
                    activeFilters.includes(roleType)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "text-gray-800 bg-white border-gray-300 hover:bg-gray-100"
                  }`}
                  onClick={() => toggleFilter(roleType)}
                >
                  {roleType}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium mb-2">Location</h4>
            <div className="flex flex-wrap gap-2">
              {filterOptions.locations.map((location) => (
                <Button
                  key={location}
                  variant="outline"
                  size="sm"
                  className={`${
                    activeFilters.includes(location)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "text-gray-800 bg-white border-gray-300 hover:bg-gray-100"
                  }`}
                  onClick={() => toggleFilter(location)}
                >
                  {location}
                </Button>
              ))}
            </div>
          </div>

          {activeFilters.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-white text-sm">Active filters:</span>
              {activeFilters.map((filter) => (
                <Badge key={filter} variant="outline" className="text-blue-400 border-blue-400">
                  {filter}
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveFilters([])}
                className="text-red-400"
              >
                Clear All
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Search Results</CardTitle>
          <p className="text-gray-300 text-sm">{mockOpportunities.length} opportunities found</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockOpportunities.map((opportunity) => (
              <Card key={opportunity.id} className="bg-white/5 border-white/20">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-white font-medium">{opportunity.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className={getPlatformColor(opportunity.platform)}>
                          {opportunity.platform}
                        </Badge>
                        <Badge variant="outline" className="text-purple-400 border-purple-400">
                          {opportunity.roleType}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(opportunity.status)}>
                          {opportunity.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-white font-medium">{opportunity.match}% match</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-gray-300">
                      <MapPin className="h-4 w-4" />
                      <span>{opportunity.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Calendar className="h-4 w-4" />
                      <span>{opportunity.deadline}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <DollarSign className="h-4 w-4" />
                      <span>{opportunity.rate}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Apply Now
                    </Button>
                    <Button variant="outline" size="sm" className="text-gray-800 bg-white border-gray-300 hover:bg-gray-100">
                      Save for Later
                    </Button>
                    <Button variant="outline" size="sm" className="text-gray-800 bg-white border-gray-300 hover:bg-gray-100">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchFilters;
