
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { adminService } from "@/services/adminService";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, UserCheck, Shield } from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role?: string;
  created_at: string;
}

const UserRoleManager = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");

  const roleOptions = [
    { value: "all", label: "All Roles" },
    { value: "admin", label: "Admin" },
    { value: "moderator", label: "Moderator" },
    { value: "course_provider", label: "Course Provider" },
    { value: "premium_user", label: "Premium User" },
    { value: "basic_user", label: "Basic User" }
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, selectedRole]);

  const loadUsers = async () => {
    try {
      console.log('=== Starting comprehensive user data fetch ===');
      
      // Get ALL users from auth.users table via our new RPC function
      console.log('Attempting to fetch all auth users...');
      const { data: authUsers, error: authError } = await supabase
        .rpc('get_all_users');
      
      if (authError) {
        console.log('RPC call failed, falling back to profiles/roles approach:', authError);
        await loadUsersFromTablesOnly();
        return;
      }

      console.log('Auth users found:', authUsers?.length || 0);

      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      console.log('Profiles query result:', { profiles: profiles?.length || 0, profilesError });
      
      // Get all user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      console.log('User roles query result:', { userRoles: userRoles?.length || 0, rolesError });

      // Combine all data
      const allUsers: UserProfile[] = [];

      if (authUsers && Array.isArray(authUsers) && authUsers.length > 0) {
        authUsers.forEach((authUser: any) => {
          const profile = profiles?.find(p => p.id === authUser.id);
          const userRole = userRoles?.find(r => r.user_id === authUser.id);
          
          allUsers.push({
            id: authUser.id,
            name: profile?.name || authUser.email?.split('@')[0] || 'Unknown User',
            email: authUser.email || 'No email available',
            created_at: authUser.created_at || new Date().toISOString(),
            role: userRole?.role || 'basic_user'
          });
        });
      } else {
        // Fallback to existing approach
        await loadUsersFromTablesOnly();
        return;
      }

      console.log('=== Final comprehensive user list ===');
      console.log(`Total users found: ${allUsers.length}`);
      console.log('Users:', allUsers);
      
      setUsers(allUsers);
    } catch (error) {
      console.error('Error in comprehensive user loading:', error);
      await loadUsersFromTablesOnly();
    } finally {
      setLoading(false);
    }
  };

  const loadUsersFromTablesOnly = async () => {
    try {
      console.log('=== Fallback: Loading users from tables only ===');
      
      // Get ALL profiles without any filters
      console.log('Fetching all profiles...');
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      console.log('Profiles query result:', { profiles: profiles?.length || 0, profilesError });
      
      // Get ALL user roles without any filters
      console.log('Fetching all user roles...');
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      console.log('User roles query result:', { userRoles: userRoles?.length || 0, rolesError });

      // Create a comprehensive user list
      const userMap = new Map<string, UserProfile>();

      // Add users from profiles
      if (profiles && profiles.length > 0) {
        profiles.forEach(profile => {
          userMap.set(profile.id, {
            id: profile.id,
            name: profile.name || 'Unknown User',
            email: profile.email || 'No email available',
            created_at: profile.created_at || new Date().toISOString(),
            role: 'basic_user' // Default role
          });
        });
      }

      // Add/update users from user_roles
      if (userRoles && userRoles.length > 0) {
        userRoles.forEach(userRole => {
          const existingUser = userMap.get(userRole.user_id);
          if (existingUser) {
            // Update existing user with role
            existingUser.role = userRole.role;
          } else {
            // Create new user entry from role data
            userMap.set(userRole.user_id, {
              id: userRole.user_id,
              name: 'User (No Profile)',
              email: 'No email available',
              created_at: new Date().toISOString(),
              role: userRole.role
            });
          }
        });
      }

      const allUsers = Array.from(userMap.values());

      console.log('=== Final user list (tables only) ===');
      console.log(`Total users found: ${allUsers.length}`);
      console.log('Users:', allUsers);
      
      if (allUsers.length === 0) {
        console.warn('No users found in either profiles or user_roles tables');
        toast({
          title: "No Users Found",
          description: "No users were found in the database. This might be due to RLS policies or missing data.",
          variant: "destructive"
        });
      }

      setUsers(allUsers);
    } catch (error) {
      console.error('Error in fallback user loading:', error);
      toast({
        title: "Error",
        description: "Failed to load users.",
        variant: "destructive"
      });
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRole !== "all") {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    setFilteredUsers(filtered);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await adminService.assignRole(userId, newRole as any);
      toast({
        title: "Role Updated",
        description: "User role has been updated successfully."
      });
      loadUsers(); // Reload to show updated roles
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive"
      });
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'moderator': return 'default';
      case 'course_provider': return 'default';
      case 'premium_user': return 'secondary';
      default: return 'outline';
    }
  };

  const getRoleIcon = (role: string) => {
    return role === 'admin' || role === 'moderator' || role === 'course_provider' ? Shield : UserCheck;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">User Role Management</h2>
        <p className="text-gray-300">Manage user permissions and access levels</p>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700/50 border-gray-600 text-white"
                />
              </div>
            </div>
            <div className="w-48">
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Debug Info */}
      <Card className="bg-gray-800/50 border-gray-700/50">
        <CardContent className="p-4">
          <div className="text-sm text-gray-400">
            Debug: Found {users.length} total users, showing {filteredUsers.length} after filters
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Expected: 4 users in Supabase auth table
          </div>
          <Button 
            onClick={loadUsers} 
            variant="outline" 
            size="sm" 
            className="mt-2"
          >
            Refresh Users
          </Button>
        </CardContent>
      </Card>

      {/* Users List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="text-white">Loading users...</div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <Card className="bg-gray-800/50 border-gray-700/50">
          <CardContent className="text-center py-8">
            <p className="text-gray-300">No users found matching your criteria.</p>
            <p className="text-gray-500 text-sm mt-2">
              Total users loaded: {users.length} (Expected: 4)
            </p>
            <p className="text-gray-500 text-xs mt-1">
              This might be due to RLS policies limiting access to user data.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredUsers.map((user) => {
            const RoleIcon = getRoleIcon(user.role || 'basic_user');
            return (
              <Card key={user.id} className="bg-gray-800/50 border-gray-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                        <RoleIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{user.name}</h3>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                        <p className="text-gray-500 text-xs">ID: {user.id}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Badge variant={getRoleBadgeVariant(user.role || 'basic_user')}>
                        {user.role?.replace('_', ' ').toUpperCase() || 'BASIC USER'}
                      </Badge>
                      
                      <Select
                        value={user.role || 'basic_user'}
                        onValueChange={(newRole) => handleRoleChange(user.id, newRole)}
                      >
                        <SelectTrigger className="w-40 bg-gray-700/50 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic_user">Basic User</SelectItem>
                          <SelectItem value="premium_user">Premium User</SelectItem>
                          <SelectItem value="course_provider">Course Provider</SelectItem>
                          <SelectItem value="moderator">Moderator</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-gray-500">
                    Joined: {new Date(user.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserRoleManager;
