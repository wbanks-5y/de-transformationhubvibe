
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import NewBusinessHealthDashboard from '@/components/strategy/NewBusinessHealthDashboard';
import StrategicObjectiveDetail from '@/components/strategy/StrategicObjectiveDetail';
import StrategyExecutionHeatmap from '@/components/strategy/StrategyExecutionHeatmap';
import InitiativeTracker from '@/components/strategy/InitiativeTracker';
import BusinessScenarioPlanning from '@/components/strategy/BusinessScenarioPlanning';
import RiskAssessmentMatrix from '@/components/strategy/RiskAssessmentMatrix';
import PerformanceTrends from '@/components/strategy/PerformanceTrends';

// Wrapper component for consistent layout spacing
const BusinessHealthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl relative">
      {children}
    </div>
  );
};

const StrategyRoutes: React.FC = () => {
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <BusinessHealthLayout>
              <NewBusinessHealthDashboard />
            </BusinessHealthLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <BusinessHealthLayout>
              <NewBusinessHealthDashboard />
            </BusinessHealthLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/heatmap" 
        element={
          <ProtectedRoute>
            <BusinessHealthLayout>
              <StrategyExecutionHeatmap />
            </BusinessHealthLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tracker" 
        element={
          <ProtectedRoute>
            <BusinessHealthLayout>
              <InitiativeTracker />
            </BusinessHealthLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/scenarios" 
        element={
          <ProtectedRoute>
            <BusinessHealthLayout>
              <BusinessScenarioPlanning />
            </BusinessHealthLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/risk-matrix" 
        element={
          <ProtectedRoute>
            <BusinessHealthLayout>
              <RiskAssessmentMatrix />
            </BusinessHealthLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/trends" 
        element={
          <ProtectedRoute>
            <BusinessHealthLayout>
              <PerformanceTrends />
            </BusinessHealthLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/objective/:id" 
        element={
          <ProtectedRoute>
            <BusinessHealthLayout>
              <StrategicObjectiveDetail />
            </BusinessHealthLayout>
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default StrategyRoutes;
