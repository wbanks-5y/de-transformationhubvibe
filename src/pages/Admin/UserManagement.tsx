
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus } from "lucide-react";
import BackButton from "@/components/ui/back-button";
import { useUserManagement } from "./hooks/useUserManagement";
import { filteredUsers } from "./utils/userFilters";
import UserTable from "./components/UserTable";
import UserEditForm from "./components/UserEditForm";
import RoleManagement from "./components/RoleManagement";

interface User {
  id: string;
  email?: string;
  created_at: string;
  last_sign_in_at?: string | null;
  full_name?: string;
  company?: string;
  job_title?: string;
  phone?: string;
  status?: string;
}

const UserManagement = () => {
  const {
    users,
    pendingInvitations,
    loading,
    error,
    handleUpdateUser,
    handleUpdateUserStatus,
    handleDeleteUser,
    refreshData,
  } = useUserManagement();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("users");
  const [userSubTab, setUserSubTab] = useState("all");
  
  const itemsPerPage = 10;

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleSaveUser = async (userData: any) => {
    if (selectedUser) {
      await handleUpdateUser(selectedUser.id, userData);
      setIsDialogOpen(false);
    }
  };

  const filtered = filteredUsers(users, pendingInvitations, userSubTab, searchTerm);

  return (
    <div className="container px-4 py-6 mx-auto space-y-6">
      <BackButton />
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">User & Access Management</h1>
          <p className="text-muted-foreground mt-1">Manage users, roles, and access permissions</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search users..." 
              className="pl-10 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={refreshData}>
            Refresh
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4">
          <Tabs defaultValue="all" value={userSubTab} onValueChange={setUserSubTab}>
            <TabsList className="grid w-full grid-cols-5 max-w-xl">
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <Card>
                <CardContent className="p-0">
                  <UserTable
                    users={filtered}
                    loading={loading}
                    error={error}
                    searchTerm={searchTerm}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    onEdit={handleEdit}
                    onUpdateStatus={handleUpdateUserStatus}
                    onDelete={handleDeleteUser}
                    onRefresh={refreshData}
                    onPageChange={setCurrentPage}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="pending" className="mt-4">
              <Card>
                <CardContent className="p-0">
                  <UserTable
                    users={filtered}
                    loading={loading}
                    error={error}
                    searchTerm={searchTerm}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    onEdit={handleEdit}
                    onUpdateStatus={handleUpdateUserStatus}
                    onDelete={handleDeleteUser}
                    onRefresh={refreshData}
                    onPageChange={setCurrentPage}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="approved" className="mt-4">
              <Card>
                <CardContent className="p-0">
                  <UserTable
                    users={filtered}
                    loading={loading}
                    error={error}
                    searchTerm={searchTerm}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    onEdit={handleEdit}
                    onUpdateStatus={handleUpdateUserStatus}
                    onDelete={handleDeleteUser}
                    onRefresh={refreshData}
                    onPageChange={setCurrentPage}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="rejected" className="mt-4">
              <Card>
                <CardContent className="p-0">
                  <UserTable
                    users={filtered}
                    loading={loading}
                    error={error}
                    searchTerm={searchTerm}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    onEdit={handleEdit}
                    onUpdateStatus={handleUpdateUserStatus}
                    onDelete={handleDeleteUser}
                    onRefresh={refreshData}
                    onPageChange={setCurrentPage}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="active" className="mt-4">
              <Card>
                <CardContent className="p-0">
                  <UserTable
                    users={filtered}
                    loading={loading}
                    error={error}
                    searchTerm={searchTerm}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    onEdit={handleEdit}
                    onUpdateStatus={handleUpdateUserStatus}
                    onDelete={handleDeleteUser}
                    onRefresh={refreshData}
                    onPageChange={setCurrentPage}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="roles" className="mt-4">
          <RoleManagement />
        </TabsContent>
      </Tabs>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <UserEditForm 
              user={selectedUser}
              onSave={handleSaveUser}
              onCancel={() => setIsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
