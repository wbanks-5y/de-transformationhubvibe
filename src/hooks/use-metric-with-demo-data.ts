
import { useMemo } from 'react';
import { CockpitMetric } from '@/types/cockpit';

export const useMetricWithDemoData = (metric: CockpitMetric) => {
  const metricWithDemoData = useMemo(() => {
    // For time-based metrics, generate demo data if none exists
    if (metric.metric_data_type === 'time_based' && metric.metric_type === 'chart') {
      const demoData = generateTimeBasedDemoData(metric.name);
      return {
        ...metric,
        demo_data: demoData
      };
    }

    // For multi-value metrics, generate demo data if none exists
    if (metric.metric_data_type === 'multi_value' && metric.metric_type === 'chart') {
      const demoData = generateMultiValueDemoData(metric.name);
      return {
        ...metric,
        demo_data: demoData
      };
    }

    return metric;
  }, [metric]);

  return metricWithDemoData;
};

const generateTimeBasedDemoData = (metricName: string) => {
  const now = new Date();
  const data = [];
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = Math.floor(Math.random() * 1000) + 500;
    
    data.push({
      label: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      value: value,
      valid_from: date.toISOString().split('T')[0],
      valid_to: new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0]
    });
  }
  
  return data;
};

const generateMultiValueDemoData = (metricName: string) => {
  const categories = ['Category A', 'Category B', 'Category C', 'Category D'];
  
  return categories.map((category, index) => ({
    label: category,
    value: Math.floor(Math.random() * 100) + 10,
    sort_order: index
  }));
};
