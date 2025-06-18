
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Camera, 
  Users, 
  MapPin, 
  Star, 
  Clock, 
  DollarSign,
  BookOpen,
  Video,
  Mic,
  Sparkles,
  ExternalLink,
  Heart,
  Calendar
} from "lucide-react";

const CoursesTab = () => {
  const [savedItems, setSavedItems] = useState(new Set());

  const toggleSaved = (id: string) => {
    const newSaved = new Set(savedItems);
    if (newSaved.has(id)) {
      newSaved.delete(id);
    } else {
      newSaved.add(id);
    }
    setSavedItems(newSaved);
  };

  const photographers = [
    {
      id: "photo-1",
      name: "Elite Headshots Studio",
      type: "Professional Headshots",
      distance: "2.1 miles away",
      price: "£200",
      rating: 4.9,
      reviews: 127,
      specialties: ["Actor Headshots", "Commercial", "Theatrical"],
      nextAvailable: "Tomorrow 2pm",
      image: "/placeholder.svg",
      featured: true
    },
    {
      id: "photo-2",
      name: "Sarah Chen Photography",
      type: "Lifestyle & Headshots",
      distance: "3.5 miles away",
      price: "£150",
      rating: 4.7,
      reviews: 89,
      specialties: ["Natural Light", "Studio", "Outdoor"],
      nextAvailable: "Dec 3, 10am",
      image: "/placeholder.svg",
      featured: false
    },
    {
      id: "photo-3",
      name: "The Portrait Lab",
      type: "High-End Headshots",
      distance: "4.2 miles away",
      price: "£300",
      rating: 5.0,
      reviews: 56,
      specialties: ["Celebrity", "Executive", "Premium"],
      nextAvailable: "Dec 5, 1pm",
      image: "/placeholder.svg",
      featured: false
    }
  ];

  const coaches = [
    {
      id: "coach-1",
      name: "Method Acting Masterclass",
      instructor: "James Mitchell",
      type: "Acting Technique",
      duration: "8 weeks",
      price: "£450",
      rating: 4.8,
      students: 234,
      level: "Intermediate",
      format: "In-Person + Online",
      nextStart: "Jan 15, 2025"
    },
    {
      id: "coach-2",
      name: "Screen Acting Intensive",
      instructor: "Maria Rodriguez",
      type: "On-Camera Acting",
      duration: "4 weeks",
      price: "£320",
      rating: 4.9,
      students: 156,
      level: "All Levels",
      format: "In-Person",
      nextStart: "Dec 10, 2024"
    },
    {
      id: "coach-3",
      name: "Voice & Speech Workshop",
      instructor: "David Thompson",
      type: "Voice Training",
      duration: "6 weeks",
      price: "£280",
      rating: 4.6,
      students: 98,
      level: "Beginner",
      format: "Online",
      nextStart: "Jan 8, 2025"
    }
  ];

  const workshops = [
    {
      id: "workshop-1",
      name: "Audition Technique Bootcamp",
      organizer: "LA Acting Studio",
      type: "Weekend Workshop",
      duration: "2 days",
      price: "£180",
      date: "Dec 14-15, 2024",
      time: "10am - 4pm",
      spots: "8 spots left",
      level: "All Levels"
    },
    {
      id: "workshop-2",
      name: "Self-Tape Mastery",
      organizer: "Digital Acting Hub",
      type: "Online Workshop",
      duration: "1 day",
      price: "£95",
      date: "Dec 8, 2024",
      time: "2pm - 6pm",
      spots: "12 spots left",
      level: "Beginner"
    },
    {
      id: "workshop-3",
      name: "Shakespeare for Screen",
      organizer: "Classical Acting Collective",
      type: "Intensive Workshop",
      duration: "3 days",
      price: "£350",
      date: "Jan 20-22, 2025",
      time: "9am - 5pm",
      spots: "5 spots left",
      level: "Advanced"
    }
  ];

  return (
    <div className="space-y-6">
      {/* AI Recommendations Header */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-sm border-purple-300/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-white text-xl font-semibold">AI-Recommended Services</h2>
                <p className="text-purple-200 text-sm">Personalized recommendations based on your profile and career goals</p>
              </div>
            </div>
            <Badge variant="outline" className="text-purple-300 border-purple-300">
              Updated 2 hours ago
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Services Tabs */}
      <Tabs defaultValue="photographers" className="space-y-6">
        <TabsList className="bg-white/5 border-white/10">
          <TabsTrigger value="photographers" className="data-[state=active]:bg-white/10">
            <Camera className="h-4 w-4 mr-2" />
            Photographers
          </TabsTrigger>
          <TabsTrigger value="coaches" className="data-[state=active]:bg-white/10">
            <Users className="h-4 w-4 mr-2" />
            Acting Coaches
          </TabsTrigger>
          <TabsTrigger value="workshops" className="data-[state=active]:bg-white/10">
            <BookOpen className="h-4 w-4 mr-2" />
            Workshops
          </TabsTrigger>
        </TabsList>

        <TabsContent value="photographers" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {photographers.map((photographer) => (
              <Card key={photographer.id} className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <CardTitle className="text-white text-lg">{photographer.name}</CardTitle>
                        {photographer.featured && (
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-gray-300">{photographer.type}</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleSaved(photographer.id)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <Heart className={`h-4 w-4 ${savedItems.has(photographer.id) ? 'fill-red-400 text-red-400' : ''}`} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1 text-gray-300">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{photographer.distance}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-300">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm">{photographer.rating}</span>
                        <span className="text-xs">({photographer.reviews})</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">{photographer.price}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {photographer.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline" className="text-xs text-gray-400 border-gray-600">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center space-x-1 text-green-400">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">Next: {photographer.nextAvailable}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Now
                    </Button>
                    <Button variant="outline" size="icon" className="border-white/20 text-white hover:bg-white/10">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="coaches" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {coaches.map((coach) => (
              <Card key={coach.id} className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg mb-1">{coach.name}</CardTitle>
                      <CardDescription className="text-gray-300">by {coach.instructor}</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleSaved(coach.id)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <Heart className={`h-4 w-4 ${savedItems.has(coach.id) ? 'fill-red-400 text-red-400' : ''}`} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">Duration</div>
                      <div className="text-white">{coach.duration}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Level</div>
                      <div className="text-white">{coach.level}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Format</div>
                      <div className="text-white">{coach.format}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Students</div>
                      <div className="text-white">{coach.students}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-gray-300">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm">{coach.rating}</span>
                    </div>
                    <div className="text-white font-bold text-lg">{coach.price}</div>
                  </div>

                  <div className="flex items-center space-x-1 text-green-400">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Starts: {coach.nextStart}</span>
                  </div>

                  <div className="flex space-x-2">
                    <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                      Enroll Now
                    </Button>
                    <Button variant="outline" size="icon" className="border-white/20 text-white hover:bg-white/10">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="workshops" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {workshops.map((workshop) => (
              <Card key={workshop.id} className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg mb-1">{workshop.name}</CardTitle>
                      <CardDescription className="text-gray-300">by {workshop.organizer}</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleSaved(workshop.id)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <Heart className={`h-4 w-4 ${savedItems.has(workshop.id) ? 'fill-red-400 text-red-400' : ''}`} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Type</span>
                      <span className="text-white">{workshop.type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Duration</span>
                      <span className="text-white">{workshop.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Level</span>
                      <span className="text-white">{workshop.level}</span>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-3 space-y-1">
                    <div className="flex items-center space-x-1 text-blue-400">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm font-medium">{workshop.date}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-300">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{workshop.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-orange-400 border-orange-400">
                      {workshop.spots}
                    </Badge>
                    <div className="text-white font-bold text-lg">{workshop.price}</div>
                  </div>

                  <div className="flex space-x-2">
                    <Button className="flex-1 bg-green-600 hover:bg-green-700">
                      Register
                    </Button>
                    <Button variant="outline" size="icon" className="border-white/20 text-white hover:bg-white/10">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CoursesTab;
