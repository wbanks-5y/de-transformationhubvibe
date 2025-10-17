
interface ExportObjective {
  name: string;
  perspective: string;
  owner: string;
  healthScore: number;
  ragStatus: string;
  targetDescription: string;
  notes?: string;
}

export const exportHeatmapData = (
  data: any[], 
  period: string, 
  format: 'csv' | 'json' = 'csv'
) => {
  const exportData: ExportObjective[] = data.map(item => ({
    name: item.strategic_objectives?.display_name || 'Unknown',
    perspective: item.strategic_objectives?.perspective || 'Unknown',
    owner: item.strategic_objectives?.owner || 'Unassigned',
    healthScore: Math.round(item.health_score),
    ragStatus: item.rag_status?.toUpperCase() || 'UNKNOWN',
    targetDescription: item.strategic_objectives?.target_description || '',
    notes: item.notes || ''
  }));

  const periodName = getPeriodDisplayName(period);
  const timestamp = new Date().toISOString().split('T')[0];
  
  if (format === 'csv') {
    exportToCSV(exportData, `strategy-heatmap-${period}-${timestamp}`);
  } else {
    exportToJSON(exportData, `strategy-heatmap-${period}-${timestamp}`);
  }
};

const exportToCSV = (data: ExportObjective[], filename: string) => {
  const headers = [
    'Objective Name',
    'Perspective', 
    'Owner',
    'Health Score',
    'RAG Status',
    'Target Description',
    'Notes'
  ];

  const csvContent = [
    headers.join(','),
    ...data.map(row => [
      `"${row.name}"`,
      `"${row.perspective}"`,
      `"${row.owner}"`,
      row.healthScore,
      `"${row.ragStatus}"`,
      `"${row.targetDescription}"`,
      `"${row.notes}"`
    ].join(','))
  ].join('\n');

  downloadFile(csvContent, `${filename}.csv`, 'text/csv');
};

const exportToJSON = (data: ExportObjective[], filename: string) => {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, `${filename}.json`, 'application/json');
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

const getPeriodDisplayName = (period: string): string => {
  const periods: Record<string, string> = {
    'current': 'Current Period',
    'q1': 'Q1 2024',
    'q2': 'Q2 2024', 
    'q3': 'Q3 2024',
    'q4': 'Q4 2024'
  };
  return periods[period] || period;
};
