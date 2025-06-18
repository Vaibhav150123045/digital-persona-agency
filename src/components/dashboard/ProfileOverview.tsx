
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";

interface ProfileOverviewProps {
  displayProfile: any;
}

const ProfileOverview = ({ displayProfile }: ProfileOverviewProps) => {
  return (
    <Card className="lg:col-span-2 bg-white/5 backdrop-blur-sm border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-white">{displayProfile.name}</CardTitle>
            <CardDescription className="text-gray-300">
              {displayProfile.role} • {displayProfile.location} • {displayProfile.joinDate}
            </CardDescription>
            {displayProfile.actorType && (
              <div className="mt-2">
                <Badge variant="outline" className="text-blue-400 border-blue-400 mr-2">
                  {displayProfile.actorType}
                </Badge>
                {displayProfile.favoriteGenres.map((genre: string) => (
                  <Badge key={genre} variant="outline" className="text-purple-400 border-purple-400 mr-1 mb-1">
                    {genre}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
            <span className="text-white font-bold">{displayProfile.rating}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Profile Completion</span>
              <span className="text-white font-medium">{displayProfile.profileCompletion}%</span>
            </div>
            <Progress value={displayProfile.profileCompletion} className="h-2" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">${displayProfile.totalEarnings.toLocaleString()}</div>
              <div className="text-sm text-gray-300">Total Earnings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{displayProfile.activeAuditions}</div>
              <div className="text-sm text-gray-300">Active Auditions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{displayProfile.completedProjects}</div>
              <div className="text-sm text-gray-300">Completed Projects</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileOverview;
