
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CockpitKPI } from "@/types/cockpit";
import KPIValuesManagement from "./KPIValuesManagement";
import KPITargetsManagement from "./KPITargetsManagement";
import KPITimeBasedManagement from "./KPITimeBasedManagement";

interface KPIManagementTabsProps {
  kpi: CockpitKPI;
  onBack: () => void;
}

const KPIManagementTabs: React.FC<KPIManagementTabsProps> = ({
  kpi,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState('values');

  const getTabsForKPIType = () => {
    const commonTabs = [
      { value: 'targets', label: 'Targets', icon: '🎯' }
    ];

    switch (kpi.kpi_data_type) {
      case 'single':
        return [
          { value: 'values', label: 'Current Values', icon: '📊' },
          ...commonTabs
        ];
      case 'time_based':
        return [
          { value: 'time-series', label: 'Time Series Data', icon: '📈' },
          ...commonTabs
        ];
      default:
        return commonTabs;
    }
  };

  const tabs = getTabsForKPIType();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{kpi.display_name}</h2>
          <p className="text-gray-600">
            {kpi.kpi_data_type} KPI • {kpi.format_type} format
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          Back to KPIs
        </Button>
      </div>

      {/* KPI Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>KPI Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Type:</span>
              <p className="capitalize">{kpi.kpi_data_type}</p>
            </div>
            <div>
              <span className="font-medium">Format:</span>
              <p className="capitalize">{kpi.format_type}</p>
            </div>
            <div>
              <span className="font-medium">Trend Direction:</span>
              <p className="capitalize">{kpi.trend_direction.replace('_', ' ')}</p>
            </div>
            <div>
              <span className="font-medium">Weight:</span>
              <p>{kpi.weight || 1.0}</p>
            </div>
          </div>
          {kpi.description && (
            <div className="mt-4">
              <span className="font-medium">Description:</span>
              <p className="text-gray-600">{kpi.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Single Value Management */}
        {kpi.kpi_data_type === 'single' && (
          <TabsContent value="values">
            <KPIValuesManagement kpi={kpi} />
          </TabsContent>
        )}

        {/* Time-based Management */}
        {kpi.kpi_data_type === 'time_based' && (
          <TabsContent value="time-series">
            <KPITimeBasedManagement kpi={kpi} />
          </TabsContent>
        )}

        {/* Targets Management */}
        <TabsContent value="targets">
          <KPITargetsManagement kpi={kpi} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KPIManagementTabs;
