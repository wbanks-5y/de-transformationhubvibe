
export interface DateRange {
  startDate: string;
  endDate: string;
}

export const calculateDateRange = (period: string): DateRange => {
  const now = new Date();
  const endDate = now.toISOString();
  let startDate: Date;

  switch (period) {
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '3m':
      startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      break;
    case '6m':
      startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
      break;
    case '1y':
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      break;
    case '2y':
      startDate = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
      break;
    default:
      // Default to last 30 days
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  return {
    startDate: startDate.toISOString(),
    endDate
  };
};

export const formatDateForDisplay = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Helper function to check if a timestamp falls within a date range
export const isWithinDateRange = (timestamp: string, dateRange: DateRange): boolean => {
  const date = new Date(timestamp);
  const start = new Date(dateRange.startDate);
  const end = new Date(dateRange.endDate);
  
  return date >= start && date <= end;
};

// Helper function to filter metric data by date range
export const filterMetricDataByDateRange = <T extends { timestamp: string }>(
  data: T[],
  dateRange: DateRange
): T[] => {
  return data.filter(item => isWithinDateRange(item.timestamp, dateRange));
};
