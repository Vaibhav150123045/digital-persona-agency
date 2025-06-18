
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video, MapPin, Plus } from "lucide-react";

const CalendarComponent = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const events = [
    {
      id: 1,
      title: "Self-Tape Deadline",
      type: "deadline",
      date: "2024-12-02",
      time: "11:59 PM",
      project: "Netflix Drama Series",
      location: "Self-Tape"
    },
    {
      id: 2,
      title: "Live Audition",
      type: "audition",
      date: "2024-12-03",
      time: "2:00 PM",
      project: "HBO Series",
      location: "Casting Office - Beverly Hills"
    },
    {
      id: 3,
      title: "Strategy Call",
      type: "meeting",
      date: "2024-12-05",
      time: "10:00 AM",
      project: "Career Planning",
      location: "Video Call"
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "deadline": return "text-red-400 border-red-400";
      case "audition": return "text-blue-400 border-blue-400";
      case "meeting": return "text-green-400 border-green-400";
      default: return "text-gray-400 border-gray-400";
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "deadline": return <Clock className="h-4 w-4" />;
      case "audition": return <Video className="h-4 w-4" />;
      case "meeting": return <Calendar className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-white flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Integrated Calendar
              </CardTitle>
              <CardDescription className="text-gray-300">
                Self-tape deadlines, live auditions, and strategy calls
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="text-white border-white/20">
                Sync Google Calendar
              </Button>
              <Button variant="outline" size="sm" className="text-white border-white/20">
                Sync Outlook
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mini Calendar */}
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-medium mb-4">December 2024</h3>
              <div className="grid grid-cols-7 gap-1 text-xs text-gray-400 mb-2">
                <div className="text-center p-1">Sun</div>
                <div className="text-center p-1">Mon</div>
                <div className="text-center p-1">Tue</div>
                <div className="text-center p-1">Wed</div>
                <div className="text-center p-1">Thu</div>
                <div className="text-center p-1">Fri</div>
                <div className="text-center p-1">Sat</div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-sm">
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <div
                    key={day}
                    className={`text-center p-2 rounded cursor-pointer transition-colors ${
                      day === 2 || day === 3 || day === 5
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="lg:col-span-2">
              <h3 className="text-white font-medium mb-4">Upcoming Events</h3>
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getEventIcon(event.type)}
                        <div>
                          <div className="text-white font-medium">{event.title}</div>
                          <div className="text-gray-300 text-sm">{event.project}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className={getEventTypeColor(event.type)}>
                        {event.type}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarComponent;
