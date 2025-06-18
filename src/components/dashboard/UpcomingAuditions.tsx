
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface UpcomingAuditionsProps {
  upcomingAuditions: any[];
}

const UpcomingAuditions = ({ upcomingAuditions }: UpcomingAuditionsProps) => {
  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Upcoming Auditions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingAuditions.length > 0 ? upcomingAuditions.map((audition, index) => (
            <div key={index} className="p-3 bg-white/5 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div className="text-white font-medium">{audition.title}</div>
                <Badge variant="outline" className="text-blue-400 border-blue-400">
                  {audition.type}
                </Badge>
              </div>
              <div className="text-gray-300 text-sm">{audition.role}</div>
              <div className="text-gray-400 text-sm">{audition.date}</div>
            </div>
          )) : (
            <div className="text-center text-gray-400 py-8">
              <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No auditions scheduled</p>
              <p className="text-sm">Your AI agent will find opportunities for you!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingAuditions;
