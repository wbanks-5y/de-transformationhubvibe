
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStrategicRisksOpportunities } from "@/hooks/use-strategic-objectives";
import { AlertTriangle, Shield, TrendingUp, Filter, Download, Plus, Edit, Trash2 } from "lucide-react";
import AddRiskOpportunityDialog from './AddRiskOpportunityDialog';
import { useOrganization } from "@/context/OrganizationContext";
import { toast } from "sonner";

const RiskAssessmentMatrix: React.FC = () => {
  const { organizationClient } = useOrganization();
  const { data: risks = [], refetch } = useStrategicRisksOpportunities();
  
  if (!organizationClient) {
    return <div>Loading organization context...</div>;
  }
  const [selectedView, setSelectedView] = useState('matrix');
  const [filterType, setFilterType] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [dialogType, setDialogType] = useState<'risk' | 'opportunity'>('risk');

  const riskLevels = {
    probability: ['low', 'medium', 'high'],
    impact: ['low', 'medium', 'high', 'critical']
  };

  const getRiskScore = (probability: string, impact: string) => {
    const probScore = riskLevels.probability.indexOf(probability) + 1;
    const impactScore = riskLevels.impact.indexOf(impact) + 1;
    return probScore * impactScore;
  };

  const getRiskLevel = (score: number) => {
    if (score >= 9) return { level: 'critical', color: 'bg-red-500', textColor: 'text-red-800' };
    if (score >= 6) return { level: 'high', color: 'bg-orange-500', textColor: 'text-orange-800' };
    if (score >= 3) return { level: 'medium', color: 'bg-yellow-500', textColor: 'text-yellow-800' };
    return { level: 'low', color: 'bg-green-500', textColor: 'text-green-800' };
  };

  const filteredRisks = filterType === 'all' 
    ? risks 
    : risks.filter(risk => risk.type === filterType);

  const handleAddRisk = () => {
    setEditingItem(null);
    setDialogType('risk');
    setDialogOpen(true);
  };

  const handleAddOpportunity = () => {
    setEditingItem(null);
    setDialogType('opportunity');
    setDialogOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setDialogType(item.type);
    setDialogOpen(true);
  };

  const handleDelete = async (item: any) => {
    if (!confirm(`Are you sure you want to delete this ${item.type}?`)) return;

    try {
      const { error } = await organizationClient
        .from('strategic_risks_opportunities')
        .delete()
        .eq('id', item.id);

      if (error) throw error;
      
      toast.success(`${item.type} deleted successfully`);
      refetch();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error(`Failed to delete ${item.type}`);
    }
  };

  const riskMatrix = () => {
    const matrix = [];
    for (let impact = riskLevels.impact.length - 1; impact >= 0; impact--) {
      const row = [];
      for (let prob = 0; prob < riskLevels.probability.length; prob++) {
        const cellRisks = filteredRisks.filter(risk => 
          risk.probability === riskLevels.probability[prob] && 
          risk.impact_level === riskLevels.impact[impact]
        );
        row.push({
          probability: riskLevels.probability[prob],
          impact: riskLevels.impact[impact],
          risks: cellRisks,
          score: getRiskScore(riskLevels.probability[prob], riskLevels.impact[impact])
        });
      }
      matrix.push(row);
    }
    return matrix;
  };

  const topRisks = filteredRisks
    .filter(risk => risk.type === 'risk')
    .map(risk => ({
      ...risk,
      score: getRiskScore(risk.probability, risk.impact_level)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const topOpportunities = filteredRisks
    .filter(risk => risk.type === 'opportunity')
    .map(risk => ({
      ...risk,
      score: getRiskScore(risk.probability, risk.impact_level)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Risk Assessment Matrix</h2>
          <p className="text-gray-600">Strategic risk evaluation and opportunity analysis</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAddRisk} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Risk
          </Button>
          <Button onClick={handleAddOpportunity} variant="outline" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Opportunity
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">View:</span>
          {['matrix', 'list'].map(view => (
            <Button
              key={view}
              variant={selectedView === view ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedView(view)}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Type:</span>
          {['all', 'risk', 'opportunity'].map(type => (
            <Button
              key={type}
              variant={filterType === type ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Matrix View */}
      {selectedView === 'matrix' && (
        <Card>
          <CardHeader>
            <CardTitle>Risk/Opportunity Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                {/* Headers */}
                <div className="grid grid-cols-4 gap-2 mb-2">
                  <div></div>
                  {riskLevels.probability.map(prob => (
                    <div key={prob} className="text-center font-medium text-sm p-2">
                      {prob.charAt(0).toUpperCase() + prob.slice(1)} Probability
                    </div>
                  ))}
                </div>
                
                {/* Matrix */}
                {riskMatrix().map((row, rowIndex) => (
                  <div key={rowIndex} className="grid grid-cols-4 gap-2 mb-2">
                    <div className="flex items-center justify-center font-medium text-sm p-2">
                      {row[0].impact.charAt(0).toUpperCase() + row[0].impact.slice(1)} Impact
                    </div>
                    {row.map((cell, cellIndex) => {
                      const riskLevel = getRiskLevel(cell.score);
                      return (
                        <div
                          key={cellIndex}
                          className={`p-3 border rounded-lg min-h-[120px] ${
                            cell.risks.length > 0 ? 'cursor-pointer hover:shadow-md' : ''
                          }`}
                          style={{
                            backgroundColor: cell.risks.length > 0 ? 
                              `${riskLevel.color.replace('bg-', '')}20` : '#f9fafb'
                          }}
                        >
                          {cell.risks.length > 0 && (
                            <div className="space-y-2">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${riskLevel.textColor}`}
                              >
                                {cell.risks.length} item{cell.risks.length > 1 ? 's' : ''}
                              </Badge>
                              <div className="text-xs space-y-2">
                                {cell.risks.slice(0, 2).map(risk => (
                                  <div key={risk.id} className="border-b border-gray-200 pb-2 last:border-b-0">
                                    <div className="mb-1">
                                      <span className="block font-medium leading-tight">{risk.title}</span>
                                    </div>
                                    <div className="flex gap-1 justify-end">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEdit(risk);
                                        }}
                                        className="text-blue-600 hover:text-blue-800 p-1"
                                        title="Edit"
                                      >
                                        <Edit className="h-3 w-3" />
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDelete(risk);
                                        }}
                                        className="text-red-600 hover:text-red-800 p-1"
                                        title="Delete"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                                {cell.risks.length > 2 && (
                                  <div className="text-gray-500 text-center">
                                    +{cell.risks.length - 2} more
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* List View */}
      {selectedView === 'list' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Risks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Top Strategic Risks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topRisks.map((risk, index) => {
                  const riskLevel = getRiskLevel(risk.score);
                  return (
                    <div key={risk.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{risk.title}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            #{index + 1}
                          </Badge>
                          <Badge className={`text-xs ${riskLevel.textColor} bg-transparent border-current`}>
                            {riskLevel.level}
                          </Badge>
                          <button
                            onClick={() => handleEdit(risk)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(risk)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{risk.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span>Score: {risk.score}/12</span>
                        <span>{risk.probability} prob. / {risk.impact_level} impact</span>
                      </div>
                      {risk.mitigation_actions && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                          <strong>Mitigation:</strong> {risk.mitigation_actions}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Top Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Top Strategic Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topOpportunities.map((opportunity, index) => {
                  const opportunityLevel = getRiskLevel(opportunity.score);
                  return (
                    <div key={opportunity.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{opportunity.title}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            #{index + 1}
                          </Badge>
                          <Badge className="text-xs text-green-800 bg-green-100 border-green-200">
                            {opportunityLevel.level} potential
                          </Badge>
                          <button
                            onClick={() => handleEdit(opportunity)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(opportunity)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{opportunity.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span>Score: {opportunity.score}/12</span>
                        <span>{opportunity.probability} prob. / {opportunity.impact_level} impact</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Risk Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { 
            label: 'Critical Risks', 
            count: filteredRisks.filter(r => r.type === 'risk' && getRiskScore(r.probability, r.impact_level) >= 9).length,
            color: 'text-red-600 bg-red-100'
          },
          { 
            label: 'High Risks', 
            count: filteredRisks.filter(r => r.type === 'risk' && getRiskScore(r.probability, r.impact_level) >= 6 && getRiskScore(r.probability, r.impact_level) < 9).length,
            color: 'text-orange-600 bg-orange-100'
          },
          { 
            label: 'High Opportunities', 
            count: filteredRisks.filter(r => r.type === 'opportunity' && getRiskScore(r.probability, r.impact_level) >= 6).length,
            color: 'text-green-600 bg-green-100'
          },
          { 
            label: 'Total Items', 
            count: filteredRisks.length,
            color: 'text-blue-600 bg-blue-100'
          }
        ].map(item => (
          <Card key={item.label}>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${item.color}`}>{item.count}</div>
              <div className="text-sm text-gray-600">{item.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddRiskOpportunityDialog
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={refetch}
        item={editingItem}
        defaultType={dialogType}
      />
    </div>
  );
};

export default RiskAssessmentMatrix;
