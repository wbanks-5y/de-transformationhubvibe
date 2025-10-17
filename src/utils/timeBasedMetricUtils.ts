export interface TimeBasedDataPoint {
  year: number;
  month?: number;
  quarter?: number;
  week?: number;
  day?: number;
  date_value?: string;
  value: number;
  series_name: string;
  series_color: string;
}

export type TimeGranularity = 'year' | 'quarter' | 'month' | 'week' | 'day';

export const validateTimeBasedDataPoint = (
  newPoint: Partial<TimeBasedDataPoint>,
  existingPoints: TimeBasedDataPoint[],
  granularity: TimeGranularity,
  seriesName: string
): { isValid: boolean; message?: string } => {
  const pointsForSeries = existingPoints.filter(p => p.series_name === seriesName);

  const isDuplicate = pointsForSeries.some(point => {
    switch (granularity) {
      case 'year':
        return point.year === newPoint.year;
      case 'quarter':
        return point.year === newPoint.year && point.quarter === newPoint.quarter;
      case 'month':
        return point.year === newPoint.year && point.month === newPoint.month;
      case 'week':
        return point.year === newPoint.year && point.week === newPoint.week;
      case 'day':
        return point.date_value === newPoint.date_value;
      default:
        return false;
    }
  });

  if (isDuplicate) {
    const timeDescription = getTimeDescription(newPoint, granularity);
    return {
      isValid: false,
      message: `A data point for ${timeDescription} already exists for ${seriesName}. Please choose a different time period.`
    };
  }

  return { isValid: true };
};

export const getNextDefaultTimePeriod = (
  existingPoints: TimeBasedDataPoint[],
  granularity: TimeGranularity,
  seriesName: string
): Partial<TimeBasedDataPoint> => {
  const pointsForSeries = existingPoints.filter(p => p.series_name === seriesName);
  
  if (pointsForSeries.length === 0) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    switch (granularity) {
      case 'year':
        return { year: currentYear };
      case 'quarter':
        return { year: currentYear, quarter: Math.ceil((currentDate.getMonth() + 1) / 3) };
      case 'month':
        return { year: currentYear, month: currentDate.getMonth() + 1 };
      case 'week':
        return { year: currentYear, week: getWeekOfYear(currentDate) };
      case 'day':
        const dateStr = currentDate.toISOString().split('T')[0];
        return { 
          year: currentYear, 
          month: currentDate.getMonth() + 1,
          day: currentDate.getDate(),
          date_value: dateStr 
        };
      default:
        return { year: currentYear };
    }
  }

  // Find the latest time period and suggest the next one
  const sortedPoints = [...pointsForSeries].sort((a, b) => {
    switch (granularity) {
      case 'year':
        return b.year - a.year;
      case 'quarter':
        return (b.year * 4 + (b.quarter || 1)) - (a.year * 4 + (a.quarter || 1));
      case 'month':
        return (b.year * 12 + (b.month || 1)) - (a.year * 12 + (a.month || 1));
      case 'week':
        return (b.year * 53 + (b.week || 1)) - (a.year * 53 + (a.week || 1));
      case 'day':
        if (a.date_value && b.date_value) {
          return new Date(b.date_value).getTime() - new Date(a.date_value).getTime();
        }
        return 0;
      default:
        return 0;
    }
  });

  const latestPoint = sortedPoints[0];
  
  switch (granularity) {
    case 'year':
      return { year: latestPoint.year + 1 };
    case 'quarter':
      const nextQuarter = (latestPoint.quarter || 1) + 1;
      if (nextQuarter > 4) {
        return { year: latestPoint.year + 1, quarter: 1 };
      }
      return { year: latestPoint.year, quarter: nextQuarter };
    case 'month':
      const nextMonth = (latestPoint.month || 1) + 1;
      if (nextMonth > 12) {
        return { year: latestPoint.year + 1, month: 1 };
      }
      return { year: latestPoint.year, month: nextMonth };
    case 'week':
      const nextWeek = (latestPoint.week || 1) + 1;
      if (nextWeek > 53) {
        return { year: latestPoint.year + 1, week: 1 };
      }
      return { year: latestPoint.year, week: nextWeek };
    case 'day':
      if (latestPoint.date_value) {
        const nextDate = new Date(latestPoint.date_value);
        nextDate.setDate(nextDate.getDate() + 1);
        const dateStr = nextDate.toISOString().split('T')[0];
        return {
          year: nextDate.getFullYear(),
          month: nextDate.getMonth() + 1,
          day: nextDate.getDate(),
          date_value: dateStr
        };
      }
      return { year: latestPoint.year };
    default:
      return { year: latestPoint.year };
  }
};

const getTimeDescription = (point: Partial<TimeBasedDataPoint>, granularity: TimeGranularity): string => {
  switch (granularity) {
    case 'year':
      return `${point.year}`;
    case 'quarter':
      return `Q${point.quarter} ${point.year}`;
    case 'month':
      return `${getMonthName(point.month || 1)} ${point.year}`;
    case 'week':
      return `Week ${point.week} of ${point.year}`;
    case 'day':
      return point.date_value || 'Unknown date';
    default:
      return 'Unknown period';
  }
};

const getMonthName = (month: number): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month - 1] || 'Unknown';
};

const getWeekOfYear = (date: Date): number => {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return Math.ceil((dayOfYear + start.getDay() + 1) / 7);
};

export const getExistingTimePeriods = (
  points: TimeBasedDataPoint[],
  granularity: TimeGranularity,
  seriesName: string
): string[] => {
  const pointsForSeries = points.filter(p => p.series_name === seriesName);
  
  return pointsForSeries.map(point => getTimeDescription(point, granularity));
};

export const hasValidationErrors = (
  points: TimeBasedDataPoint[],
  granularity: TimeGranularity,
  series: { name: string }[]
): boolean => {
  for (const seriesItem of series) {
    const pointsForSeries = points.filter(p => p.series_name === seriesItem.name);
    
    // Check for duplicates within this series
    const timeKeys = new Set<string>();
    for (const point of pointsForSeries) {
      let timeKey = '';
      switch (granularity) {
        case 'year':
          timeKey = `${point.year}`;
          break;
        case 'quarter':
          timeKey = `${point.year}-Q${point.quarter}`;
          break;
        case 'month':
          timeKey = `${point.year}-${point.month}`;
          break;
        case 'week':
          timeKey = `${point.year}-W${point.week}`;
          break;
        case 'day':
          timeKey = point.date_value || '';
          break;
      }
      
      if (timeKeys.has(timeKey)) {
        return true; // Found duplicate
      }
      timeKeys.add(timeKey);
    }
  }
  
  return false;
};

export const getAvailableYears = (
  existingPoints: TimeBasedDataPoint[],
  seriesName: string,
  granularity: TimeGranularity
): { value: number; label: string; disabled: boolean }[] => {
  const pointsForSeries = existingPoints.filter(p => p.series_name === seriesName);
  const usedYears = new Set(pointsForSeries.map(p => p.year));
  
  // Generate year range (current year ± 10 years, or based on existing data)
  const currentYear = new Date().getFullYear();
  const existingYears = existingPoints.map(p => p.year);
  const minYear = existingYears.length > 0 ? Math.min(...existingYears, currentYear - 5) : currentYear - 5;
  const maxYear = existingYears.length > 0 ? Math.max(...existingYears, currentYear + 5) : currentYear + 5;
  
  const years = [];
  for (let year = minYear; year <= maxYear; year++) {
    const isUsed = granularity === 'year' ? usedYears.has(year) : false;
    years.push({
      value: year,
      label: year.toString(),
      disabled: isUsed
    });
  }
  
  return years.sort((a, b) => b.value - a.value); // Most recent first
};

export const getAvailableMonths = (
  existingPoints: TimeBasedDataPoint[],
  seriesName: string,
  selectedYear: number
): { value: number; label: string; disabled: boolean }[] => {
  const pointsForSeries = existingPoints.filter(p => 
    p.series_name === seriesName && p.year === selectedYear
  );
  const usedMonths = new Set(pointsForSeries.map(p => p.month));
  
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  return months.map((month, index) => ({
    value: index + 1,
    label: `${index + 1} - ${month}`,
    disabled: usedMonths.has(index + 1)
  }));
};

export const getAvailableQuarters = (
  existingPoints: TimeBasedDataPoint[],
  seriesName: string,
  selectedYear: number
): { value: number; label: string; disabled: boolean }[] => {
  const pointsForSeries = existingPoints.filter(p => 
    p.series_name === seriesName && p.year === selectedYear
  );
  const usedQuarters = new Set(pointsForSeries.map(p => p.quarter));
  
  return [1, 2, 3, 4].map(quarter => ({
    value: quarter,
    label: `Q${quarter}`,
    disabled: usedQuarters.has(quarter)
  }));
};

export const getAvailableWeeks = (
  existingPoints: TimeBasedDataPoint[],
  seriesName: string,
  selectedYear: number
): { value: number; label: string; disabled: boolean }[] => {
  const pointsForSeries = existingPoints.filter(p => 
    p.series_name === seriesName && p.year === selectedYear
  );
  const usedWeeks = new Set(pointsForSeries.map(p => p.week));
  
  const weeks = [];
  for (let week = 1; week <= 53; week++) {
    weeks.push({
      value: week,
      label: `Week ${week}`,
      disabled: usedWeeks.has(week)
    });
  }
  
  return weeks;
};
