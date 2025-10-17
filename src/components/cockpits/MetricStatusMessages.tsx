
import React from "react";

interface MetricStatusMessagesProps {
  error: Error | null;
  hasValidData: boolean;
  isLoading: boolean;
  shouldShowChart: boolean;
  dataType?: 'single' | 'multiple';
  hasChartData?: boolean;
}

const MetricStatusMessages: React.FC<MetricStatusMessagesProps> = ({
  error,
  hasValidData,
  isLoading,
  shouldShowChart,
  dataType,
  hasChartData = false
}) => {
  if (error && dataType === 'multiple') {
    return (
      <div className="mt-2 text-center text-red-500 text-sm">
        Error loading data: {error.message}
      </div>
    );
  }

  // Only show "no data" message for multi-value metrics when we should show a chart 
  // but have no valid data AND no chart data from metric configuration and aren't loading
  if (dataType === 'multiple' && shouldShowChart && !hasValidData && !hasChartData && !isLoading) {
    return (
      <div className="mt-2 text-center text-xs text-blue-500">
        Demo data - No historical data available
      </div>
    );
  }

  return null;
};

export default MetricStatusMessages;
