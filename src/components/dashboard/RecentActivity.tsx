
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface RecentActivityProps {
  recentActivity: any[];
}

const RecentActivity = ({ recentActivity }: RecentActivityProps) => {
  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div>
                  <div className="text-white font-medium">{activity.title}</div>
                  <div className="text-gray-300 text-sm">{activity.time}</div>
                </div>
              </div>
              <Badge variant="outline" className="text-gray-300 border-gray-500">
                {activity.status}
              </Badge>
            </div>
          )) : (
            <div className="text-center text-gray-400 py-8">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No recent activity yet</p>
              <p className="text-sm">Complete your signup to start your journey!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
