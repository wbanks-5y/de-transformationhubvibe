
import { MetricDisplay } from "@/types/metrics";

interface LayoutOptimizerProps {
  metrics: MetricDisplay[];
  children: (optimizedMetrics: MetricDisplay[]) => React.ReactNode;
}

export const CockpitLayoutOptimizer: React.FC<LayoutOptimizerProps> = ({ 
  metrics, 
  children 
}) => {
  // Smart layout optimizer for cards
  const optimizeLayout = (metrics: MetricDisplay[]) => {
    if (metrics.length === 0) return [];

    // Group metrics by size for better packing
    const sizeGroups = {
      small: metrics.filter(m => m.size_config === 'small'),
      medium: metrics.filter(m => m.size_config === 'medium' || !m.size_config),
      large: metrics.filter(m => m.size_config === 'large'),
      xl: metrics.filter(m => m.size_config === 'xl')
    };

    console.log('Layout optimization - Size groups:', {
      small: sizeGroups.small.length,
      medium: sizeGroups.medium.length,
      large: sizeGroups.large.length,
      xl: sizeGroups.xl.length
    });

    // Optimized ordering: Try to pack efficiently
    const optimizedOrder: MetricDisplay[] = [];
    
    // Strategy: Interleave different sizes to minimize gaps
    const maxLength = Math.max(
      sizeGroups.xl.length,
      sizeGroups.large.length,
      sizeGroups.medium.length,
      sizeGroups.small.length
    );

    for (let i = 0; i < maxLength; i++) {
      // Add XL first (takes most space)
      if (sizeGroups.xl[i]) optimizedOrder.push(sizeGroups.xl[i]);
      
      // Add large cards
      if (sizeGroups.large[i]) optimizedOrder.push(sizeGroups.large[i]);
      
      // Add 2-3 medium/small cards to fill remaining space
      if (sizeGroups.medium[i]) optimizedOrder.push(sizeGroups.medium[i]);
      if (sizeGroups.small[i]) optimizedOrder.push(sizeGroups.small[i]);
      if (sizeGroups.small[i + maxLength]) optimizedOrder.push(sizeGroups.small[i + maxLength]);
    }

    // Add any remaining cards
    const addedIds = new Set(optimizedOrder.map(m => m.id));
    metrics.forEach(metric => {
      if (!addedIds.has(metric.id)) {
        optimizedOrder.push(metric);
      }
    });

    console.log('Layout optimization complete:', {
      originalOrder: metrics.map(m => `${m.display_name}(${m.size_config})`),
      optimizedOrder: optimizedOrder.map(m => `${m.display_name}(${m.size_config})`)
    });

    return optimizedOrder;
  };

  const optimizedMetrics = optimizeLayout(metrics);
  return <>{children(optimizedMetrics)}</>;
};
