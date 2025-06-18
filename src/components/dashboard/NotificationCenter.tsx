
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bell, X, CheckCircle, AlertCircle, DollarSign } from "lucide-react";

interface Notification {
  id: number;
  type: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationCenterProps {
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
}

const NotificationCenter = ({ notifications, setNotifications }: NotificationCenterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "audition": return <AlertCircle className="h-4 w-4 text-blue-400" />;
      case "booking": return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "referral": return <DollarSign className="h-4 w-4 text-yellow-400" />;
      default: return <Bell className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white relative hover:bg-white/10"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 min-w-[20px] h-5">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-96 p-0 bg-gray-900 border-gray-700 text-white" 
        align="end"
        side="bottom"
        sideOffset={8}
      >
        <div className="p-4 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h3 className="text-white font-medium">Notifications</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-blue-400 hover:text-blue-300 text-xs"
                >
                  Mark All Read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b border-gray-800 hover:bg-gray-800 transition-colors ${
                  !notification.read ? "bg-blue-500/10 border-l-4 border-l-blue-400" : ""
                }`}
              >
                <div className="flex items-start space-x-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">{notification.message}</p>
                    <p className="text-gray-400 text-xs mt-1">{notification.time}</p>
                  </div>
                  <div className="flex space-x-1">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="text-blue-400 hover:text-blue-300 text-xs h-6 px-2"
                      >
                        Read
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeNotification(notification.id)}
                      className="text-gray-400 hover:text-red-400 h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-4 border-t border-gray-700">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Button variant="outline" size="sm" className="text-white border-gray-600 bg-gray-800 hover:bg-gray-700">
                Email Settings
              </Button>
              <Button variant="outline" size="sm" className="text-white border-gray-600 bg-gray-800 hover:bg-gray-700">
                Push Settings
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
