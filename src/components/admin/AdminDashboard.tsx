
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { adminService } from "@/services/adminService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Calendar, BookOpen } from "lucide-react";
import CastingContentManager from "./CastingContentManager";
import CourseContentManager from "./CourseContentManager";
import UserRoleManager from "./UserRoleManager";

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheckLoading, setAdminCheckLoading] = useState(true);
  const [stats, setStats] = useState({
    draftCasting: 0,
    draftCourses: 0,
    publishedCourses: 0
  });

  useEffect(() => {
    const checkAdminAccess = async () => {
      console.log('AdminDashboard: Starting admin check', { 
        authLoading, 
        userId: user?.id,
        timestamp: new Date().toISOString()
      });
      
      // Wait for auth to complete
      if (authLoading) {
        console.log('AdminDashboard: Auth still loading...');
        return;
      }

      // Check if user exists
      if (!user) {
        console.log('AdminDashboard: No user found');
        setIsAdmin(false);
        setAdminCheckLoading(false);
        return;
      }

      try {
        console.log('AdminDashboard: Checking admin status for user:', user.id);
        const adminStatus = await adminService.isAdmin();
        console.log('AdminDashboard: Admin check result:', adminStatus);
        
        setIsAdmin(adminStatus);
        
        if (!adminStatus) {
          console.log('AdminDashboard: User is not admin');
          toast({
            title: "Access Denied",
            description: "You don't have admin permissions to access this area.",
            variant: "destructive"
          });
        } else {
          console.log('AdminDashboard: User has admin access');
        }
      } catch (error) {
        console.error('AdminDashboard: Error checking admin status:', error);
        setIsAdmin(false);
        toast({
          title: "Error",
          description: "Failed to check admin permissions.",
          variant: "destructive"
        });
      } finally {
        setAdminCheckLoading(false);
      }
    };

    checkAdminAccess();
  }, [user, authLoading, toast]);

  useEffect(() => {
    if (isAdmin) {
      loadStats();
    }
  }, [isAdmin]);

  const loadStats = async () => {
    try {
      const [draftCasting, draftCourses, publishedCourses] = await Promise.all([
        adminService.getDraftCastingContent(),
        adminService.getDraftCourseContent(),
        adminService.getPublishedCourseContent()
      ]);

      setStats({
        draftCasting: draftCasting.length,
        draftCourses: draftCourses.length,
        publishedCourses: publishedCourses.length
      });
    } catch (error) {
      console.error('AdminDashboard: Error loading stats:', error);
    }
  };

  // Show loading while checking authentication or admin status
  if (authLoading || adminCheckLoading) {
    console.log('AdminDashboard: Showing loading state', { authLoading, adminCheckLoading });
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading admin dashboard...</div>
      </div>
    );
  }

  // Show authentication required if no user
  if (!user) {
    console.log('AdminDashboard: Showing auth required - no user');
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="bg-gray-800/50 border-red-500/20">
          <CardHeader className="text-center">
            <Shield className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <CardTitle className="text-white">Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-300">Please log in to access the admin dashboard.</p>
            <div className="mt-4 text-xs text-gray-500">
              Debug: No user session found
              <br />Auth Loading: {authLoading ? 'Yes' : 'No'}
              <br />Admin Check Loading: {adminCheckLoading ? 'Yes' : 'No'}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show access denied if user is not admin
  if (!isAdmin) {
    console.log('AdminDashboard: Showing access denied - not admin', { userId: user.id });
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="bg-gray-800/50 border-red-500/20">
          <CardHeader className="text-center">
            <Shield className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <CardTitle className="text-white">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-300">You don't have permission to access the admin dashboard.</p>
            <div className="mt-4 text-xs text-gray-500">
              Debug Info:
              <br />User ID: {user.id}
              <br />Email: {user.email}
              <br />Admin Status: {isAdmin ? 'Yes' : 'No'}
              <br />Auth Loading: {authLoading ? 'Yes' : 'No'}
              <br />Admin Check Loading: {adminCheckLoading ? 'Yes' : 'No'}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  console.log('AdminDashboard: Rendering main dashboard for admin user');

  // Main admin dashboard content
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-300">Manage content and user permissions</p>
          <div className="mt-2 text-xs text-gray-500">
            Logged in as: {user.email} (Admin)
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Draft Casting</CardTitle>
              <Calendar className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.draftCasting}</div>
              <Badge variant="secondary" className="mt-1">Pending Review</Badge>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Draft Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.draftCourses}</div>
              <Badge variant="secondary" className="mt-1">Pending Review</Badge>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Published Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.publishedCourses}</div>
              <Badge variant="outline" className="mt-1">Live</Badge>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">User Management</CardTitle>
              <Users className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">Active</div>
              <Badge variant="outline" className="mt-1">System Ready</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="casting" className="space-y-6">
          <TabsList className="bg-gray-800/50 border-gray-700/50">
            <TabsTrigger value="casting" className="text-gray-300 data-[state=active]:text-white">
              Casting Content
            </TabsTrigger>
            <TabsTrigger value="courses" className="text-gray-300 data-[state=active]:text-white">
              Course Content
            </TabsTrigger>
            <TabsTrigger value="users" className="text-gray-300 data-[state=active]:text-white">
              User Roles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="casting">
            <CastingContentManager onStatsUpdate={loadStats} />
          </TabsContent>

          <TabsContent value="courses">
            <CourseContentManager onStatsUpdate={loadStats} />
          </TabsContent>

          <TabsContent value="users">
            <UserRoleManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
