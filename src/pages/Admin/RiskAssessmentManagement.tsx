import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Info, AlertTriangle, TrendingUp } from "lucide-react";
import BackButton from "@/components/ui/back-button";
import RisksOpportunitiesAdmin from "./components/RisksOpportunitiesAdmin";

const RiskAssessmentManagement: React.FC = () => {
  return (
    <div className="container mx-auto p-4 lg:p-8">
      <BackButton />
      
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-orange-500">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Risk & Opportunity Assessment</h1>
        </div>
        <p className="text-gray-500">
          Identify, assess, and manage risks that could impact your strategic objectives, plus opportunities that could accelerate progress.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Risk Management
            </CardTitle>
            <CardDescription>
              Identify potential threats and develop mitigation strategies to protect your strategic objectives.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <h5 className="font-semibold">Impact Assessment</h5>
                <p className="text-gray-600">Evaluate potential negative effects on objectives</p>
              </div>
              <div>
                <h5 className="font-semibold">Probability Analysis</h5>
                <p className="text-gray-600">Assess likelihood of risk occurrence</p>
              </div>
              <div>
                <h5 className="font-semibold">Mitigation Planning</h5>
                <p className="text-gray-600">Develop strategies to reduce or eliminate risks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <TrendingUp className="h-5 w-5" />
              Opportunity Management
            </CardTitle>
            <CardDescription>
              Capture and develop opportunities that could accelerate achievement of strategic goals.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <h5 className="font-semibold">Benefit Assessment</h5>
                <p className="text-gray-600">Evaluate potential positive impact on objectives</p>
              </div>
              <div>
                <h5 className="font-semibold">Feasibility Analysis</h5>
                <p className="text-gray-600">Assess likelihood of successful realization</p>
              </div>
              <div>
                <h5 className="font-semibold">Realization Planning</h5>
                <p className="text-gray-600">Develop strategies to capture opportunities</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            Assessment Matrix
          </CardTitle>
          <CardDescription>
            Understanding impact levels and probability ratings for effective risk and opportunity management.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Impact Levels</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-green-500"></div>
                  <span className="text-sm"><strong>Low:</strong> Minimal effect on objectives</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-yellow-500"></div>
                  <span className="text-sm"><strong>Medium:</strong> Moderate effect, manageable</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-red-500"></div>
                  <span className="text-sm"><strong>High:</strong> Significant effect, major impact</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Probability Levels</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-green-500"></div>
                  <span className="text-sm"><strong>Low (0-33%):</strong> Unlikely to occur</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-yellow-500"></div>
                  <span className="text-sm"><strong>Medium (34-66%):</strong> Possible occurrence</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-red-500"></div>
                  <span className="text-sm"><strong>High (67-100%):</strong> Likely to occur</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <RisksOpportunitiesAdmin />
    </div>
  );
};

export default RiskAssessmentManagement;