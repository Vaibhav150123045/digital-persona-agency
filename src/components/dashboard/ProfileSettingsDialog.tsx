
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  CreditCard, 
  LogOut,
  Camera,
  Edit,
  Mail,
  Phone,
  MapPin
} from "lucide-react";

interface ProfileSettingsDialogProps {
  profile: {
    name: string;
    role: string;
    location: string;
    joinDate: string;
    profileCompletion: number;
    rating: number;
    totalEarnings: number;
    activeAuditions: number;
    completedProjects: number;
  };
  children: React.ReactNode;
}

const ProfileSettingsDialog = ({ profile, children }: ProfileSettingsDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    // In a real app, this would handle actual logout logic
    console.log("Logging out...");
    // For now, just close the dialog
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">Profile Settings</DialogTitle>
          <DialogDescription className="text-gray-300">
            Manage your account settings and preferences
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="profile" className="data-[state=active]:bg-gray-700">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-gray-700">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-gray-700">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="billing" className="data-[state=active]:bg-gray-700">
              <CreditCard className="h-4 w-4 mr-2" />
              Billing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-400 text-white text-2xl">
                        {profile.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-blue-600 hover:bg-blue-700"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white">{profile.name}</h3>
                    <p className="text-gray-300">{profile.role}</p>
                    <Badge variant="outline" className="mt-2 text-green-400 border-green-400">
                      {profile.rating} ⭐ Rating
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Email</p>
                        <p className="text-white">alex.rivera@email.com</p>
                      </div>
                      <Button variant="ghost" size="sm" className="ml-auto">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Phone</p>
                        <p className="text-white">+1 (555) 123-4567</p>
                      </div>
                      <Button variant="ghost" size="sm" className="ml-auto">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Location</p>
                        <p className="text-white">{profile.location}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="ml-auto">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Member Since</p>
                        <p className="text-white">{profile.joinDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                    <p className="text-gray-400 text-sm">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline" className="text-white border-gray-600">
                    Enable
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Privacy Settings</h4>
                    <p className="text-gray-400 text-sm">Control who can see your profile</p>
                  </div>
                  <Button variant="outline" className="text-white border-gray-600">
                    Configure
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Data Export</h4>
                    <p className="text-gray-400 text-sm">Download your account data</p>
                  </div>
                  <Button variant="outline" className="text-white border-gray-600">
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Email Notifications</h4>
                    <p className="text-gray-400 text-sm">Receive updates via email</p>
                  </div>
                  <Button variant="outline" className="text-white border-gray-600">
                    Configure
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Push Notifications</h4>
                    <p className="text-gray-400 text-sm">Browser and mobile notifications</p>
                  </div>
                  <Button variant="outline" className="text-white border-gray-600">
                    Configure
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">SMS Notifications</h4>
                    <p className="text-gray-400 text-sm">Text message alerts</p>
                  </div>
                  <Button variant="outline" className="text-white border-gray-600">
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Billing & Subscription</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-white font-medium">Current Plan: Professional</h4>
                    <Badge className="bg-blue-600">Active</Badge>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">$29/month • Next billing: Jan 15, 2025</p>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="text-white border-gray-600">
                      Change Plan
                    </Button>
                    <Button variant="outline" className="text-white border-gray-600">
                      View Invoices
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-gray-700 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Payment Method</h4>
                  <p className="text-gray-400 text-sm mb-4">•••• •••• •••• 4242 (Expires 12/26)</p>
                  <Button variant="outline" className="text-white border-gray-600">
                    Update Payment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-6 border-t border-gray-700">
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log Out
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="bg-white text-gray-900 border-2 border-white hover:bg-gray-100 px-8 py-4 text-lg">
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSettingsDialog;
