
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  getUsersWithRoles,
  assignRoleToUser,
  removeRoleFromUser
} from "@/lib/supabase/roles";

interface Role {
  id: string;
  name: string;
  description: string;
}

interface UserWithRoles {
  id: string;
  email: string;
  full_name: string;
  roles: Role[];
}

// Hardcoded roles - admin and user
const AVAILABLE_ROLES = [
  { id: 'admin', name: 'admin', description: 'Full system access and administration capabilities' },
  { id: 'user', name: 'user', description: 'Standard user access to approved features' }
];

const RoleManagement = () => {
  const [usersWithRoles, setUsersWithRoles] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const usersData = await getUsersWithRoles();
      setUsersWithRoles(usersData);
    } catch (error) {
      toast.error("Failed to fetch user data");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssignRole = async () => {
    if (!selectedUserId || !selectedRole) {
      toast.error("Please select both a user and a role");
      return;
    }

    try {
      const result = await assignRoleToUser(selectedUserId, selectedRole);
      if (result) {
        toast.success("Role assigned successfully");
        await fetchData();
        setIsAssignDialogOpen(false);
        setSelectedUserId("");
        setSelectedRole("");
      }
    } catch (error) {
      toast.error("Failed to assign role");
      console.error("Error assigning role:", error);
    }
  };

  const handleRemoveRole = async (userId: string, roleId: string) => {
    try {
      const success = await removeRoleFromUser(userId, roleId);
      if (success) {
        toast.success("Role removed successfully");
        await fetchData();
      }
    } catch (error) {
      toast.error("Failed to remove role");
      console.error("Error removing role:", error);
    }
  };

  const getUserRoleDisplay = (user: UserWithRoles) => {
    if (!user.roles || user.roles.length === 0) {
      return <Badge variant="outline">No roles assigned</Badge>;
    }

    return user.roles.map((role) => (
      <Badge 
        key={role.id} 
        variant={role.name === 'admin' ? 'default' : 'secondary'}
        className="mr-1 mb-1"
      >
        <Shield className="h-3 w-3 mr-1" />
        {role.name}
        <button
          className="ml-2 text-xs opacity-70 hover:opacity-100"
          onClick={() => handleRemoveRole(user.id, role.id)}
          title={`Remove ${role.name} role`}
        >
          ✕
        </button>
      </Badge>
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">User Role Assignments</h3>
          <p className="text-sm text-muted-foreground">
            Assign admin or user roles to system users
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Users className="mr-2 h-4 w-4" />
                Assign Role
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Role to User</DialogTitle>
                <DialogDescription>
                  Select a user and assign them either admin or user role
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">User</label>
                  <Select onValueChange={setSelectedUserId} value={selectedUserId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {usersWithRoles.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.full_name || user.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <Select onValueChange={setSelectedRole} value={selectedRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_ROLES.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          <div className="flex items-center">
                            <Shield className="h-4 w-4 mr-2" />
                            <div>
                              <div className="font-medium">{role.name}</div>
                              <div className="text-xs text-muted-foreground">{role.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAssignDialogOpen(false);
                      setSelectedUserId("");
                      setSelectedRole("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAssignRole}>
                    Assign Role
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Role Assignments
          </CardTitle>
          <CardDescription>
            Manage user access levels with admin or user roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          {usersWithRoles.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground">
              No users available in the system.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Assigned Roles</TableHead>
                  <TableHead className="text-right">Quick Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersWithRoles.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium">
                        {user.full_name || 'Unnamed User'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {getUserRoleDisplay(user)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUserId(user.id);
                          setIsAssignDialogOpen(true);
                        }}
                      >
                        Assign Role
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleManagement;
