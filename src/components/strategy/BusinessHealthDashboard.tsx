
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  ChartContainer,
  ChartLegend, 
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { AlertTriangle, ArrowDown, ArrowUp, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BusinessHealthDashboard: React.FC = () => {
  const navigate = useNavigate();

  const overallHealth = 78;
  
  const healthByPerspective = [
    { name: 'Financial', value: 83, color: '#9AE6B4', status: 'good', path: '/health/finance' },
    { name: 'Customer', value: 72, color: '#90CDF4', status: 'good', path: '/health/sales' },
    { name: 'Internal Processes', value: 65, color: '#FEEBC8', status: 'needs-improvement', path: '/health/manufacturing' },
    { name: 'Learning & Growth', value: 91, color: '#9AE6B4', status: 'excellent', path: '/health/fixed-assets' }
  ];
  
  const healthTrendData = [
    { month: 'Jan', health: 72 },
    { month: 'Feb', health: 70 },
    { month: 'Mar', health: 73 },
    { month: 'Apr', health: 75 },
    { month: 'May', health: 71 },
    { month: 'Jun', health: 74 },
    { month: 'Jul', health: 78 }
  ];

  const criticalAreas = [
    { metric: 'Supplier Delivery Time', value: '8.5 days', target: '5 days', status: 'critical', change: '+1.2', path: '/health/procurement' },
    { metric: 'Manufacturing Defect Rate', value: '3.8%', target: '2.5%', status: 'critical', change: '+0.5', path: '/health/manufacturing' },
    { metric: 'Cash Conversion Cycle', value: '45 days', target: '35 days', status: 'warning', change: '+3', path: '/health/cash-bank' }
  ];
  
  const improvingAreas = [
    { metric: 'Customer Retention', value: '87%', target: '85%', status: 'good', change: '+2.3', path: '/health/sales' },
    { metric: 'Revenue Growth', value: '7.5%', target: '5%', status: 'excellent', change: '+1.2', path: '/health/finance' },
    { metric: 'Employee Productivity', value: '94%', target: '90%', status: 'excellent', change: '+3.1', path: '/health/fixed-assets' }
  ];

  const renderHealthStatus = (value: number) => {
    if (value >= 85) return { text: 'Excellent', color: 'text-green-600' };
    if (value >= 70) return { text: 'Good', color: 'text-blue-600' };
    if (value >= 50) return { text: 'Needs Improvement', color: 'text-amber-600' };
    return { text: 'Critical', color: 'text-red-600' };
  };

  const renderStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string, text: string }> = {
      'excellent': { bg: 'bg-green-100', text: 'text-green-800' },
      'good': { bg: 'bg-blue-100', text: 'text-blue-800' },
      'needs-improvement': { bg: 'bg-amber-100', text: 'text-amber-800' },
      'warning': { bg: 'bg-amber-100', text: 'text-amber-800' },
      'critical': { bg: 'bg-red-100', text: 'text-red-800' }
    };
    
    const style = statusMap[status] || { bg: 'bg-gray-100', text: 'text-gray-800' };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </span>
    );
  };

  const getChartConfig = {
    excellent: { color: '#9AE6B4', label: 'Excellent' },
    good: { color: '#90CDF4', label: 'Good' },
    warning: { color: '#FEEBC8', label: 'Warning' },
    critical: { color: '#FEB2B2', label: 'Critical' },
  };

  return (
    <div className="space-y-6">
      {/* Overall Health */}
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Overall Business Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col items-center md:items-start gap-2 w-full md:w-1/3">
              <div className="text-5xl font-bold">{overallHealth}%</div>
              <div className={`${renderHealthStatus(overallHealth).color} font-medium`}>
                {renderHealthStatus(overallHealth).text}
              </div>
              <Progress 
                value={overallHealth} 
                className="h-2 w-full" 
              />
            </div>
            <div className="w-full md:w-2/3 h-60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={healthTrendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[60, 100]} />
                  <Tooltip 
                    content={({active, payload, label}) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
                            <p className="font-medium">{label}</p>
                            <p className="text-sm">{`Health: ${payload[0].value}%`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="health" 
                    stroke="#9b87f5" 
                    strokeWidth={2} 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health by Perspective */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Perspective Breakdown */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Health by Perspective</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {healthByPerspective.map(perspective => (
                <div 
                  key={perspective.name}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(perspective.path)}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: perspective.color }}
                    ></div>
                    <span>{perspective.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {renderStatusBadge(perspective.status)}
                    <span className="font-medium">{perspective.value}%</span>
                    <ChevronRight size={18} className="text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Perspective Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Perspective Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ChartContainer
                config={getChartConfig}
                className="h-full"
              >
                <PieChart>
                  <Pie
                    data={healthByPerspective}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, value}) => `${name}: ${value}%`}
                  >
                    {healthByPerspective.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={<ChartTooltipContent />} 
                  />
                  <ChartLegend 
                    content={<ChartLegendContent />} 
                  />
                </PieChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Areas Requiring Attention */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-500" />
            Areas Requiring Attention
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {criticalAreas.map((area, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                onClick={() => navigate(area.path)}
              >
                <div>
                  <div className="font-medium">{area.metric}</div>
                  <div className="text-sm text-gray-500">Target: {area.target}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-medium">{area.value}</div>
                    <div className="flex items-center justify-end text-red-600 text-sm">
                      <ArrowUp size={14} />
                      {area.change}
                    </div>
                  </div>
                  {renderStatusBadge(area.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Improving Areas */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Top Performing Areas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {improvingAreas.map((area, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                onClick={() => navigate(area.path)}
              >
                <div>
                  <div className="font-medium">{area.metric}</div>
                  <div className="text-sm text-gray-500">Target: {area.target}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-medium">{area.value}</div>
                    <div className="flex items-center justify-end text-green-600 text-sm">
                      <ArrowUp size={14} />
                      {area.change}
                    </div>
                  </div>
                  {renderStatusBadge(area.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessHealthDashboard;
