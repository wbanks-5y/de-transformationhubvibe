
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Map, 
  Calendar, 
  BarChart3, 
  Lightbulb, 
  Activity, 
  Shield, 
  TrendingDown 
} from "lucide-react";

const StrategyPageSelector: React.FC = () => {
  const navigate = useNavigate();

  const pages = [
    {
      name: "Strategy Map",
      description: "Interactive D3 strategy map with performance visualization",
      path: "/business-health",
      icon: <Map className="h-5 w-5" />
    },
    {
      name: "Initiative Tracker", 
      description: "Track strategic initiatives, milestones, and resources",
      path: "/business-health/tracker",
      icon: <Calendar className="h-5 w-5" />
    },
    {
      name: "Execution Heatmap",
      description: "Performance heatmap across strategic objectives",
      path: "/business-health/heatmap", 
      icon: <BarChart3 className="h-5 w-5" />
    },
    {
      name: "Scenario Planning",
      description: "Strategic scenario planning and analysis",
      path: "/business-health/scenarios",
      icon: <Lightbulb className="h-5 w-5" />
    },
    {
      name: "Strategic Alignment",
      description: "Alignment analysis across business areas",
      path: "/business-health/alignment",
      icon: <Activity className="h-5 w-5" />
    },
    {
      name: "Risk Assessment",
      description: "Risk assessment matrix and mitigation strategies",
      path: "/business-health/risk-matrix",
      icon: <Shield className="h-5 w-5" />
    },
    {
      name: "Performance Trends",
      description: "Performance trend analysis over time",
      path: "/business-health/trends",
      icon: <TrendingDown className="h-5 w-5" />
    }
  ];

  return (
    <Card className="w-full mb-8">
      <CardHeader>
        <CardTitle>Strategy Pages - Choose Which Version to Keep</CardTitle>
        <p className="text-gray-600">Click on any page below to navigate and review. Let me know which version you want to keep!</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((page) => (
            <Button
              key={page.path}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-2"
              onClick={() => navigate(page.path)}
            >
              <div className="flex items-center gap-2 w-full">
                {page.icon}
                <span className="font-semibold">{page.name}</span>
              </div>
              <p className="text-sm text-gray-600 text-left">{page.description}</p>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StrategyPageSelector;
