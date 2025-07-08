
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, User, MapPin, Calendar, Star } from "lucide-react";

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    actor_type: "",
    favorite_genres: []
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      fetchProfile();
    }
  }, [user, loading, navigate]);

  const fetchProfile = async () => {
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
        setFormData({
          name: data.name || "",
          location: data.location || "",
          actor_type: data.actor_type || "",
          favorite_genres: data.favorite_genres || []
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user.id);

      if (error) {
        toast({
          title: "Update Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setUserProfile({ ...userProfile, ...formData });
        setIsEditing(false);
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated."
        });
      }
    } catch (error) {
      toast({
        title: "Update Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    }
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-600 text-white text-2xl">
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-white">{userProfile.name}</CardTitle>
                <CardDescription className="text-gray-300">{userProfile.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-gray-300">
                  <MapPin className="h-4 w-4" />
                  <span>{userProfile.location || "Location not set"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {new Date(userProfile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Star className="h-4 w-4" />
                  <span>{userProfile.actor_type || "Actor type not set"}</span>
                </div>
                {userProfile.favorite_genres && userProfile.favorite_genres.length > 0 && (
                  <div>
                    <Label className="text-white mb-2 block">Favorite Genres</Label>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.favorite_genres.map((genre: string) => (
                        <Badge key={genre} variant="secondary">{genre}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Profile Information</CardTitle>
                    <CardDescription className="text-gray-300">
                      Manage your profile details and preferences
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isEditing ? "Save Changes" : "Edit Profile"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-white">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      disabled={!isEditing}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actor_type" className="text-white">Actor Type</Label>
                  <Input
                    id="actor_type"
                    value={formData.actor_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, actor_type: e.target.value }))}
                    disabled={!isEditing}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    value={userProfile.email}
                    disabled
                    className="bg-white/5 border-white/10 text-gray-400"
                  />
                  <p className="text-xs text-gray-400">Email cannot be changed</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
