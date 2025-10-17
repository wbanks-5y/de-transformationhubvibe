
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2, ArrowLeft } from "lucide-react";
import { useCockpitKPIs } from "@/hooks/use-cockpit-kpis";
import { useCreateCockpitKPI, useUpdateCockpitKPI, useDeleteCockpitKPI } from "@/hooks/use-cockpit-kpi-management";
import { CockpitKPI } from "@/types/cockpit";
import KPIEditForm from "./KPIEditForm";
import KPIManagementCard from "./KPIManagementCard";
import KPIManagementTabs from "./KPIManagementTabs";

interface CockpitKPIsListProps {
  cockpitTypeId: string;
  cockpitTypeName: string;
}

const CockpitKPIsList: React.FC<CockpitKPIsListProps> = ({ 
  cockpitTypeId, 
  cockpitTypeName 
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingKPI, setEditingKPI] = useState<CockpitKPI | null>(null);
  const [managingDataKPI, setManagingDataKPI] = useState<CockpitKPI | null>(null);
  
  const { data: kpis = [], isLoading } = useCockpitKPIs(cockpitTypeId);
  const createKPI = useCreateCockpitKPI();
  const updateKPI = useUpdateCockpitKPI();
  const deleteKPI = useDeleteCockpitKPI();

  const handleCreateKPI = async (data: Partial<CockpitKPI>) => {
    const kpiData = {
      name: data.name || data.display_name || 'untitled-kpi',
      display_name: data.display_name || 'Untitled KPI',
      cockpit_type_id: cockpitTypeId,
      kpi_data_type: data.kpi_data_type || 'single',
      format_type: data.format_type || 'number',
      trend_direction: data.trend_direction || 'higher_is_better',
      format_options: data.format_options || {},
      icon: data.icon || '',
      color_class: data.color_class || 'text-blue-600',
      sort_order: data.sort_order || 0,
      is_active: data.is_active !== false,
      size_config: data.size_config || 'medium',
      weight: data.weight || 1.0,
      description: data.description || '',
    };
    
    await createKPI.mutateAsync(kpiData);
    setIsCreating(false);
  };

  const handleUpdateKPI = async (data: Partial<CockpitKPI>) => {
    if (!editingKPI) return;
    
    await updateKPI.mutateAsync({
      id: editingKPI.id,
      updates: data
    });
    setEditingKPI(null);
  };

  const handleDeleteKPI = async (id: string) => {
    await deleteKPI.mutateAsync(id);
  };

  const handleManageData = (kpi: CockpitKPI) => {
    setManagingDataKPI(kpi);
  };

  const handleBackFromDataManagement = () => {
    setManagingDataKPI(null);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  // Show data management interface
  if (managingDataKPI) {
    return (
      <KPIManagementTabs
        kpi={managingDataKPI}
        onBack={handleBackFromDataManagement}
      />
    );
  }

  if (isCreating) {
    return (
      <KPIEditForm
        availableMetrics={[]}
        isCreating={true}
        onSave={handleCreateKPI}
        onCancel={() => setIsCreating(false)}
      />
    );
  }

  if (editingKPI) {
    return (
      <KPIEditForm
        kpi={editingKPI}
        availableMetrics={[]}
        isCreating={false}
        onSave={handleUpdateKPI}
        onCancel={() => setEditingKPI(null)}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>KPIs for {cockpitTypeName}</CardTitle>
            <CardDescription>
              Manage KPI definitions for this cockpit
            </CardDescription>
          </div>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add KPI
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {kpis.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No KPIs configured for this cockpit yet.
            </p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First KPI
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {kpis.map((kpi) => (
              <KPIManagementCard
                key={kpi.id}
                kpi={kpi}
                onEdit={setEditingKPI}
                onDelete={handleDeleteKPI}
                onManageData={handleManageData}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CockpitKPIsList;
