
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import ApprovalProtectedRoute from "@/components/auth/ApprovalProtectedRoute";
import TierProtectedRoute from "@/components/auth/TierProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";

// Auth Pages
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import ForgotPassword from "@/pages/Auth/ForgotPassword";
import ResetPassword from "@/pages/Auth/ResetPassword";

// Main Pages
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import MylesPage from "@/pages/MylesPage";
import ProcessIntelligencePage from "@/pages/ProcessIntelligencePage";
import UserProfile from "@/pages/Profile/UserProfile";
import CockpitSelectionPage from "@/pages/CockpitSelectionPage";
import UserGuide from "@/pages/UserGuide/UserGuide";

// Dynamic Cockpit
import DynamicCockpit from "@/components/cockpits/DynamicCockpit";

// Strategy Pages
import StrategyRoutes from "./route-groups/StrategyRoutes";

// Insights
import AnalystInsights from "@/components/insights/AnalystInsights";

// Admin Routes
import AdminRoutes from "./route-groups/AdminRoutes";

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />
      <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/" replace />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected Routes with Approval Check */}
      <Route
        path="/*"
        element={
          <ApprovalProtectedRoute>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Index />} />
                
                {/* User Guide - Available to all authenticated users */}
                <Route path="/guide" element={<UserGuide />} />
                
                {/* Essential Tier - Cockpit Selection */}
                <Route 
                  path="/cockpit-selection" 
                  element={
                    <TierProtectedRoute requiredTier="essential">
                      <CockpitSelectionPage />
                    </TierProtectedRoute>
                  } 
                />
                
                {/* Essential Tier - Cockpits */}
                <Route 
                  path="/cockpit/:cockpitType" 
                  element={
                    <TierProtectedRoute requiredTier="essential">
                      <DynamicCockpit />
                    </TierProtectedRoute>
                  } 
                />
                
                {/* Professional Tier - Process Intelligence */}
                <Route 
                  path="/process-intelligence" 
                  element={
                    <TierProtectedRoute requiredTier="professional">
                      <ProcessIntelligencePage />
                    </TierProtectedRoute>
                  } 
                />

                {/* Enterprise Tier - Business Health, Insights, Myles */}
                <Route 
                  path="/business-health/*" 
                  element={
                    <TierProtectedRoute requiredTier="enterprise">
                      <StrategyRoutes />
                    </TierProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/insights" 
                  element={
                    <TierProtectedRoute requiredTier="enterprise">
                      <AnalystInsights />
                    </TierProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/myles" 
                  element={
                    <TierProtectedRoute requiredTier="enterprise">
                      <MylesPage />
                    </TierProtectedRoute>
                  } 
                />

                {/* Essential Tier - Profile */}
                <Route 
                  path="/profile" 
                  element={
                    <TierProtectedRoute requiredTier="essential">
                      <UserProfile />
                    </TierProtectedRoute>
                  } 
                />

                {/* Admin Routes - These have their own admin protection */}
                <Route path="/admin/*" element={<AdminRoutes />} />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          </ApprovalProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
