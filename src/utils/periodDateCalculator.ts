
export const calculatePeriodDates = (
  year: number,
  periodType: 'year' | 'quarter' | 'month' | 'week',
  quarter?: number,
  month?: number,
  week?: number
): { start: string; end: string } => {
  let startDate: Date;
  let endDate: Date;

  switch (periodType) {
    case 'year':
      startDate = new Date(year, 0, 1); // January 1st
      endDate = new Date(year, 11, 31); // December 31st
      break;
      
    case 'quarter':
      if (!quarter) throw new Error('Quarter is required for quarterly periods');
      const quarterStartMonth = (quarter - 1) * 3;
      startDate = new Date(year, quarterStartMonth, 1);
      endDate = new Date(year, quarterStartMonth + 3, 0); // Last day of quarter
      break;
      
    case 'month':
      if (!month) throw new Error('Month is required for monthly periods');
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0); // Last day of month
      break;
      
    case 'week':
      if (!week) throw new Error('Week is required for weekly periods');
      // Calculate the first day of the year
      const yearStart = new Date(year, 0, 1);
      // Find the Monday of the first week
      const firstMonday = new Date(yearStart);
      const dayOfWeek = yearStart.getDay();
      const daysToMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek; // If Sunday, add 1 day; otherwise 8 - dayOfWeek
      firstMonday.setDate(yearStart.getDate() + daysToMonday);
      
      // Calculate the start of the specified week
      startDate = new Date(firstMonday);
      startDate.setDate(firstMonday.getDate() + (week - 1) * 7);
      
      // End date is 6 days later (Sunday)
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      break;
      
    default:
      throw new Error(`Unsupported period type: ${periodType}`);
  }

  return {
    start: startDate.toISOString().split('T')[0], // YYYY-MM-DD format
    end: endDate.toISOString().split('T')[0]
  };
};

export const formatPeriodDisplay = (
  year: number,
  periodType: 'year' | 'quarter' | 'month' | 'week',
  quarter?: number,
  month?: number,
  week?: number
): string => {
  switch (periodType) {
    case 'year':
      return `${year}`;
    case 'quarter':
      return `Q${quarter} ${year}`;
    case 'month':
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return `${monthNames[(month || 1) - 1]} ${year}`;
    case 'week':
      return `Week ${week} of ${year}`;
    default:
      return 'Unknown period';
  }
};
