import React from "react";
import { 
  BarChart, Bar, LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Area, AreaChart, CartesianGrid, Legend,
  PieChart, Pie, Cell, ScatterChart, Scatter, RadialBarChart, RadialBar, FunnelChart, Funnel, LabelList,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";

interface MetricChartProps {
  type: "bar" | "line" | "area" | "pie" | "donut" | "scatter" | "stacked_bar" | "stacked_area" | "gauge" | "funnel" | "radar";
  data: any[];
  dataKey: string;
  color: string;
  height?: number;
  showAxis?: boolean;
  gradient?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showLegend?: boolean;
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

const MetricChart: React.FC<MetricChartProps> = ({ 
  type, 
  data, 
  dataKey, 
  color, 
  height = 80,
  showAxis = false,
  gradient = false,
  xAxisLabel,
  yAxisLabel,
  showLegend = false,
  margin = { top: 20, right: 30, bottom: 20, left: 20 }
}) => {
  // Enhanced tooltip formatter
  const formatTooltipValue = (value: any, name: string) => {
    if (typeof value === 'number') {
      return [value.toLocaleString(), name];
    }
    return [value, name];
  };

  // Custom tooltip content for better interactivity
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value?.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Color palette for multi-series charts
  const colorPalette = [
    '#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
    '#06B6D4', '#F97316', '#84CC16', '#EC4899', '#6366F1'
  ];

  // Determine if we should show multiple series
  const hasMultipleSeries = data.length > 0 && Object.keys(data[0]).length > 2;

  // Use the showLegend prop to override the automatic detection
  const shouldShowLegend = showLegend && hasMultipleSeries;

  // Pie/Donut chart colors
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Create axis props with labels if provided
  const getAxisProps = () => {
    const baseXAxisProps = {
      dataKey: "name",
      tick: { fontSize: 12, fill: '#666' },
      axisLine: { stroke: '#e0e0e0' },
      tickLine: { stroke: '#e0e0e0' }
    };

    const baseYAxisProps = {
      tick: { fontSize: 12, fill: '#666' },
      axisLine: { stroke: '#e0e0e0' },
      tickLine: { stroke: '#e0e0e0' },
      tickFormatter: (value: number) => value.toLocaleString()
    };

    // Add labels if provided
    if (xAxisLabel) {
      (baseXAxisProps as any).label = { 
        value: xAxisLabel, 
        position: 'insideBottom', 
        offset: -5, 
        style: { textAnchor: 'middle', fontSize: 11, fill: '#6b7280' } 
      };
    }

    if (yAxisLabel) {
      (baseYAxisProps as any).label = { 
        value: yAxisLabel, 
        angle: -90, 
        position: 'insideLeft', 
        style: { textAnchor: 'middle', fontSize: 11, fill: '#6b7280' } 
      };
    }

    return { xAxisProps: baseXAxisProps, yAxisProps: baseYAxisProps };
  };

  const { xAxisProps, yAxisProps } = getAxisProps();

  switch (type) {
    case "pie":
      return (
        <ResponsiveContainer width="100%" height={height}>
          <PieChart margin={margin}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={Math.min(height / 3, 80)}
              fill="#8884d8"
              dataKey={dataKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colorPalette[index % colorPalette.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            {shouldShowLegend && <Legend />}
          </PieChart>
        </ResponsiveContainer>
      );

    case "donut":
      return (
        <ResponsiveContainer width="100%" height={height}>
          <PieChart margin={margin}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={Math.min(height / 3, 80)}
              innerRadius={Math.min(height / 6, 40)}
              fill="#8884d8"
              dataKey={dataKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colorPalette[index % colorPalette.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            {shouldShowLegend && <Legend />}
          </PieChart>
        </ResponsiveContainer>
      );

    case "scatter":
      return (
        <ResponsiveContainer width="100%" height={height}>
          <ScatterChart data={data} margin={margin}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip content={<CustomTooltip />} />
            <Scatter dataKey={dataKey} fill={color} />
          </ScatterChart>
        </ResponsiveContainer>
      );

    case "stacked_bar":
      return (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data} margin={margin}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip content={<CustomTooltip />} />
            {shouldShowLegend && <Legend />}
            {Object.keys(data[0] || {}).filter(key => key !== 'name').map((key, index) => (
              <Bar 
                key={key}
                dataKey={key} 
                stackId="stack"
                fill={colorPalette[index % colorPalette.length]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      );

    case "stacked_area":
      return (
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data} margin={margin}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip content={<CustomTooltip />} />
            {shouldShowLegend && <Legend />}
            {Object.keys(data[0] || {}).filter(key => key !== 'name').map((key, index) => (
              <Area 
                key={key}
                type="monotone" 
                dataKey={key} 
                stackId="stack"
                stroke={colorPalette[index % colorPalette.length]}
                fill={colorPalette[index % colorPalette.length]}
                fillOpacity={0.6}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      );

    case "gauge":
      const gaugeData = [{ name: 'Progress', value: data[0]?.[dataKey] || 0, fill: color }];
      return (
        <ResponsiveContainer width="100%" height={height}>
          <RadialBarChart 
            cx="50%" 
            cy="50%" 
            innerRadius="60%" 
            outerRadius="90%" 
            barSize={20} 
            data={gaugeData}
            startAngle={180}
            endAngle={0}
          >
            <RadialBar dataKey="value" cornerRadius={10} fill={color} />
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-lg font-bold">
              {`${gaugeData[0].value}%`}
            </text>
          </RadialBarChart>
        </ResponsiveContainer>
      );

    case "funnel":
      return (
        <ResponsiveContainer width="100%" height={height}>
          <FunnelChart margin={margin}>
            <Tooltip content={<CustomTooltip />} />
            <Funnel
              dataKey={dataKey}
              data={data}
              isAnimationActive
            >
              <LabelList position="center" fill="#fff" stroke="none" />
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colorPalette[index % colorPalette.length]} />
              ))}
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      );

    case "radar":
      return (
        <ResponsiveContainer width="100%" height={height}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data} margin={margin}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 'dataMax']} 
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Radar
              dataKey={dataKey}
              stroke={color}
              fill={color}
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      );

    case "area":
      return (
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data} margin={margin}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip content={<CustomTooltip />} />
            {shouldShowLegend && <Legend />}
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            
            {hasMultipleSeries ? (
              Object.keys(data[0]).filter(key => key !== 'name').map((key, index) => (
                <Area 
                  key={key}
                  type="monotone" 
                  dataKey={key} 
                  stroke={colorPalette[index % colorPalette.length]}
                  strokeWidth={2}
                  fill={gradient ? "url(#colorGradient)" : colorPalette[index % colorPalette.length]}
                  fillOpacity={gradient ? 1 : 0.2}
                />
              ))
            ) : (
              <Area 
                type="monotone" 
                dataKey={dataKey} 
                stroke={color} 
                strokeWidth={2}
                fill={gradient ? "url(#colorGradient)" : color}
                fillOpacity={gradient ? 1 : 0.2}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      );

    case "bar":
      return (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data} margin={margin}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip content={<CustomTooltip />} />
            {shouldShowLegend && <Legend />}
            
            {hasMultipleSeries ? (
              Object.keys(data[0]).filter(key => key !== 'name').map((key, index) => (
                <Bar 
                  key={key}
                  dataKey={key} 
                  fill={colorPalette[index % colorPalette.length]}
                  radius={[4, 4, 0, 0]}
                />
              ))
            ) : (
              <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
            )}
          </BarChart>
        </ResponsiveContainer>
      );

    default: // line chart
      return (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data} margin={margin}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip content={<CustomTooltip />} />
            {shouldShowLegend && <Legend />}
            
            {hasMultipleSeries ? (
              Object.keys(data[0]).filter(key => key !== 'name').map((key, index) => (
                <Line 
                  key={key}
                  type="monotone" 
                  dataKey={key} 
                  stroke={colorPalette[index % colorPalette.length]}
                  strokeWidth={2} 
                  dot={{ strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              ))
            ) : (
              <Line 
                type="monotone" 
                dataKey={dataKey} 
                stroke={color} 
                strokeWidth={2} 
                dot={{ strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }} 
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      );
  }
};

export default MetricChart;
