
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Bell, Shield, Eye, Trash2, CreditCard, Crown } from "lucide-react";

const Settings = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    profileVisibility: true,
    showOnlineStatus: true
  });

  const [subscription, setSubscription] = useState({
    subscribed: false,
    subscription_tier: null,
    subscription_end: null,
    loading: true
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      checkSubscription();
    }
  }, [user, loading, navigate]);

  const checkSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) {
        console.error('Error checking subscription:', error);
      } else {
        setSubscription({
          subscribed: data.subscribed || false,
          subscription_tier: data.subscription_tier,
          subscription_end: data.subscription_end,
          loading: false
        });
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscription(prev => ({ ...prev, loading: false }));
    }
  };

  const handleUpgrade = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout');
      if (error) {
        toast({
          title: "Checkout Error",
          description: error.message,
          variant: "destructive"
        });
      } else if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      toast({
        title: "Checkout Error",
        description: "Failed to create checkout session.",
        variant: "destructive"
      });
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      if (error) {
        toast({
          title: "Portal Error",
          description: error.message,
          variant: "destructive"
        });
      } else if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      toast({
        title: "Portal Error",
        description: "Failed to open customer portal.",
        variant: "destructive"
      });
    }
  };

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Setting Updated",
      description: "Your preference has been saved."
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account Deletion",
      description: "Account deletion is not available in demo mode.",
      variant: "destructive"
    });
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
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

        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
            <p className="text-gray-300">Manage your account preferences and settings</p>
          </div>

          {/* Billing & Subscription */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-400" />
                <CardTitle className="text-white">Billing & Subscription</CardTitle>
              </div>
              <CardDescription className="text-gray-300">
                Manage your subscription and billing preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {subscription.loading ? (
                <div className="text-gray-400">Loading subscription status...</div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Label className="text-white">Current Plan</Label>
                        {subscription.subscribed && (
                          <Crown className="h-4 w-4 text-yellow-400" />
                        )}
                      </div>
                      <p className="text-sm text-gray-400">
                        {subscription.subscribed 
                          ? `${subscription.subscription_tier || 'Premium'} Plan - Active`
                          : 'Free Plan'
                        }
                      </p>
                      {subscription.subscribed && subscription.subscription_end && (
                        <p className="text-xs text-gray-500">
                          Renews on {new Date(subscription.subscription_end).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {subscription.subscribed ? (
                      <Button
                        variant="outline"
                        onClick={handleManageSubscription}
                        className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                      >
                        Manage Subscription
                      </Button>
                    ) : (
                      <Button
                        onClick={handleUpgrade}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <Crown className="h-4 w-4 mr-2" />
                        Upgrade to Premium
                      </Button>
                    )}
                  </div>
                  <Separator className="bg-white/10" />
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-white">Refresh Subscription Status</Label>
                      <p className="text-sm text-gray-400">Check for recent subscription changes</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={checkSubscription}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                      disabled={subscription.loading}
                    >
                      Refresh Status
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-400" />
                <CardTitle className="text-white">Notifications</CardTitle>
              </div>
              <CardDescription className="text-gray-300">
                Configure how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-white">Email Notifications</Label>
                  <p className="text-sm text-gray-400">Receive notifications via email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                />
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-white">Push Notifications</Label>
                  <p className="text-sm text-gray-400">Receive push notifications in your browser</p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                />
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-white">Marketing Emails</Label>
                  <p className="text-sm text-gray-400">Receive updates about new features and opportunities</p>
                </div>
                <Switch
                  checked={settings.marketingEmails}
                  onCheckedChange={(checked) => handleSettingChange('marketingEmails', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-400" />
                <CardTitle className="text-white">Privacy</CardTitle>
              </div>
              <CardDescription className="text-gray-300">
                Control your privacy and visibility settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-white">Profile Visibility</Label>
                  <p className="text-sm text-gray-400">Make your profile visible to other users</p>
                </div>
                <Switch
                  checked={settings.profileVisibility}
                  onCheckedChange={(checked) => handleSettingChange('profileVisibility', checked)}
                />
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-white">Show Online Status</Label>
                  <p className="text-sm text-gray-400">Let others see when you're online</p>
                </div>
                <Switch
                  checked={settings.showOnlineStatus}
                  onCheckedChange={(checked) => handleSettingChange('showOnlineStatus', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Account */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-400" />
                <CardTitle className="text-white">Account</CardTitle>
              </div>
              <CardDescription className="text-gray-300">
                Manage your account and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-white">Sign Out</Label>
                  <p className="text-sm text-gray-400">Sign out of your account on this device</p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  Sign Out
                </Button>
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-red-400">Delete Account</Label>
                  <p className="text-sm text-gray-400">Permanently delete your account and all data</p>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
