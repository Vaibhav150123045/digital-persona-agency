
import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Bell, ChevronDown, Plus, Shield, User, Settings } from "lucide-react";

interface Notification {
  id: number;
  type: string;
  message: string;
  time: string;
  read: boolean;
}

interface DisplayProfile {
  name: string;
  email: string;
  role: string;
  location: string;
  actorType?: string;
  favoriteGenres: string[];
  joinDate: string;
  profileCompletion: number;
  rating: number;
  totalEarnings: number;
  activeAuditions: number;
  completedProjects: number;
  isNewUser: boolean;
  profilePicture?: File | null | string;
}

interface DashboardHeaderProps {
  displayProfile: DisplayProfile;
  user: any;
  userProfile: any;
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  onLogout: () => void;
  onShowSignupPrompt: () => void;
  userRole?: string;
  isAdmin?: boolean;
}

const DashboardHeader = ({ 
  displayProfile, 
  user, 
  userProfile, 
  notifications, 
  setNotifications, 
  onLogout, 
  onShowSignupPrompt,
  userRole = 'basic_user',
  isAdmin = false
}: DashboardHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({ ...notification, read: true }));
    setNotifications(updatedNotifications);
  };

  const unreadNotifications = notifications.filter(notification => !notification.read).length;

  // Handle profile picture URL - could be base64 string or File object
  const profilePictureUrl = displayProfile.profilePicture 
    ? (typeof displayProfile.profilePicture === 'string' 
        ? displayProfile.profilePicture // base64 string
        : URL.createObjectURL(displayProfile.profilePicture)) // File object
    : null;

  return (
    <header className="bg-slate-900/50 backdrop-blur-sm border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              spais Agency
            </h1>
            {isAdmin && (
              <Badge variant="destructive" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                ADMIN
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors">
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-spais-purple-500 rounded-full border-2 border-slate-900 shadow-lg"></div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                {notifications.length === 0 ? (
                  <DropdownMenuItem disabled>No notifications</DropdownMenuItem>
                ) : (
                  notifications.map(notification => (
                    <DropdownMenuItem key={notification.id} className={notification.read ? "opacity-50" : ""}>
                      {notification.message}
                      <div className="ml-auto text-xs text-gray-400">{notification.time}</div>
                    </DropdownMenuItem>
                  ))
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={markAllAsRead}>Mark all as read</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 data-[state=open]:bg-muted">
                  <Avatar className="h-8 w-8">
                    {profilePictureUrl ? (
                      <AvatarImage src={profilePictureUrl} alt={displayProfile.name} />
                    ) : null}
                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-600 text-white">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{displayProfile.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
