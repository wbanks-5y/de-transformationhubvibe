export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
  seriesName?: string;
  sortOrder?: number; // Add sort order from database
}

export const processChartData = (dataPoints: any[] = []): ChartDataPoint[] => {
  console.log('processChartData input:', dataPoints);
  
  if (!dataPoints || dataPoints.length === 0) {
    console.log('processChartData: No data points provided');
    return [];
  }

  const processed = dataPoints.map((point, index) => ({
    name: point.x_axis_value || `Item ${index + 1}`,
    value: Number(point.y_axis_value) || 0,
    color: point.series_color || '#3B82F6',
    seriesName: point.series_name || 'Series 1',
    sortOrder: point.sort_order // Preserve original sort order from database
  }));

  // Remove automatic sorting - let the component handle all sorting
  console.log('processChartData output (unsorted, preserving database order):', processed);
  return processed;
};

export const isMultiSeriesData = (data: ChartDataPoint[]): boolean => {
  if (!data || data.length === 0) return false;
  
  // Check if we have multiple different series names for the same x-axis value
  const nameToSeriesMap = new Map<string, Set<string>>();
  
  data.forEach(point => {
    const seriesName = point.seriesName || 'Series 1';
    if (!nameToSeriesMap.has(point.name)) {
      nameToSeriesMap.set(point.name, new Set());
    }
    nameToSeriesMap.get(point.name)!.add(seriesName);
  });

  // If any name has more than one series, it's multi-series
  return Array.from(nameToSeriesMap.values()).some(seriesSet => seriesSet.size > 1);
};

// Enhanced data type detection for business categories
export const detectDataType = (data: ChartDataPoint[]): 'date' | 'number' | 'text' | 'aging' | 'priority' => {
  if (!data || data.length === 0) return 'text';
  
  // Sample a few data points to determine type
  const sampleSize = Math.min(data.length, 5);
  let dateCount = 0;
  let numberCount = 0;
  let agingCount = 0;
  let priorityCount = 0;
  
  for (let i = 0; i < sampleSize; i++) {
    const name = data[i].name.toLowerCase();
    
    // Check for aging buckets (Accounts Receivable style)
    if (isAgingBucket(name)) {
      agingCount++;
    }
    // Check for priority levels
    else if (isPriorityLevel(name)) {
      priorityCount++;
    }
    // Check if it's a date-like string
    else if (isDateLike(data[i].name)) {
      dateCount++;
    }
    // Check if it's a number
    else if (!isNaN(Number(data[i].name)) && !isNaN(parseFloat(data[i].name))) {
      numberCount++;
    }
  }
  
  // Return most specific type first
  if (agingCount > sampleSize / 2) return 'aging';
  if (priorityCount > sampleSize / 2) return 'priority';
  if (dateCount > sampleSize / 2) return 'date';
  if (numberCount > sampleSize / 2) return 'number';
  return 'text';
};

// Check for aging bucket patterns
const isAgingBucket = (str: string): boolean => {
  const agingPatterns = [
    /^\d+-\d+\s*days?$/i,           // "0-30 days", "31-60 Days"
    /^current$/i,                   // "Current"
    /^over\s*\d+\s*days?$/i,        // "Over 90 days"
    /^\d+\+\s*days?$/i,             // "90+ days"
    /^past\s*due$/i,                // "Past Due"
    /^\d+-\d+$/,                    // "0-30"
  ];
  
  return agingPatterns.some(pattern => pattern.test(str));
};

// Check for priority level patterns
const isPriorityLevel = (str: string): boolean => {
  const priorityPatterns = [
    /^(low|medium|high|critical)$/i,
    /^(urgent|normal|low)$/i,
    /^priority\s*[1-5]$/i,
    /^p[1-5]$/i
  ];
  
  return priorityPatterns.some(pattern => pattern.test(str));
};

// Check if a string looks like a date
const isDateLike = (str: string): boolean => {
  // Common date patterns
  const datePatterns = [
    /^\d{4}$/,                           // "2024"
    /^Q[1-4]\s+\d{4}$/,                  // "Q1 2024"
    /^[A-Za-z]{3}\s+\d{4}$/,             // "Jan 2024"
    /^[A-Za-z]{3}\s+\d{2}$/,             // "Jan 24"
    /^\d{1,2}\/\d{4}$/,                  // "01/2024"
    /^\d{4}-\d{2}$/,                     // "2024-01"
    /^\d{4}-\d{2}-\d{2}$/,               // "2024-01-15"
    /^Week\s+\d+/,                       // "Week 25"
    /^\d{1,2}-\d{1,2}$/                  // "01-15"
  ];
  
  return datePatterns.some(pattern => pattern.test(str));
};

// Sort by original database order
export const sortByDefaultOrder = (data: ChartDataPoint[]): ChartDataPoint[] => {
  return [...data].sort((a, b) => {
    // If sort order is available, use it
    if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
      return a.sortOrder - b.sortOrder;
    }
    // Fallback to maintaining current array order
    return 0;
  });
};

// Sort aging buckets in logical order
export const sortAgingData = (data: ChartDataPoint[]): ChartDataPoint[] => {
  const agingOrder = [
    'current',
    '0-30', '0-30 days',
    '31-60', '31-60 days',
    '61-90', '61-90 days',
    '91-120', '91-120 days',
    'over 90', 'over 90 days',
    '90+', '90+ days',
    'over 120', 'over 120 days',
    '120+', '120+ days',
    'past due'
  ];

  return [...data].sort((a, b) => {
    const aIndex = agingOrder.findIndex(order => 
      a.name.toLowerCase().includes(order.toLowerCase())
    );
    const bIndex = agingOrder.findIndex(order => 
      b.name.toLowerCase().includes(order.toLowerCase())
    );
    
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.name.localeCompare(b.name);
  });
};

// Sort priority levels in logical order
export const sortPriorityData = (data: ChartDataPoint[]): ChartDataPoint[] => {
  const priorityOrder = ['critical', 'high', 'urgent', 'medium', 'normal', 'low'];
  
  return [...data].sort((a, b) => {
    const aIndex = priorityOrder.findIndex(priority => 
      a.name.toLowerCase().includes(priority)
    );
    const bIndex = priorityOrder.findIndex(priority => 
      b.name.toLowerCase().includes(priority)
    );
    
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.name.localeCompare(b.name);
  });
};

// Sort text data alphabetically
export const sortTextData = (data: ChartDataPoint[]): ChartDataPoint[] => {
  return [...data].sort((a, b) => {
    return a.name.localeCompare(b.name, undefined, { 
      numeric: true, 
      sensitivity: 'base' 
    });
  });
};

// Sort numeric data
export const sortNumericData = (data: ChartDataPoint[]): ChartDataPoint[] => {
  return [...data].sort((a, b) => {
    const numA = parseFloat(a.name);
    const numB = parseFloat(b.name);
    return numA - numB;
  });
};

// Sort date data chronologically
export const sortTimeData = (data: ChartDataPoint[]): ChartDataPoint[] => {
  return [...data].sort((a, b) => {
    const dateA = parseTimeString(a.name);
    const dateB = parseTimeString(b.name);
    return dateA.getTime() - dateB.getTime();
  });
};

// Parse various time string formats
const parseTimeString = (timeStr: string): Date => {
  // Handle year only
  if (/^\d{4}$/.test(timeStr)) {
    return new Date(parseInt(timeStr), 0, 1);
  }
  
  // Handle quarter format "Q1 2024"
  if (/^Q([1-4])\s+(\d{4})$/.test(timeStr)) {
    const match = timeStr.match(/^Q([1-4])\s+(\d{4})$/);
    if (match) {
      const quarter = parseInt(match[1]);
      const year = parseInt(match[2]);
      return new Date(year, (quarter - 1) * 3, 1);
    }
  }
  
  // Handle month year "Jan 2024" or "January 2024"
  if (/^[A-Za-z]{3,}\s+\d{4}$/.test(timeStr)) {
    const match = timeStr.match(/^([A-Za-z]{3,})\s+(\d{4})$/);
    if (match) {
      const monthStr = match[1];
      const year = parseInt(match[2]);
      const monthMap: { [key: string]: number } = {
        'jan': 0, 'january': 0, 'feb': 1, 'february': 1, 'mar': 2, 'march': 2,
        'apr': 3, 'april': 3, 'may': 4, 'jun': 5, 'june': 5,
        'jul': 6, 'july': 6, 'aug': 7, 'august': 7, 'sep': 8, 'september': 8,
        'oct': 9, 'october': 9, 'nov': 10, 'november': 10, 'dec': 11, 'december': 11
      };
      const month = monthMap[monthStr.toLowerCase()] ?? 0;
      return new Date(year, month, 1);
    }
  }
  
  // Handle week format "Week 25"
  if (/^Week\s+(\d+)/.test(timeStr)) {
    const match = timeStr.match(/^Week\s+(\d+)/);
    if (match) {
      const week = parseInt(match[1]);
      // Approximate week to date (current year, week number)
      const currentYear = new Date().getFullYear();
      return new Date(currentYear, 0, 1 + (week - 1) * 7);
    }
  }
  
  // Handle MM/YYYY format
  if (/^\d{1,2}\/\d{4}$/.test(timeStr)) {
    const [month, year] = timeStr.split('/');
    return new Date(parseInt(year), parseInt(month) - 1, 1);
  }
  
  // Handle YYYY-MM format
  if (/^\d{4}-\d{2}$/.test(timeStr)) {
    const [year, month] = timeStr.split('-');
    return new Date(parseInt(year), parseInt(month) - 1, 1);
  }
  
  // Handle YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(timeStr)) {
    return new Date(timeStr);
  }
  
  // Fallback: try to parse as regular date
  const parsed = new Date(timeStr);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
};

// Updated main sorting function - no longer auto-applies sorting
export const applySorting = (data: ChartDataPoint[], sortType: string): ChartDataPoint[] => {
  if (!data || data.length === 0) return data;
  
  console.log('Applying sort type:', sortType, 'to data:', data);
  
  switch (sortType) {
    case 'default':
      return sortByDefaultOrder(data);
    case 'alphabetical':
      return sortTextData(data);
    case 'reverse-alphabetical':
      return sortTextData(data).reverse();
    case 'value-ascending':
      return [...data].sort((a, b) => (a.value || 0) - (b.value || 0));
    case 'value-descending':
      return [...data].sort((a, b) => (b.value || 0) - (a.value || 0));
    case 'chronological':
      return sortTimeData(data);
    case 'reverse-chronological':
      return sortTimeData(data).reverse();
    case 'aging-logical':
      return sortAgingData(data);
    case 'priority-logical':
      return sortPriorityData(data);
    default:
      // For backwards compatibility, detect type and apply appropriate sorting
      const dataType = detectDataType(data);
      switch (dataType) {
        case 'aging':
          return sortAgingData(data);
        case 'priority':
          return sortPriorityData(data);
        case 'date':
          return sortTimeData(data);
        case 'number':
          return sortNumericData(data);
        default:
          return sortByDefaultOrder(data);
      }
  }
};
