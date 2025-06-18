
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Bell, 
  Calendar, 
  DollarSign, 
  FileText, 
  Star, 
  TrendingUp, 
  User,
  Camera,
  Clock,
  MessageSquare,
  BarChart3,
  Search,
  Kanban,
  Users,
  FolderOpen,
  Sparkles,
  GraduationCap,
  Trophy,
  Target,
  Zap,
  Award,
  Crown,
  Gift
} from "lucide-react";
import CalendarComponent from "@/components/dashboard/CalendarComponent";
import NotificationCenter from "@/components/dashboard/NotificationCenter";
import ChatInterface from "@/components/dashboard/ChatInterface";
import ProfileSnapshot from "@/components/dashboard/ProfileSnapshot";
import AssetLibrary from "@/components/dashboard/AssetLibrary";
import KanbanBoard from "@/components/dashboard/KanbanBoard";
import SearchFilters from "@/components/dashboard/SearchFilters";
import ReferralDashboard from "@/components/dashboard/ReferralDashboard";
import CoursesTab from "@/components/dashboard/CoursesTab";
import ProfileSettingsDialog from "@/components/dashboard/ProfileSettingsDialog";

const DemoDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [notifications] = useState([
    { id: 1, type: "booking", message: "🎉 Congratulations! You've been cast in the Netflix series 'Midnight Chronicles'", time: "2 hours ago", read: false },
    { id: 2, type: "audition", message: "New premium audition match: HBO Max limited series - 95% compatibility", time: "4 hours ago", read: false },
    { id: 3, type: "achievement", message: "🏆 Achievement unlocked: Booked 10 roles this year!", time: "1 day ago", read: false }
  ]);

  // Demo profile for a successful, established actor
  const demoProfile = {
    name: "Alexandra Chen",
    email: "alexandra.chen@example.com",
    role: "Professional Actor",
    location: "Los Angeles, CA",
    actorType: "Both (Stage & Screen)",
    favoriteGenres: ["Drama", "Thriller", "Sci-Fi"],
    joinDate: "January 2022",
    profileCompletion: 100,
    rating: 4.9,
    totalEarnings: 485750,
    activeAuditions: 8,
    completedProjects: 47,
    isNewUser: false,
    membershipLevel: "Platinum Elite",
    agentScore: 98
  };

  const recentActivity = [
    { type: "booking", title: "Netflix Series 'Midnight Chronicles'", status: "BOOKED - $85,000", time: "2 hours ago" },
    { type: "audition", title: "HBO Max Limited Series", status: "Callback Scheduled", time: "1 day ago" },
    { type: "completed", title: "Apple TV+ Commercial", status: "Completed - $12,500", time: "3 days ago" },
    { type: "achievement", title: "10th Booking This Year", status: "Milestone Reached", time: "3 days ago" },
    { type: "negotiation", title: "Warner Bros Feature Film", status: "Contract Negotiated", time: "1 week ago" }
  ];

  const upcomingAuditions = [
    { title: "Marvel Studios Feature Film", role: "Supporting Character", date: "Tomorrow, 2:00 PM", type: "In-Person", priority: "High", fee: "$150,000+" },
    { title: "Amazon Prime Drama Series", role: "Recurring Character", date: "Dec 3, 2024", type: "Self-Tape", priority: "Medium", fee: "$25,000/episode" },
    { title: "Disney+ Original Movie", role: "Lead Supporting", date: "Dec 5, 2024", type: "Zoom", priority: "High", fee: "$75,000" }
  ];

  const careerStats = [
    { label: "Success Rate", value: "87%", trend: "+12%" },
    { label: "Avg. Booking Value", value: "$18,500", trend: "+35%" },
    { label: "Industry Ranking", value: "#247", trend: "+156" },
    { label: "Agent Efficiency", value: "98%", trend: "+8%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Star className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">spais</span>
              <span className="text-sm text-blue-300">Agency</span>
            </div>
            <Badge variant="outline" className="text-green-400 border-green-400">
              AI Active
            </Badge>
            <Badge variant="outline" className="text-orange-400 border-orange-400 bg-orange-400/10">
              DEMO MODE
            </Badge>
            <Badge variant="outline" className="text-purple-400 border-purple-400 bg-purple-400/10">
              <Crown className="h-3 w-3 mr-1" />
              Platinum Elite
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <NotificationCenter notifications={notifications} setNotifications={() => {}} />
            <ProfileSettingsDialog profile={demoProfile}>
              <button className="flex items-center space-x-2 hover:bg-white/10 rounded-lg px-3 py-2 transition-colors cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-gold-400 rounded-full flex items-center justify-center border-2 border-yellow-400">
                  <Crown className="h-4 w-4 text-white" />
                </div>
                <span className="text-white font-medium">{demoProfile.name}</span>
              </button>
            </ProfileSettingsDialog>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="text-white hover:bg-white/10"
            >
              Exit Demo
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Enhanced Profile Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-2 bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-white flex items-center">
                    {demoProfile.name}
                    <Crown className="h-6 w-6 ml-2 text-yellow-400" />
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    {demoProfile.role} • {demoProfile.location} • Member since {demoProfile.joinDate}
                  </CardDescription>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-blue-400 border-blue-400 mr-2">
                      {demoProfile.actorType}
                    </Badge>
                    {demoProfile.favoriteGenres.map((genre: string) => (
                      <Badge key={genre} variant="outline" className="text-purple-400 border-purple-400 mr-1 mb-1">
                        {genre}
                      </Badge>
                    ))}
                    <Badge variant="outline" className="text-yellow-400 border-yellow-400 mr-1 mb-1">
                      <Trophy className="h-3 w-3 mr-1" />
                      Top 1% Performer
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-white font-bold">{demoProfile.rating}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Career Profile</span>
                    <span className="text-green-400 font-medium">Complete</span>
                  </div>
                  <Progress value={demoProfile.profileCompletion} className="h-2" />
                </div>
                
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">${demoProfile.totalEarnings.toLocaleString()}</div>
                    <div className="text-sm text-gray-300">Career Earnings</div>
                    <div className="text-xs text-green-400">+$95K this year</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{demoProfile.activeAuditions}</div>
                    <div className="text-sm text-gray-300">Active Opportunities</div>
                    <div className="text-xs text-blue-400">3 high-priority</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{demoProfile.completedProjects}</div>
                    <div className="text-sm text-gray-300">Total Projects</div>
                    <div className="text-xs text-purple-400">87% success rate</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                AI Performance Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <div className="text-green-400 font-medium text-sm flex items-center">
                  <Trophy className="h-4 w-4 mr-1" />
                  Career Milestone
                </div>
                <div className="text-white text-sm">Your agent negotiated a $85K Netflix role - 40% above market rate!</div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <div className="text-blue-400 font-medium text-sm flex items-center">
                  <Target className="h-4 w-4 mr-1" />
                  Smart Match
                </div>
                <div className="text-white text-sm">3 new premium auditions found with 95%+ compatibility</div>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                <div className="text-purple-400 font-medium text-sm flex items-center">
                  <Award className="h-4 w-4 mr-1" />
                  Industry Impact
                </div>
                <div className="text-white text-sm">Ranked #247 among LA actors - up 156 spots this year</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Career Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {careerStats.map((stat, index) => (
            <Card key={index} className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-300">{stat.label}</div>
                  </div>
                  <div className="text-green-400 text-sm font-medium">{stat.trend}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Dashboard Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/5 border-white/10 flex-wrap">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/10">Overview</TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-white/10">
              <MessageSquare className="h-4 w-4 mr-2" />
              AI Agent Chat
            </TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-white/10">Calendar</TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-white/10">Profile</TabsTrigger>
            <TabsTrigger value="assets" className="data-[state=active]:bg-white/10">Assets</TabsTrigger>
            <TabsTrigger value="kanban" className="data-[state=active]:bg-white/10">Pipeline</TabsTrigger>
            <TabsTrigger value="search" className="data-[state=active]:bg-white/10">Search</TabsTrigger>
            <TabsTrigger value="courses" className="data-[state=active]:bg-white/10">
              <GraduationCap className="h-4 w-4 mr-2" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="referrals" className="data-[state=active]:bg-white/10">Referrals</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Enhanced AI Agent Card */}
            <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm border-blue-300/20 cursor-pointer hover:from-blue-900/30 hover:to-purple-900/30 transition-all"
                  onClick={() => setActiveTab("chat")}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white text-lg font-semibold">Chat with Your Elite AI Agent</h3>
                      <p className="text-blue-200 text-sm">
                        Just negotiated your Netflix deal • Found 3 new premium matches • Available 24/7
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      98% Efficiency
                    </Badge>
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Enhanced Recent Activity */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Recent Career Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            activity.type === 'booking' ? 'bg-green-400' :
                            activity.type === 'audition' ? 'bg-blue-400' :
                            activity.type === 'achievement' ? 'bg-yellow-400' :
                            activity.type === 'completed' ? 'bg-purple-400' :
                            'bg-orange-400'
                          }`}></div>
                          <div>
                            <div className="text-white font-medium">{activity.title}</div>
                            <div className="text-gray-300 text-sm">{activity.time}</div>
                          </div>
                        </div>
                        <Badge variant="outline" className={
                          activity.status.includes('BOOKED') ? 'text-green-400 border-green-400' :
                          activity.status.includes('Callback') ? 'text-blue-400 border-blue-400' :
                          activity.status.includes('Completed') ? 'text-purple-400 border-purple-400' :
                          activity.status.includes('Milestone') ? 'text-yellow-400 border-yellow-400' :
                          'text-orange-400 border-orange-400'
                        }>
                          {activity.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Upcoming Auditions */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Premium Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingAuditions.map((audition, index) => (
                      <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-white font-medium">{audition.title}</div>
                          <div className="flex space-x-2">
                            <Badge variant="outline" className={
                              audition.priority === 'High' ? 'text-red-400 border-red-400' : 'text-blue-400 border-blue-400'
                            }>
                              {audition.priority}
                            </Badge>
                            <Badge variant="outline" className="text-blue-400 border-blue-400">
                              {audition.type}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-gray-300 text-sm">{audition.role}</div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="text-gray-400 text-sm">{audition.date}</div>
                          <div className="text-green-400 text-sm font-medium">{audition.fee}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="chat">
            <ChatInterface />
          </TabsContent>

          <TabsContent value="calendar">
            <CalendarComponent />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileSnapshot profile={demoProfile} />
          </TabsContent>

          <TabsContent value="assets">
            <AssetLibrary />
          </TabsContent>

          <TabsContent value="kanban">
            <KanbanBoard />
          </TabsContent>

          <TabsContent value="search">
            <SearchFilters />
          </TabsContent>

          <TabsContent value="courses">
            <CoursesTab />
          </TabsContent>

          <TabsContent value="referrals">
            <ReferralDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DemoDashboard;
