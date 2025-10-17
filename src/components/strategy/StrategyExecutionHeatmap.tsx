
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStrategicHealthPeriods } from "@/hooks/use-strategic-health-periods";
import { CalendarDays, Download } from "lucide-react";
import { toast } from "sonner";
import HeatmapFiltersDialog from './HeatmapFiltersDialog';
import { exportHeatmapData } from '@/utils/heatmapExport';

const StrategyExecutionHeatmap: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [selectedPerspective, setSelectedPerspective] = useState('all');
  
  // New filter states
  const [selectedPerspectives, setSelectedPerspectives] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const { data: healthData = [], isLoading } = useStrategicHealthPeriods(selectedPeriod);

  const perspectives = [
    { id: 'financial', name: 'Financial', color: 'bg-green-500' },
    { id: 'customer', name: 'Customer', color: 'bg-blue-500' },
    { id: 'internal', name: 'Internal', color: 'bg-orange-500' },
    { id: 'learning', name: 'Learning', color: 'bg-purple-500' }
  ];

  const periods = [
    { id: 'current', name: 'Current Period' },
    { id: 'q1', name: 'Q1 2024' },
    { id: 'q2', name: 'Q2 2024' },
    { id: 'q3', name: 'Q3 2024' },
    { id: 'q4', name: 'Q4 2024' }
  ];

  // Apply filters to the data
  const filteredHealthData = useMemo(() => {
    let filtered = healthData;

    // Apply perspective filter (legacy single selection)
    if (selectedPerspective !== 'all') {
      filtered = filtered.filter(item => item.strategic_objectives?.perspective === selectedPerspective);
    }

    // Apply advanced perspective filters
    if (selectedPerspectives.length > 0) {
      filtered = filtered.filter(item => 
        selectedPerspectives.includes(item.strategic_objectives?.perspective || '')
      );
    }

    // Apply status filters
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter(item => 
        selectedStatuses.includes(item.rag_status || '')
      );
    }

    return filtered;
  }, [healthData, selectedPerspective, selectedPerspectives, selectedStatuses]);

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getHealthIntensity = (score: number) => {
    const intensity = Math.max(0.3, score / 100);
    return { opacity: intensity };
  };

  // Group by perspective for display
  const healthByPerspective = perspectives.reduce((acc, perspective) => {
    acc[perspective.id] = filteredHealthData.filter(
      item => item.strategic_objectives?.perspective === perspective.id
    );
    return acc;
  }, {} as Record<string, typeof filteredHealthData>);

  const handleExport = () => {
    try {
      exportHeatmapData(filteredHealthData, selectedPeriod, 'csv');
      toast.success(`Heatmap data for ${periods.find(p => p.id === selectedPeriod)?.name} exported successfully.`);
    } catch (error) {
      toast.error("There was an error exporting the data. Please try again.");
    }
  };

  const handleClearFilters = () => {
    setSelectedPerspectives([]);
    setSelectedStatuses([]);
    setSelectedPerspective('all');
    toast.success("All filters have been reset.");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-500">Loading heatmap data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Strategy Execution Heatmap</h2>
          <p className="text-gray-600">Visual health tracking across objectives and time periods</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExport}
            disabled={filteredHealthData.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <HeatmapFiltersDialog
            selectedPerspectives={selectedPerspectives}
            selectedStatuses={selectedStatuses}
            onPerspectiveChange={setSelectedPerspectives}
            onStatusChange={setSelectedStatuses}
            onClearFilters={handleClearFilters}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">Period:</span>
          {periods.map(period => (
            <Button
              key={period.id}
              variant={selectedPeriod === period.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period.id)}
            >
              {period.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Perspective:</span>
        <Button
          variant={selectedPerspective === 'all' ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedPerspective('all')}
        >
          All
        </Button>
        {perspectives.map(perspective => (
          <Button
            key={perspective.id}
            variant={selectedPerspective === perspective.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPerspective(perspective.id)}
          >
            {perspective.name}
          </Button>
        ))}
      </div>

      {/* Active Filters Display */}
      {(selectedPerspectives.length > 0 || selectedStatuses.length > 0) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium">Active Filters:</span>
          {selectedPerspectives.map(perspectiveId => {
            const perspective = perspectives.find(p => p.id === perspectiveId);
            return (
              <Badge key={perspectiveId} variant="secondary">
                {perspective?.name}
              </Badge>
            );
          })}
          {selectedStatuses.map(status => (
            <Badge key={status} variant="secondary">
              {status === 'green' ? 'On Track' : status === 'amber' ? 'At Risk' : 'Off Track'}
            </Badge>
          ))}
        </div>
      )}

      {/* Heatmap Grid */}
      <Card>
        <CardHeader>
          <CardTitle>
            Objective Health Matrix - {periods.find(p => p.id === selectedPeriod)?.name}
            {filteredHealthData.length !== healthData.length && (
              <Badge variant="outline" className="ml-2">
                {filteredHealthData.length} of {healthData.length} objectives
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredHealthData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No objectives match the current filters. Try adjusting your filter criteria.
            </div>
          ) : (
            <div className="space-y-6">
              {perspectives.map(perspective => {
                const perspectiveData = healthByPerspective[perspective.id];
                if (perspectiveData.length === 0) return null;

                return (
                  <div key={perspective.id} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 ${perspective.color} rounded`}></div>
                      <h3 className="font-semibold capitalize">{perspective.name} Perspective</h3>
                      <Badge variant="outline">
                        {perspectiveData.length} objectives
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                      {perspectiveData.map(healthItem => {
                        const objective = healthItem.strategic_objectives;
                        const healthScore = Math.round(healthItem.health_score);
                        
                        return (
                          <div
                            key={healthItem.id}
                            className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                            style={{
                              borderLeft: `4px solid`,
                              borderLeftColor: healthItem.rag_status === 'green' ? '#10b981' : 
                                             healthItem.rag_status === 'amber' ? '#f59e0b' : '#ef4444'
                            }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-sm">{objective?.display_name}</h4>
                              <div 
                                className={`w-6 h-6 rounded-full ${getHealthColor(healthScore)} flex items-center justify-center`}
                                style={getHealthIntensity(healthScore)}
                              >
                                <span className="text-white text-xs font-bold">{healthScore}</span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{objective?.target_description}</p>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500">Owner: {objective?.owner}</span>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  healthItem.rag_status === 'green' ? 'bg-green-50 text-green-700' :
                                  healthItem.rag_status === 'amber' ? 'bg-yellow-50 text-yellow-700' :
                                  'bg-red-50 text-red-700'
                                }`}
                              >
                                {healthItem.rag_status?.toUpperCase() || 'UNKNOWN'}
                              </Badge>
                            </div>
                            {healthItem.notes && (
                              <div className="mt-2 text-xs text-gray-500 italic">
                                {healthItem.notes}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Health Distribution Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { status: 'green', label: 'On Track', count: filteredHealthData.filter(h => h.rag_status === 'green').length },
          { status: 'amber', label: 'At Risk', count: filteredHealthData.filter(h => h.rag_status === 'amber').length },
          { status: 'red', label: 'Off Track', count: filteredHealthData.filter(h => h.rag_status === 'red').length },
          { status: 'gray', label: 'Total', count: filteredHealthData.length }
        ].map(item => (
          <Card key={item.status}>
            <CardContent className="p-4 text-center">
              <div className={`w-8 h-8 mx-auto mb-2 rounded-full ${
                item.status === 'green' ? 'bg-green-500' :
                item.status === 'amber' ? 'bg-yellow-500' :
                item.status === 'red' ? 'bg-red-500' : 'bg-gray-400'
              }`}></div>
              <div className="text-2xl font-bold">{item.count}</div>
              <div className="text-sm text-gray-600">{item.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StrategyExecutionHeatmap;
