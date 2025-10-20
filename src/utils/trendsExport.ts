interface TrendExportData {
  objectiveId: string;
  objectiveName: string;
  perspective: string;
  currentScore: number;
  previousScore: number;
  trendDirection: 'up' | 'down' | 'stable';
  trendPercentage: number;
  ragStatus: string;
}

export const exportTrendsData = (
  data: TrendExportData[], 
  timeframe: string
) => {
  const exportData = data.map(item => ({
    'Objective Name': item.objectiveName,
    'Perspective': item.perspective,
    'Current Score': item.currentScore,
    'Previous Score': item.previousScore,
    'Trend Direction': item.trendDirection.toUpperCase(),
    'Change Percentage': `${item.trendPercentage > 0 ? '+' : ''}${Math.round(item.trendPercentage)}%`,
    'RAG Status': item.ragStatus.toUpperCase()
  }));

  const timestamp = new Date().toISOString().split('T')[0];
  exportToCSV(exportData, `performance-trends-${timeframe}-${timestamp}`);
};

const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape values that contain commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  downloadFile(csvContent, `${filename}.csv`, 'text/csv');
};

const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
