import React from 'react';
import SimpleBarChart from '@/components/charts/SimpleBarChart';
import SimpleLineChart from '@/components/charts/SimpleLineChart';
import SimplePieChart from '@/components/charts/SimplePieChart';

interface ChartData {
  name: string;
  value: number;
}

interface ChartParserProps {
  content: string;
}

const ChartParser: React.FC<ChartParserProps> = ({ content }) => {
  const parseContent = (text: string) => {
    const chartRegex = /\[CHART:(bar|line|pie|area):([^:]+):(\[.*?\])\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = chartRegex.exec(text)) !== null) {
      // Add text before the chart
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.slice(lastIndex, match.index)
        });
      }

      // Parse chart data
      try {
        const chartType = match[1];
        const chartTitle = match[2];
        const chartData = JSON.parse(match[3]);
        
        parts.push({
          type: 'chart',
          chartType,
          title: chartTitle,
          data: chartData
        });
      } catch (error) {
        console.error('Error parsing chart data:', error);
        // If parsing fails, treat as regular text
        parts.push({
          type: 'text',
          content: match[0]
        });
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex)
      });
    }

    return parts;
  };

  const renderChart = (type: string, title: string, data: ChartData[]) => {
    const chartProps = {
      data,
      title,
      className: "h-64 w-full my-4"
    };

    switch (type) {
      case 'bar':
        return <SimpleBarChart key={`chart-${Date.now()}`} {...chartProps} />;
      case 'line':
        return <SimpleLineChart key={`chart-${Date.now()}`} {...chartProps} />;
      case 'pie':
        return <SimplePieChart key={`chart-${Date.now()}`} {...chartProps} />;
      case 'area':
        return <SimpleLineChart key={`chart-${Date.now()}`} {...chartProps} />;
      default:
        return null;
    }
  };

  const parsedContent = parseContent(content);

  return (
    <div>
      {parsedContent.map((part, index) => {
        if (part.type === 'text') {
          return <span key={index}>{part.content}</span>;
        } else if (part.type === 'chart') {
          return (
            <div key={index} className="my-4">
              {renderChart(part.chartType, part.title, part.data)}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default ChartParser;
