
import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

interface UserStatusBadgeProps {
  status: string | undefined;
}

const UserStatusBadge = ({ status }: UserStatusBadgeProps) => {
  switch (status) {
    case 'approved':
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200" variant="outline">
          <CheckCircle2 className="h-3 w-3 mr-1" />Approved
        </Badge>
      );
    case 'rejected':
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-200" variant="outline">
          <XCircle className="h-3 w-3 mr-1" />Rejected
        </Badge>
      );
    case 'pending':
    default:
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200" variant="outline">
          <Clock className="h-3 w-3 mr-1" />Pending
        </Badge>
      );
  }
};

export default UserStatusBadge;
