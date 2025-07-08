import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { getOnboardingSessionId, clearOnboardingSession } from "@/utils/onboardingSession";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProfileOverview from "@/components/dashboard/ProfileOverview";
import AIInsights from "@/components/dashboard/AIInsights";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import SignupPrompt from "@/components/dashboard/SignupPrompt";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { BookOpen } from "lucide-react";

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: "welcome", message: "Welcome to spais Agency! Complete your profile to get started.", time: "now", read: false }
  ]);
  const [userRole, setUserRole] = useState<string>('basic_user');
  const [isCourseProvider, setIsCourseProvider] = useState(false);

  // Check for onboarding data if no user is logged in
  useEffect(() => {
    const checkOnboardingData = async () => {
      if (!user) {
        try {
          const sessionId = getOnboardingSessionId();
          const { data, error } = await supabase
            .from('onboarding_sessions')
            .select('*')
            .eq('session_id', sessionId)
            .maybeSingle();

          if (data && !error) {
            console.log("Onboarding data retrieved:", data);
            setOnboardingData(data);
            // Don't clear the onboarding session immediately - keep it until user completes signup
          } else {
            console.log("No onboarding data found, redirecting to home");
            navigate("/");
          }
        } catch (error) {
          console.error('Error checking onboarding data:', error);
          navigate("/");
        } finally {
          setProfileLoading(false);
        }
      }
    };

    if (!loading && !user) {
      checkOnboardingData();
    }
  }, [user, loading, navigate]);

  // Fetch user profile for authenticated users
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          toast({
            title: "Profile Error",
            description: "Could not load your profile data.",
            variant: "destructive"
          });
        } else {
          setUserProfile(data);
          
          const newNotifications = [];
          if (!data.onboarding_completed) {
            newNotifications.push({
              id: Date.now(),
              type: "onboarding",
              message: "Complete your onboarding to unlock all features",
              time: "now",
              read: false
            });
          }
          if (!data.signup_completed) {
            newNotifications.push({
              id: Date.now() + 1,
              type: "signup",
              message: "Complete your account setup",
              time: "now",
              read: false
            });
          }
          setNotifications(newNotifications);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setProfileLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user, toast]);

  const checkUserRole = async () => {
    if (user) {
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (!error && data && data.length > 0) {
          // Get the highest privilege role
          const roles = data.map(r => r.role);
          if (roles.includes('admin')) {
            setUserRole('admin');
          } else if (roles.includes('moderator')) {
            setUserRole('moderator');
          } else if (roles.includes('course_provider')) {
            setUserRole('course_provider');
            setIsCourseProvider(true);
          } else if (roles.includes('premium_user')) {
            setUserRole('premium_user');
          } else {
            setUserRole('basic_user');
          }
          
          // Check if user is also a course provider
          setIsCourseProvider(roles.includes('course_provider'));
        }
      } catch (error) {
        console.error('Error checking user role:', error);
      }
    }
  };

  useEffect(() => {
    checkUserRole();
  }, [user]);

  const isAdmin = userRole === 'admin' || userRole === 'moderator';
  const isPremiumUser = userRole === 'premium_user' || isAdmin;

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out."
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Logout Error",
        description: "There was an error logging you out.",
        variant: "destructive"
      });
    }
  };

  const handleSignupComplete = () => {
    setShowSignupPrompt(false);
    // Don't navigate anywhere - just hide the prompt and stay on dashboard
  };

  const isFeatureLocked = (user: any, userProfile: any) => {
    if (isAdmin) return false; // Admins have access to everything
    if (isPremiumUser) return false; // Premium users have access to most features
    return !user || !userProfile?.signup_completed;
  };

  // New function specifically for chat access - more permissive
  const isChatLocked = (user: any, userProfile: any, onboardingData: any) => {
    if (isAdmin) return false; // Admins have access to everything
    if (isPremiumUser) return false; // Premium users have access to most features
    
    // Allow chat access if user has completed onboarding (even without full signup)
    if (onboardingData && onboardingData.name && onboardingData.email) return false;
    if (user && userProfile) return false; // Any authenticated user with profile
    
    return true; // Lock chat for users with no onboarding data
  };

  const showLockedFeature = () => {
    toast({
      title: "Feature Locked",
      description: "Please complete your signup to access this feature.",
      variant: "default"
    });
    if (!user && onboardingData) {
      setShowSignupPrompt(true);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Admin has access to everything
    if (isAdmin) return;
    
    // Special handling for chat - use the more permissive chat lock function
    if (value === "chat") {
      if (isChatLocked(user, userProfile, onboardingData)) {
        showLockedFeature();
        return;
      }
      return; // Allow chat access
    }
    
    // For all other tabs, use the regular feature lock (including agent tab)
    const lockedTabs = ["opportunities", "assets", "search", "courses", "referrals", "agent"];
    if (lockedTabs.includes(value) && isFeatureLocked(user, userProfile)) {
      showLockedFeature();
      return;
    }
  };

  const handleChatClick = () => {
    if (isChatLocked(user, userProfile, onboardingData)) {
      showLockedFeature();
    } else {
      setActiveTab("chat");
    }
  };

  // Helper function to convert base64 to displayable image
  const getProfilePictureUrl = (pictureBase64: string | null) => {
    if (!pictureBase64) return null;
    return pictureBase64; // base64 strings can be used directly as src
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Only show signup prompt when explicitly requested (not automatically)
  if (showSignupPrompt && onboardingData) {
    return <SignupPrompt userEmail={onboardingData.email} onSignupComplete={handleSignupComplete} />;
  }

  // Allow access to dashboard if user has onboarding data (even without being logged in)
  if (!user && !onboardingData) {
    return null;
  }

  const displayProfile = user && userProfile ? {
    name: userProfile.name || "User",
    email: userProfile.email || user.email,
    role: userProfile.role || "Actor",
    location: userProfile.location || "Los Angeles, CA",
    actorType: userProfile.actor_type,
    favoriteGenres: userProfile.favorite_genres || [],
    joinDate: new Date(userProfile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    profileCompletion: userProfile.onboarding_completed ? 85 : 45,
    rating: 0,
    totalEarnings: 0,
    activeAuditions: 0,
    completedProjects: 0,
    isNewUser: !userProfile.onboarding_completed,
    profilePicture: null // No picture for authenticated users yet
  } : onboardingData ? {
    name: onboardingData.name,
    email: onboardingData.email,
    role: "Actor",
    location: onboardingData.location || "Los Angeles, CA",
    actorType: onboardingData.actor_type,
    favoriteGenres: onboardingData.favorite_genres || [],
    joinDate: "Just joined",
    profileCompletion: 75,
    rating: 0,
    totalEarnings: 0,
    activeAuditions: 0,
    completedProjects: 0,
    isNewUser: true,
    profilePicture: onboardingData.picture_base64 || null // Use the base64 string from database
  } : null;

  if (!displayProfile) {
    return null;
  }

  const recentActivity = displayProfile.isNewUser ? [
    { type: "welcome", title: "Welcome to spais Agency!", status: "Getting Started", time: "Just now" }
  ] : [
    { type: "audition", title: "Netflix Series Lead Role", status: "Submitted", time: "2 hours ago" },
    { type: "booking", title: "Commercial Shoot", status: "Confirmed", time: "1 day ago" }
  ];

  const upcomingAuditions = displayProfile.isNewUser ? [] : [
    { title: "HBO Drama Series", role: "Supporting Character", date: "Dec 2, 2024", type: "In-Person" },
    { title: "Independent Film", role: "Lead Role", date: "Dec 5, 2024", type: "Self-Tape" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <DashboardHeader
        displayProfile={displayProfile}
        user={user}
        userProfile={userProfile}
        notifications={notifications}
        setNotifications={setNotifications}
        onLogout={handleLogout}
        onShowSignupPrompt={() => setShowSignupPrompt(true)}
        userRole={userRole}
        isAdmin={isAdmin}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Admin Quick Access */}
        {isAdmin && (
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-purple-800/30 to-pink-800/30 border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Admin Access</h3>
                      <p className="text-gray-300 text-sm">Manage content and user permissions</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => navigate('/admin')}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    Open Admin Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Course Provider Quick Access */}
        {isCourseProvider && (
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-blue-800/30 to-cyan-800/30 border-blue-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Course Provider Access</h3>
                      <p className="text-gray-300 text-sm">Manage your courses and student enrollments</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => navigate('/course-provider')}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  >
                    Open Course Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <ProfileOverview displayProfile={displayProfile} />
          <AIInsights displayProfile={displayProfile} />
        </div>

        <DashboardTabs 
          activeTab={activeTab}
          onTabChange={handleTabChange}
          isFeatureLocked={isFeatureLocked(user, userProfile)}
          isChatLocked={isChatLocked(user, userProfile, onboardingData)}
          onShowLockedFeature={showLockedFeature}
          displayProfile={displayProfile}
          recentActivity={recentActivity}
          upcomingAuditions={upcomingAuditions}
          userRole={userRole}
          isPremiumUser={isPremiumUser}
        />
      </div>
    </div>
  );
};

export default Dashboard;
