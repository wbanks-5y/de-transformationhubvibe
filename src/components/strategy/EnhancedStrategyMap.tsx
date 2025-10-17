
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStrategicObjectives } from "@/hooks/use-strategic-objectives";
import { useNavigate } from "react-router-dom";
import { Loader2, TrendingUp, Users, Cog, GraduationCap, DollarSign } from "lucide-react";

const EnhancedStrategyMap: React.FC = () => {
  const { data: objectives = [], isLoading } = useStrategicObjectives();
  const [selectedPerspective, setSelectedPerspective] = useState<string | null>(null);
  const navigate = useNavigate();

  const perspectives = [
    { 
      id: 'financial', 
      name: 'Financial', 
      icon: DollarSign, 
      color: 'bg-green-50 border-green-200 text-green-800',
      description: 'Revenue, profitability, and financial sustainability'
    },
    { 
      id: 'customer', 
      name: 'Customer', 
      icon: Users, 
      color: 'bg-blue-50 border-blue-200 text-blue-800',
      description: 'Customer satisfaction, retention, and acquisition'
    },
    { 
      id: 'internal', 
      name: 'Internal Processes', 
      icon: Cog, 
      color: 'bg-orange-50 border-orange-200 text-orange-800',
      description: 'Operational excellence, quality, and innovation'
    },
    { 
      id: 'learning', 
      name: 'Learning & Growth', 
      icon: GraduationCap, 
      color: 'bg-purple-50 border-purple-200 text-purple-800',
      description: 'Employee development, culture, and capabilities'
    }
  ];

  const getHealthColor = (ragStatus: string) => {
    switch (ragStatus) {
      case 'green': return 'bg-green-500';
      case 'amber': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getHealthRing = (healthScore: number, ragStatus: string) => {
    const circumference = 2 * Math.PI * 20;
    const strokeDasharray = `${(healthScore / 100) * circumference} ${circumference}`;
    
    return (
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 44 44">
          <circle
            cx="22"
            cy="22"
            r="20"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx="22"
            cy="22"
            r="20"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeDasharray={strokeDasharray}
            className={ragStatus === 'green' ? 'text-green-500' : ragStatus === 'amber' ? 'text-yellow-500' : 'text-red-500'}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold">{healthScore}%</span>
        </div>
      </div>
    );
  };

  const filteredObjectives = selectedPerspective 
    ? objectives.filter(obj => obj.perspective === selectedPerspective)
    : objectives;

  const groupedObjectives = perspectives.map(perspective => ({
    ...perspective,
    objectives: objectives.filter(obj => obj.perspective === perspective.id)
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Strategic Objectives Map</h2>
          <p className="text-gray-600">Balanced Scorecard perspective view of strategic health</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedPerspective === null ? "default" : "outline"}
            onClick={() => setSelectedPerspective(null)}
            size="sm"
          >
            All Perspectives
          </Button>
          {perspectives.map(perspective => (
            <Button
              key={perspective.id}
              variant={selectedPerspective === perspective.id ? "default" : "outline"}
              onClick={() => setSelectedPerspective(perspective.id)}
              size="sm"
            >
              {perspective.name}
            </Button>
          ))}
        </div>
      </div>

      {selectedPerspective === null ? (
        // Show all perspectives in a 2x2 grid
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {groupedObjectives.map(perspective => {
            const Icon = perspective.icon;
            const overallHealth = perspective.objectives.length > 0 
              ? Math.round(perspective.objectives.reduce((sum, obj) => 
                  sum + (obj.strategic_objective_health?.[0]?.health_score || 0), 0
                ) / perspective.objectives.length)
              : 0;
            
            const overallRag = overallHealth >= 80 ? 'green' : overallHealth >= 60 ? 'amber' : 'red';

            return (
              <Card key={perspective.id} className={`${perspective.color} hover:shadow-lg transition-shadow cursor-pointer`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="h-6 w-6" />
                      <div>
                        <CardTitle className="text-lg">{perspective.name}</CardTitle>
                        <p className="text-sm opacity-80">{perspective.description}</p>
                      </div>
                    </div>
                    {getHealthRing(overallHealth, overallRag)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {perspective.objectives.map(objective => {
                      const latestHealth = objective.strategic_objective_health?.[0];
                      return (
                        <div
                          key={objective.id}
                          className="flex items-center justify-between p-3 bg-white/60 rounded-lg hover:bg-white/80 transition-colors cursor-pointer"
                          onClick={() => navigate(`/business-health/objective/${objective.id}`)}
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{objective.display_name}</h4>
                            <p className="text-xs text-gray-600 mt-1">{objective.target_description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline"
                              className={`${getHealthColor(latestHealth?.rag_status || 'gray')} text-white border-transparent`}
                            >
                              {latestHealth?.health_score || 0}%
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        // Show detailed view for selected perspective
        <div className="space-y-4">
          {filteredObjectives.map(objective => {
            const latestHealth = objective.strategic_objective_health?.[0];
            const perspective = perspectives.find(p => p.id === objective.perspective);
            const Icon = perspective?.icon || TrendingUp;

            return (
              <Card 
                key={objective.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/business-health/objective/${objective.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Icon className="h-8 w-8 text-gray-600" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{objective.display_name}</h3>
                        <p className="text-gray-600 mt-1">{objective.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-gray-500">Target: {objective.target_description}</span>
                          <span className="text-sm text-gray-500">Owner: {objective.owner}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getHealthRing(latestHealth?.health_score || 0, latestHealth?.rag_status || 'gray')}
                      <Badge 
                        variant="outline"
                        className={perspective?.color}
                      >
                        {perspective?.name}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EnhancedStrategyMap;
