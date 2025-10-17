
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Plus, Network } from "lucide-react";
import { useStrategicInitiativeDependencies, useStrategicMilestoneDependencies } from "@/hooks/use-strategic-scenarios";
import AddInitiativeDependencyDialog from './AddInitiativeDependencyDialog';
import AddMilestoneDependencyDialog from './AddMilestoneDependencyDialog';
import { InitiativeDependencyActions, MilestoneDependencyActions } from './DependencyActions';

const DependencyManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'initiative' | 'milestone'>('initiative');
  
  const { data: initiativeDependencies = [] } = useStrategicInitiativeDependencies();
  const { data: milestoneDependencies = [] } = useStrategicMilestoneDependencies();

  const getDependencyTypeLabel = (type: string) => {
    switch (type) {
      case 'finish_to_start': return 'Finish to Start';
      case 'start_to_start': return 'Start to Start';
      case 'finish_to_finish': return 'Finish to Finish';
      case 'start_to_finish': return 'Start to Finish';
      default: return type;
    }
  };

  const getDependencyTypeColor = (type: string) => {
    switch (type) {
      case 'finish_to_start': return 'bg-blue-100 text-blue-800';
      case 'start_to_start': return 'bg-green-100 text-green-800';
      case 'finish_to_finish': return 'bg-purple-100 text-purple-800';
      case 'start_to_finish': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'planning': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Dependency Management</h3>
          <p className="text-sm text-gray-600">Track dependencies between initiatives and milestones</p>
        </div>
        <div className="flex gap-2">
          <Select value={activeTab} onValueChange={(value: 'initiative' | 'milestone') => setActiveTab(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="initiative">Initiative</SelectItem>
              <SelectItem value="milestone">Milestone</SelectItem>
            </SelectContent>
          </Select>
          
          {activeTab === 'initiative' ? (
            <AddInitiativeDependencyDialog>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Initiative Dependency
              </Button>
            </AddInitiativeDependencyDialog>
          ) : (
            <AddMilestoneDependencyDialog>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Milestone Dependency
              </Button>
            </AddMilestoneDependencyDialog>
          )}
        </div>
      </div>

      {/* Initiative Dependencies */}
      {activeTab === 'initiative' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Initiative Dependencies
              <Badge variant="outline">{initiativeDependencies.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {initiativeDependencies.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Network className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No initiative dependencies defined.</p>
                <p className="text-sm mt-2">Add dependencies to track critical paths and blockers.</p>
                <div className="mt-4">
                  <AddInitiativeDependencyDialog>
                    <Button>Add Your First Initiative Dependency</Button>
                  </AddInitiativeDependencyDialog>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {initiativeDependencies.map((dependency) => (
                  <div key={dependency.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {/* Source Initiative */}
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(dependency.initiative?.status || 'unknown')}`}></div>
                        <span className="font-medium">{dependency.initiative?.name || 'Unknown'}</span>
                      </div>
                      
                      {/* Dependency Type */}
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                      <Badge className={getDependencyTypeColor(dependency.dependency_type)}>
                        {getDependencyTypeLabel(dependency.dependency_type)}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                      
                      {/* Target Initiative */}
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(dependency.depends_on?.status || 'unknown')}`}></div>
                        <span className="font-medium">{dependency.depends_on?.name || 'Unknown'}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-500">
                        Created {new Date(dependency.created_at).toLocaleDateString()}
                      </div>
                      <InitiativeDependencyActions dependency={dependency} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Milestone Dependencies */}
      {activeTab === 'milestone' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              Milestone Dependencies
              <Badge variant="outline">{milestoneDependencies.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {milestoneDependencies.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ArrowRight className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No milestone dependencies defined.</p>
                <p className="text-sm mt-2">Add dependencies to track milestone sequencing.</p>
                <div className="mt-4">
                  <AddMilestoneDependencyDialog>
                    <Button>Add Your First Milestone Dependency</Button>
                  </AddMilestoneDependencyDialog>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {milestoneDependencies.map((dependency) => (
                  <div key={dependency.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {/* Source Milestone */}
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(dependency.milestone?.status || 'unknown')}`}></div>
                        <span className="font-medium">{dependency.milestone?.milestone_name || 'Unknown'}</span>
                        {dependency.milestone?.target_date && (
                          <span className="text-xs text-gray-500">
                            ({new Date(dependency.milestone.target_date).toLocaleDateString()})
                          </span>
                        )}
                      </div>
                      
                      {/* Dependency Type */}
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                      <Badge className={getDependencyTypeColor(dependency.dependency_type)}>
                        {getDependencyTypeLabel(dependency.dependency_type)}
                      </Badge>
                      
                      {/* Lag Days */}
                      {dependency.lag_days !== 0 && (
                        <Badge variant="outline" className="text-xs">
                          {dependency.lag_days > 0 ? '+' : ''}{dependency.lag_days} days
                        </Badge>
                      )}
                      
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                      
                      {/* Target Milestone */}
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(dependency.depends_on?.status || 'unknown')}`}></div>
                        <span className="font-medium">{dependency.depends_on?.milestone_name || 'Unknown'}</span>
                        {dependency.depends_on?.target_date && (
                          <span className="text-xs text-gray-500">
                            ({new Date(dependency.depends_on.target_date).toLocaleDateString()})
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-500">
                        Created {new Date(dependency.created_at).toLocaleDateString()}
                      </div>
                      <MilestoneDependencyActions dependency={dependency} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DependencyManager;
