
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
  seriesName?: string;
}

interface D3BarChartProps {
  data: ChartDataPoint[];
  width?: number;
  height?: number;
  isHorizontal?: boolean;
  showSeriesLabels?: boolean;
  margin?: { top: number; right: number; bottom: number; left: number };
}

const D3BarChart: React.FC<D3BarChartProps> = ({
  data,
  width = 300,
  height = 200,
  isHorizontal = false,
  showSeriesLabels = false,
  margin
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Determine chart size categories with more conservative thresholds
    const isSmall = width < 250 || height < 180;
    const isVerySmall = width < 180 || height < 140;
    const isLarge = width > 400;
    const isXL = width > 600;
    
    // Calculate legend space needed
    const uniqueSeries = Array.from(new Set(data.map(d => d.seriesName || 'Series').filter(Boolean)));
    const legendHeight = showSeriesLabels && uniqueSeries.length > 1 ? (isVerySmall ? 18 : isSmall ? 22 : 26) : 0;
    
    // More aggressive margin calculations for larger charts
    const getMargins = () => {
      if (isXL) {
        return isHorizontal ? {
          top: 20, right: 30, bottom: legendHeight + 40, left: 80
        } : {
          top: 20, right: 20, bottom: legendHeight + 50, left: 50
        };
      } else if (isLarge) {
        return isHorizontal ? {
          top: 16, right: 24, bottom: legendHeight + 32, left: 65
        } : {
          top: 16, right: 16, bottom: legendHeight + 40, left: 40
        };
      } else {
        return isHorizontal ? {
          top: isVerySmall ? 6 : isSmall ? 8 : 12,
          right: isVerySmall ? 10 : isSmall ? 12 : 16,
          bottom: legendHeight + (isVerySmall ? 12 : isSmall ? 16 : 20),
          left: isVerySmall ? 35 : isSmall ? 45 : 55
        } : {
          top: isVerySmall ? 6 : isSmall ? 8 : 12,
          right: isVerySmall ? 8 : isSmall ? 10 : 12,
          bottom: legendHeight + (isVerySmall ? 20 : isSmall ? 28 : 35),
          left: isVerySmall ? 20 : isSmall ? 25 : 32
        };
      }
    };
    
    const finalMargin = margin || getMargins();
    const innerWidth = Math.max(width - finalMargin.left - finalMargin.right, 40);
    const innerHeight = Math.max(height - finalMargin.top - finalMargin.bottom, 40);

    // Create main chart group
    const g = svg
      .append("g")
      .attr("transform", `translate(${finalMargin.left},${finalMargin.top})`);

    // Create legend if we have multiple series with larger fonts
    if (showSeriesLabels && uniqueSeries.length > 1) {
      const seriesColors = new Map();
      
      // Build series color mapping
      data.forEach(d => {
        const series = d.seriesName || 'Series';
        if (!seriesColors.has(series)) {
          seriesColors.set(series, d.color || '#3B82F6');
        }
      });

      const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${finalMargin.left}, ${height - legendHeight + 3})`);

      const itemWidth = Math.min(innerWidth / uniqueSeries.length, isVerySmall ? 50 : isSmall ? 65 : 80);
      
      const legendItems = legend.selectAll(".legend-item")
        .data(uniqueSeries)
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(${i * itemWidth}, 0)`);

      legendItems.append("rect")
        .attr("width", isVerySmall ? 6 : isSmall ? 7 : 9)
        .attr("height", isVerySmall ? 6 : isSmall ? 7 : 9)
        .attr("fill", d => seriesColors.get(d) || '#3B82F6');

      legendItems.append("text")
        .attr("x", isVerySmall ? 9 : isSmall ? 11 : 13)
        .attr("y", isVerySmall ? 3 : isSmall ? 4 : 5)
        .attr("dy", ".35em")
        .style("font-size", isVerySmall ? "8px" : isSmall ? "9px" : "11px")
        .style("fill", "#374151")
        .text(d => {
          const maxLength = isVerySmall ? 4 : isSmall ? 6 : 10;
          return d.length > maxLength ? d.substring(0, maxLength) + "..." : d;
        });
    }

    if (isHorizontal) {
      // Horizontal bar chart
      const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value) || 0])
        .range([0, innerWidth]);

      const yScale = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, innerHeight])
        .padding(0.3);

      // Create bars
      g.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("y", d => yScale(d.name) || 0)
        .attr("width", d => xScale(d.value))
        .attr("height", yScale.bandwidth())
        .attr("fill", d => d.color || "#3B82F6")
        .attr("rx", 1);

      // Add x-axis with larger fonts
      const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format(".0s"))
        .ticks(isVerySmall ? 2 : isSmall ? 3 : 4);

      g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(xAxis)
        .selectAll("text")
        .style("font-size", isVerySmall ? "8px" : isSmall ? "9px" : "11px")
        .style("fill", "#666");

      // Add y-axis with truncated labels and larger fonts
      const yAxis = d3.axisLeft(yScale);
      
      g.append("g")
        .call(yAxis)
        .selectAll("text")
        .style("font-size", isVerySmall ? "7px" : isSmall ? "8px" : "10px")
        .style("fill", "#666")
        .text((d: string) => {
          const maxLength = isVerySmall ? 3 : isSmall ? 5 : 8;
          return d.length > maxLength ? d.substring(0, maxLength) + "..." : d;
        });

      // Add value labels only for larger charts with larger fonts
      if (!isVerySmall && !isSmall && innerWidth > 150) {
        g.selectAll(".label")
          .data(data)
          .enter()
          .append("text")
          .attr("class", "label")
          .attr("x", d => Math.min(xScale(d.value) + 3, innerWidth - 3))
          .attr("y", d => (yScale(d.name) || 0) + yScale.bandwidth() / 2)
          .attr("dy", ".35em")
          .style("font-size", "10px")
          .style("fill", "#666")
          .style("font-weight", "500")
          .text(d => d3.format(".0s")(d.value));
      }

    } else {
      // Vertical bar chart
      const xScale = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, innerWidth])
        .padding(isLarge || isXL ? 0.4 : 0.3);

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value) || 0])
        .range([innerHeight, 0]);

      // Create bars
      g.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.name) || 0)
        .attr("y", d => yScale(d.value))
        .attr("width", xScale.bandwidth())
        .attr("height", d => innerHeight - yScale(d.value))
        .attr("fill", d => d.color || "#3B82F6")
        .attr("rx", 1);

      // Add x-axis with better label handling for larger charts and larger fonts
      const xAxis = d3.axisBottom(xScale);
      
      g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(xAxis)
        .selectAll("text")
        .style("font-size", isVerySmall ? "6px" : isSmall ? "7px" : isLarge ? "11px" : isXL ? "12px" : "9px")
        .style("fill", "#666")
        .attr("transform", isLarge || isXL ? "rotate(-15)" : "rotate(-25)")
        .style("text-anchor", "end")
        .attr("dx", "-.6em")
        .attr("dy", ".1em")
        .text((d: string) => {
          const maxLength = isXL ? 12 : isLarge ? 10 : isVerySmall ? 2 : isSmall ? 3 : 6;
          return d.length > maxLength ? d.substring(0, maxLength) + "..." : d;
        });

      // Add y-axis with larger fonts
      const yAxis = d3.axisLeft(yScale)
        .tickFormat(d3.format(".0s"))
        .ticks(isVerySmall ? 2 : isSmall ? 3 : isLarge ? 6 : isXL ? 8 : 4);

      g.append("g")
        .call(yAxis)
        .selectAll("text")
        .style("font-size", isVerySmall ? "7px" : isSmall ? "8px" : isLarge ? "11px" : isXL ? "12px" : "10px")
        .style("fill", "#666");

      // Add value labels for larger charts with better positioning and larger fonts
      if ((isLarge || isXL) && innerHeight > 150) {
        g.selectAll(".label")
          .data(data)
          .enter()
          .append("text")
          .attr("class", "label")
          .attr("x", d => (xScale(d.name) || 0) + xScale.bandwidth() / 2)
          .attr("y", d => Math.max(yScale(d.value) - 5, 10))
          .attr("text-anchor", "middle")
          .style("font-size", isXL ? "12px" : "11px")
          .style("fill", "#666")
          .style("font-weight", "500")
          .text(d => d3.format(".0s")(d.value));
      }
    }

  }, [data, width, height, isHorizontal, showSeriesLabels, margin]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{ overflow: 'hidden' }}
      viewBox={`0 0 ${width} ${height}`}
    />
  );
};

export default D3BarChart;
