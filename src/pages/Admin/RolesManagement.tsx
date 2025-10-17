import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useOrganization } from "@/context/OrganizationContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Plus, Users, Edit, Trash, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { 
  createRole, 
  deleteRole, 
  getRoles, 
  getUsersWithRoles,
  assignRoleToUser,
  removeRoleFromUser,
  updateRole
} from "@/lib/supabase";

// Define the form schema for role creation/editing
const roleFormSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  description: z.string().min(1, "Description is required"),
});

// Define the form schema for assigning roles
const assignRoleFormSchema = z.object({
  userId: z.string().min(1, "User is required"),
  roleId: z.string().min(1, "Role is required"),
});

// Define the form schema for individual user role assignment
const userRoleFormSchema = z.object({
  roleId: z.string().min(1, "Role is required"),
});

type RoleFormValues = z.infer<typeof roleFormSchema>;
type AssignRoleFormValues = z.infer<typeof assignRoleFormSchema>;
type UserRoleFormValues = z.infer<typeof userRoleFormSchema>;

const RolesManagement = () => {
  const { organizationClient } = useOrganization();
  const [roles, setRoles] = useState<any[]>([]);
  const [usersWithRoles, setUsersWithRoles] = useState<any[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentRole, setCurrentRole] = useState<any>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [userAssignDialogStates, setUserAssignDialogStates] = useState<{[key: string]: boolean}>({});
  const [isLoading, setIsLoading] = useState(true);

  const roleForm = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: "",
      description: ""
    }
  });

  const assignRoleForm = useForm<AssignRoleFormValues>({
    resolver: zodResolver(assignRoleFormSchema),
    defaultValues: {
      userId: "",
      roleId: ""
    }
  });

  // Single form for individual user role assignment
  const userRoleForm = useForm<UserRoleFormValues>({
    resolver: zodResolver(userRoleFormSchema),
    defaultValues: {
      roleId: ""
    }
  });

  const [currentUserId, setCurrentUserId] = useState<string>("");

  // Centralized data refresh function
  const refreshData = async () => {
    if (!organizationClient) {
      toast.error("Organization not connected. Please select an organization.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const [rolesData, usersWithRolesData] = await Promise.all([
        getRoles(organizationClient),
        getUsersWithRoles(organizationClient)
      ]);
      setRoles(rolesData);
      setUsersWithRoles(usersWithRolesData);
      toast.success("Data refreshed successfully");
    } catch (error: any) {
      console.error("Error refreshing data:", error);
      
      // Check for specific database function errors
      if (error?.message?.includes('is_admin_secure') || error?.code === 'PGRST202') {
        toast.error("Database functions missing. Please check Admin → Approve Admin page for setup instructions.");
      } else {
        toast.error("Failed to refresh data");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Load roles and users on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await refreshData();
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Calculate users per role
  const calculateUsersPerRole = (roleId: string) => {
    return usersWithRoles.filter(user => 
      user.roles && user.roles.some((role: any) => role.id === roleId)
    ).length;
  };

  // Handle role form submission (create or edit)
  const handleRoleFormSubmit = async (data: RoleFormValues) => {
    if (!organizationClient) {
      toast.error("Organization not connected");
      return;
    }

    try {
      if (isEditMode && currentRole) {
        // Update existing role
        const updatedRole = await updateRole(currentRole.id, data.name, data.description, organizationClient);
        if (updatedRole) {
          toast.success("Role updated successfully");
          await refreshData();
        }
      } else {
        // Create new role
        const newRole = await createRole(data.name, data.description, organizationClient);
        if (newRole) {
          toast.success("Role created successfully");
          await refreshData();
        }
      }
      
      // Reset and close dialog
      roleForm.reset();
      setIsRoleDialogOpen(false);
      setIsEditMode(false);
      setCurrentRole(null);
    } catch (error) {
      toast.error("An error occurred");
      console.error("Error submitting role form:", error);
    }
  };

  // Handle assign role form submission
  const handleAssignRoleSubmit = async (data: AssignRoleFormValues) => {
    if (!organizationClient) {
      toast.error("Organization not connected");
      return;
    }

    try {
      const result = await assignRoleToUser(data.userId, data.roleId, organizationClient);
      
      if (result.isDuplicate) {
        toast.info("User already has this role");
      } else {
        toast.success("Role assigned successfully");
        await refreshData();
      }
      
      // Reset and close dialog
      assignRoleForm.reset();
      setIsAssignDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to assign role");
      console.error("Error assigning role:", error);
    }
  };

  // Handle individual user role assignment
  const handleUserRoleAssignment = async (data: UserRoleFormValues) => {
    if (!organizationClient) {
      toast.error("Organization not connected");
      return;
    }

    try {
      const result = await assignRoleToUser(currentUserId, data.roleId, organizationClient);
      
      if (result.isDuplicate) {
        toast.info("User already has this role");
      } else {
        toast.success("Role assigned successfully");
        await refreshData();
      }
      
      // Close the specific user dialog and reset form
      setUserAssignDialogStates(prev => ({
        ...prev,
        [currentUserId]: false
      }));
      
      userRoleForm.reset();
      setCurrentUserId("");
    } catch (error: any) {
      toast.error(error.message || "Failed to assign role");
      console.error("Error assigning role:", error);
    }
  };

  // Handle role deletion
  const handleDeleteRole = async (roleId: string) => {
    if (!organizationClient) {
      toast.error("Organization not connected");
      return;
    }

    console.log("Delete role clicked for ID:", roleId);
    
    if (window.confirm("Are you sure you want to delete this role? This will also remove it from all users.")) {
      console.log("User confirmed deletion");
      try {
        console.log("Calling deleteRole function...");
        const success = await deleteRole(roleId, organizationClient);
        console.log("Delete role result:", success);
        
        if (success) {
          toast.success("Role deleted successfully");
          await refreshData();
        } else {
          toast.error("Failed to delete role");
        }
      } catch (error) {
        console.error("Error deleting role:", error);
        toast.error("An error occurred while deleting the role");
      }
    } else {
      console.log("User cancelled deletion");
    }
  };

  // Handle editing a role
  const handleEditRole = (role: any) => {
    setCurrentRole(role);
    setIsEditMode(true);
    
    // Set form values
    roleForm.setValue("name", role.name);
    roleForm.setValue("description", role.description);
    
    // Open dialog
    setIsRoleDialogOpen(true);
  };

  // Handle removing a role from a user
  const handleRemoveRoleFromUser = async (userId: string, roleId: string) => {
    if (!organizationClient) {
      toast.error("Organization not connected");
      return;
    }

    try {
      await removeRoleFromUser(userId, roleId, organizationClient);
      toast.success("Role removed from user");
      await refreshData();
    } catch (error: any) {
      toast.error(error.message || "Failed to remove role");
      console.error("Error removing role from user:", error);
    }
  };

  // Helper to manage individual user dialog state
  const toggleUserDialog = (userId: string, isOpen: boolean) => {
    setUserAssignDialogStates(prev => ({
      ...prev,
      [userId]: isOpen
    }));
    
    if (isOpen) {
      setCurrentUserId(userId);
      userRoleForm.reset();
    } else {
      setCurrentUserId("");
    }
  };

  if (!organizationClient) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Role Management</h2>
          <p className="text-muted-foreground">Define and manage user roles and permissions</p>
        </div>
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              Please select an organization to manage roles.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Role Management</h2>
        <p className="text-muted-foreground">Define and manage user roles and permissions</p>
      </div>
      
      {/* Roles Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Available Roles</CardTitle>
            <CardDescription>
              Roles determine what users can do within the application
            </CardDescription>
          </div>
          <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  setIsEditMode(false);
                  setCurrentRole(null);
                  roleForm.reset();
                }}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Role
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{isEditMode ? "Edit Role" : "Create New Role"}</DialogTitle>
                <DialogDescription>
                  {isEditMode 
                    ? "Update the details for this role" 
                    : "Define a new role for users in the system"
                  }
                </DialogDescription>
              </DialogHeader>
              <Form {...roleForm}>
                <form onSubmit={roleForm.handleSubmit(handleRoleFormSubmit)} className="space-y-4">
                  <FormField
                    control={roleForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter role name" {...field} />
                        </FormControl>
                        <FormDescription>
                          A unique name for this role
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={roleForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the role and its permissions" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          What this role allows users to do
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">
                      {isEditMode ? "Update Role" : "Create Role"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-6 text-center text-muted-foreground">Loading roles...</div>
          ) : roles.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground">
              No roles defined yet. Create your first role to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Description</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        {role.name}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{role.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{calculateUsersPerRole(role.id)}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditRole(role)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={(e) => {
                            e.preventDefault();
                            console.log("Delete button clicked for role:", role.name, role.id);
                            handleDeleteRole(role.id);
                          }}
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* User Role Assignments Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>User Role Assignments</CardTitle>
            <CardDescription>
              Manage which users have which roles
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={refreshData} disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            {roles.length > 0 && (
              <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Users className="mr-2 h-4 w-4" /> Assign Role
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign Role to User</DialogTitle>
                    <DialogDescription>
                      Select a user and role to assign
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...assignRoleForm}>
                    <form onSubmit={assignRoleForm.handleSubmit(handleAssignRoleSubmit)} className="space-y-4">
                      <FormField
                        control={assignRoleForm.control}
                        name="userId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>User</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a user" />
                                </SelectTrigger>
                                <SelectContent>
                                  {usersWithRoles.map((user) => (
                                    <SelectItem key={user.id} value={user.id}>
                                      {user.full_name || 'Unnamed User'}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={assignRoleForm.control}
                        name="roleId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                  {roles.map((role) => (
                                    <SelectItem key={role.id} value={role.id}>
                                      {role.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button type="submit">Assign Role</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-6 text-center text-muted-foreground">Loading users...</div>
          ) : usersWithRoles.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground">
              No users available in the system.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Assigned Roles</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersWithRoles.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.full_name || 'Unnamed User'}</p>
                        {user.job_title && (
                          <p className="text-sm text-muted-foreground">{user.job_title}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles && user.roles.length > 0 ? (
                          user.roles.map((role: any) => (
                            <Badge key={role.id} className="mr-1 mb-1">
                              {role.name}
                              <button
                                className="ml-1 text-xs opacity-70 hover:opacity-100"
                                onClick={() => handleRemoveRoleFromUser(user.id, role.id)}
                                title={`Remove ${role.name} role`}
                              >
                                ✕
                              </button>
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">No roles assigned</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog 
                        open={userAssignDialogStates[user.id] || false} 
                        onOpenChange={(isOpen) => toggleUserDialog(user.id, isOpen)}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">Assign Role</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Assign Role to {user.full_name || 'User'}</DialogTitle>
                            <DialogDescription>
                              Select a role to assign to this user
                            </DialogDescription>
                          </DialogHeader>
                          <Form {...userRoleForm}>
                            <form onSubmit={userRoleForm.handleSubmit(handleUserRoleAssignment)} className="space-y-4">
                              <FormField
                                control={userRoleForm.control}
                                name="roleId"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <FormControl>
                                      <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {roles.map((role) => (
                                            <SelectItem key={role.id} value={role.id}>
                                              {role.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <DialogFooter>
                                <Button 
                                  type="button"
                                  variant="outline" 
                                  onClick={() => toggleUserDialog(user.id, false)}
                                >
                                  Cancel
                                </Button>
                                <Button type="submit">
                                  Assign Role
                                </Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
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

export default RolesManagement;
