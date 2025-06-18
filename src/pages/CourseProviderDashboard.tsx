
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { courseProviderService, type CourseProviderProfile } from "@/services/courseProviderService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, DollarSign, TrendingUp, Plus, ArrowLeft } from "lucide-react";
import CourseProviderOverview from "@/components/course-provider/CourseProviderOverview";
import CoursesManager from "@/components/course-provider/CoursesManager";
import EnrollmentsManager from "@/components/course-provider/EnrollmentsManager";
import ProviderProfileManager from "@/components/course-provider/ProviderProfileManager";

const CourseProviderDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [providerProfile, setProviderProfile] = useState<CourseProviderProfile | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    checkAuthorization();
  }, [user, loading]);

  const checkAuthorization = async () => {
    if (loading) return;

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access the course provider dashboard.",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    try {
      const isCourseProvider = await courseProviderService.isCourseProvider();
      
      if (!isCourseProvider) {
        toast({
          title: "Access Denied",
          description: "You don't have course provider permissions.",
          variant: "destructive"
        });
        navigate("/dashboard");
        return;
      }

      setIsAuthorized(true);
      
      // Load provider profile
      const profile = await courseProviderService.getProviderProfile();
      setProviderProfile(profile);
      
    } catch (error) {
      console.error('Error checking authorization:', error);
      toast({
        title: "Error",
        description: "Failed to verify permissions.",
        variant: "destructive"
      });
      navigate("/dashboard");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleProfileUpdate = (updatedProfile: CourseProviderProfile) => {
    setProviderProfile(updatedProfile);
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-spais-purple-500 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-spais-purple-500 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/dashboard")}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">Course Provider Dashboard</h1>
                <p className="text-gray-300">
                  {providerProfile?.company_name || user?.email}
                  {providerProfile?.verified && (
                    <Badge variant="secondary" className="ml-2">Verified</Badge>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white/5 border-white/10 mb-8">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/10">
              <TrendingUp className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="courses" className="data-[state=active]:bg-white/10">
              <BookOpen className="h-4 w-4 mr-2" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="enrollments" className="data-[state=active]:bg-white/10">
              <Users className="h-4 w-4 mr-2" />
              Enrollments
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-white/10">
              <DollarSign className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <CourseProviderOverview />
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <CoursesManager />
          </TabsContent>

          <TabsContent value="enrollments" className="space-y-6">
            <EnrollmentsManager />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <ProviderProfileManager 
              profile={providerProfile}
              onProfileUpdate={handleProfileUpdate}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CourseProviderDashboard;
