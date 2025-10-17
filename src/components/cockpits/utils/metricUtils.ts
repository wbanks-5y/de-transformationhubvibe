
export function generatePlaceholderValue(metric: { name: string; metric_type?: string }): string {
  const baseValues = {
    'budget': '$125,000',
    'completion': '78.5%',
    'efficiency': '87.2%',
    'timeline': '15 days',
    'resources': '24 people'
  };
  
  const key = metric.name.toLowerCase();
  if (key.includes('budget') || key.includes('cost')) return baseValues.budget;
  if (key.includes('completion') || key.includes('progress')) return baseValues.completion;
  if (key.includes('efficiency') || key.includes('performance')) return baseValues.efficiency;
  if (key.includes('timeline') || key.includes('days')) return baseValues.timeline;
  if (key.includes('resource') || key.includes('team')) return baseValues.resources;
  
  return metric.metric_type === 'percentage' ? '82.1%' : '42,500';
}

export function getDaysFromTimeRange(timeRange: string): number {
  switch (timeRange) {
    case "7d": return 7;
    case "30d": return 30;
    case "90d": return 90;
    case "1y": return 365;
    default: return 30;
  }
}

export function formatDisplayValue(metricData: any[], metric: any): string {
  if (metricData && metricData.length > 0) {
    const latestValue = metricData[0].value;
    if (latestValue !== undefined) {
      switch (metric.metric_type) {
        case 'currency':
          return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(latestValue);
        case 'percentage':
          return `${latestValue.toFixed(1)}%`;
        default:
          return latestValue.toLocaleString();
      }
    }
  }
  return metric.current_value || generatePlaceholderValue(metric);
}

export function getTrendData(metricData: any[]) {
  if (!metricData || metricData.length < 2) return null;
  
  const current = metricData[0].value || 0;
  const previous = metricData[1].value || 0;
  const change = ((current - previous) / previous) * 100;
  
  return {
    percentage: change,
    isPositive: change > 0
  };
}

export function getDemoChartData() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map(month => ({
    name: month,
    value: Math.floor(Math.random() * 100) + 20
  }));
}
