
import { ChartDataPoint } from "./utils";

export interface SeriesConfig {
  key: string;
  name: string;
  color: string;
}

export interface ProcessedChartData {
  processedData: any[];
  seriesConfig: SeriesConfig[];
  isMultiSeries: boolean;
}

export const processMultiSeriesData = (data: ChartDataPoint[]): ProcessedChartData => {
  console.log('processMultiSeriesData input (pre-sorted):', data);
  
  if (!data || data.length === 0) {
    return {
      processedData: [],
      seriesConfig: [],
      isMultiSeries: false
    };
  }

  // Do NOT apply any sorting here - data should already be sorted by parent component

  // Group data by name to check for multiple series
  const groupedByName = new Map<string, ChartDataPoint[]>();
  
  data.forEach(point => {
    if (!groupedByName.has(point.name)) {
      groupedByName.set(point.name, []);
    }
    groupedByName.get(point.name)!.push(point);
  });

  // Check if any name has multiple series (different series names or colors)
  const isMultiSeries = Array.from(groupedByName.values()).some(points => {
    const uniqueSeriesNames = new Set(points.map(p => p.seriesName));
    const uniqueColors = new Set(points.map(p => p.color));
    return uniqueSeriesNames.size > 1 || (uniqueSeriesNames.size === 1 && points.length > 1 && uniqueColors.size > 1);
  });

  console.log('Data analysis:', {
    isMultiSeries,
    groupedByName: Array.from(groupedByName.entries()).map(([name, points]) => ({
      name,
      pointCount: points.length,
      colors: [...new Set(points.map(p => p.color))],
      seriesNames: [...new Set(points.map(p => p.seriesName))]
    }))
  });

  let processedData: any[];
  let seriesConfig: SeriesConfig[] = [];

  if (!isMultiSeries) {
    // Single series - simple transformation (preserve existing order)
    processedData = data.map(point => ({
      name: point.name,
      value: Number(point.value) || 0,
      color: point.color || '#3B82F6'
    }));
    
    console.log('Single series processed (order preserved):', processedData);
  } else {
    // Multi-series - create series structure based on actual series names from DB
    const seriesMap = new Map<string, SeriesConfig>();
    let seriesIndex = 0;

    // Build series configuration using actual series names from database
    data.forEach(point => {
      const seriesName = point.seriesName || 'Series 1';
      const seriesColor = point.color || '#3B82F6';
      
      // Use series name as the unique key instead of color+name combination
      if (!seriesMap.has(seriesName)) {
        seriesMap.set(seriesName, {
          key: `series_${seriesIndex}`,
          name: seriesName, // Use the actual series name from DB
          color: seriesColor
        });
        seriesIndex++;
      }
    });

    seriesConfig = Array.from(seriesMap.values());

    // Process data into multi-series format, preserving sort order
    const dataMap = new Map<string, any>();
    
    // Get unique names in the order they appear in the sorted data
    const sortedNames = [...new Set(data.map(point => point.name))];
    
    sortedNames.forEach(name => {
      dataMap.set(name, { name });
    });
    
    data.forEach(point => {
      const seriesName = point.seriesName || 'Series 1';
      const seriesConfigItem = seriesMap.get(seriesName);
      
      if (seriesConfigItem && dataMap.has(point.name)) {
        dataMap.get(point.name)![seriesConfigItem.key] = Number(point.value) || 0;
      }
    });

    processedData = Array.from(dataMap.values());
    
    console.log('Multi-series processed (order preserved):', {
      seriesConfig,
      processedData,
      originalOrder: data.map(d => d.name)
    });
  }

  return {
    processedData,
    seriesConfig,
    isMultiSeries
  };
};
