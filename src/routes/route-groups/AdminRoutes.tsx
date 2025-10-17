
import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";

// Import admin pages
import AdminDashboard from "@/pages/Admin/AdminDashboard";
import UserManagement from "@/pages/Admin/UserManagement";
import RolesManagement from "@/pages/Admin/RolesManagement";
import CockpitManagement from "@/pages/Admin/CockpitManagement";
import AdminCockpitManagement from "@/pages/Admin/AdminCockpitManagement";
import BusinessHealthManagement from "@/pages/Admin/BusinessHealthManagement";
import StrategicObjectivesManagement from "@/pages/Admin/StrategicObjectivesManagement";
import BusinessHealthTracking from "@/pages/Admin/BusinessHealthTracking";
import StrategicInitiativesManagement from "@/pages/Admin/StrategicInitiativesManagement";
import RiskAssessmentManagement from "@/pages/Admin/RiskAssessmentManagement";
import ProcessIntelligenceManagement from "@/pages/Admin/ProcessIntelligenceManagement";
import CompanyProfile from "@/pages/Admin/CompanyProfile";
import DatabaseManagement from "@/pages/Admin/DatabaseManagement";
import SecurityDashboard from "@/pages/Admin/SecurityDashboard";
import ApiKeySettings from "@/pages/Admin/ApiKeySettings";
import ApproveAdmin from "@/pages/Admin/ApproveAdmin";
import InvitationsManagement from "@/pages/Admin/InvitationsManagement";
import AnalystInsightsManagement from "@/pages/Admin/components/AnalystInsightsManagement";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <AdminProtectedRoute>
            <UserManagement />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/roles"
        element={
          <AdminProtectedRoute>
            <RolesManagement />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/cockpits"
        element={
          <AdminProtectedRoute>
            <CockpitManagement />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin-cockpits"
        element={
          <AdminProtectedRoute>
            <AdminCockpitManagement />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/business-health"
        element={
          <AdminProtectedRoute>
            <BusinessHealthManagement />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/strategic-objectives"
        element={
          <AdminProtectedRoute>
            <StrategicObjectivesManagement />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/health-tracking"
        element={
          <AdminProtectedRoute>
            <BusinessHealthTracking />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/strategic-initiatives"
        element={
          <AdminProtectedRoute>
            <StrategicInitiativesManagement />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/risk-assessment"
        element={
          <AdminProtectedRoute>
            <RiskAssessmentManagement />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/process-intelligence"
        element={
          <AdminProtectedRoute>
            <ProcessIntelligenceManagement />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/company"
        element={
          <AdminProtectedRoute>
            <CompanyProfile />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/database"
        element={
          <AdminProtectedRoute>
            <DatabaseManagement />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/security"
        element={
          <AdminProtectedRoute>
            <SecurityDashboard />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/api-keys"
        element={
          <AdminProtectedRoute>
            <ApiKeySettings />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/approve-admin"
        element={
          <AdminProtectedRoute>
            <ApproveAdmin />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/invitations"
        element={
          <AdminProtectedRoute>
            <InvitationsManagement />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/analyst-insights"
        element={
          <AdminProtectedRoute>
            <AnalystInsightsManagement />
          </AdminProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AdminRoutes;
