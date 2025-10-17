
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertTriangle, Edit, Trash2 } from "lucide-react";
import UserStatusBadge from "./UserStatusBadge";
import UserActionsButtons from "./UserActionsButtons";
import { TIER_CONFIGS } from "@/types/tiers";

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
  tier?: string;
}

interface UserTableProps {
  users: User[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
  onEdit: (user: User) => void;
  onUpdateStatus: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
  onPageChange: (page: number) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  loading,
  error,
  searchTerm,
  currentPage,
  itemsPerPage,
  onEdit,
  onUpdateStatus,
  onDelete,
  onRefresh,
  onPageChange,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading users...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
          <Button onClick={onRefresh} size="sm">
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead>Last Sign In</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{user.full_name || user.email}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                  {user.job_title && (
                    <div className="text-xs text-muted-foreground">{user.job_title}</div>
                  )}
                </div>
              </TableCell>
              <TableCell>{user.company || '-'}</TableCell>
              <TableCell>
                <UserStatusBadge status={user.status} />
              </TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {TIER_CONFIGS[user.tier as keyof typeof TIER_CONFIGS]?.displayName || user.tier || 'Essential'}
                </Badge>
              </TableCell>
              <TableCell>
                {user.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleDateString()
                  : 'Never'
                }
              </TableCell>
              <TableCell>
                <UserActionsButtons
                  user={user}
                  onEdit={onEdit}
                  onUpdateStatus={onUpdateStatus}
                  onDelete={onDelete}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
