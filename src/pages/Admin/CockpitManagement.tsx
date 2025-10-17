
import React from "react";
import AdminCockpitManagement from "./AdminCockpitManagement";
import BackButton from "@/components/ui/back-button";
import AdminErrorBoundary from "@/components/error/AdminErrorBoundary";

const CockpitManagement: React.FC = () => {
  return (
    <AdminErrorBoundary>
      <div>
        <BackButton />
        <AdminCockpitManagement />
      </div>
    </AdminErrorBoundary>
  );
};

export default CockpitManagement;
