
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

interface D3LineChartProps {
  data: ChartDataPoint[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
}

const D3LineChart: React.FC<D3LineChartProps> = ({
  data,
  width = 300,
  height = 200,
  color = "#3B82F6",
  strokeWidth = 2,
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

    // More aggressive margin calculations for larger charts
    const getMargins = () => {
      if (isXL) {
        return {
          top: 25, right: 35, bottom: 65, left: 65
        };
      } else if (isLarge) {
        return {
          top: 20, right: 28, bottom: 55, left: 55
        };
      } else {
        return {
          top: isVerySmall ? 10 : isSmall ? 12 : 16,
          right: isVerySmall ? 10 : isSmall ? 15 : 20,
          bottom: isVerySmall ? 25 : isSmall ? 35 : 45,
          left: isVerySmall ? 25 : isSmall ? 35 : 45
        };
      }
    };

    const finalMargin = margin || getMargins();
    const innerWidth = Math.max(width - finalMargin.left - finalMargin.right, 40);
    const innerHeight = Math.max(height - finalMargin.top - finalMargin.bottom, 40);

    const g = svg
      .append("g")
      .attr("transform", `translate(${finalMargin.left},${finalMargin.top})`);

    // Create scales
    const xScale = d3.scalePoint()
      .domain(data.map(d => d.name))
      .range([0, innerWidth])
      .padding(isLarge || isXL ? 0.2 : 0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .range([innerHeight, 0]);

    // Create line generator
    const line = d3.line<ChartDataPoint>()
      .x(d => xScale(d.name) || 0)
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Add x-axis with larger fonts
    const xAxis = d3.axisBottom(xScale);
    
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll("text")
      .style("font-size", isVerySmall ? "8px" : isSmall ? "10px" : isLarge ? "12px" : isXL ? "14px" : "11px")
      .style("fill", "#666")
      .attr("transform", isLarge || isXL ? "rotate(-15)" : "rotate(-35)")
      .style("text-anchor", "end")
      .attr("dx", "-.6em")
      .attr("dy", ".1em")
      .text((d: string) => {
        const maxLength = isXL ? 15 : isLarge ? 12 : isVerySmall ? 2 : isSmall ? 4 : 8;
        return d.length > maxLength ? d.substring(0, maxLength) + "..." : d;
      });

    // Add y-axis with larger fonts
    const yAxis = d3.axisLeft(yScale)
      .tickFormat(d3.format(".0s"))
      .ticks(isVerySmall ? 2 : isSmall ? 3 : isLarge ? 6 : isXL ? 8 : 4);

    g.append("g")
      .call(yAxis)
      .selectAll("text")
      .style("font-size", isVerySmall ? "8px" : isSmall ? "10px" : isLarge ? "12px" : isXL ? "14px" : "11px")
      .style("fill", "#666");

    // Add the line
    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", isVerySmall ? 1 : isLarge || isXL ? strokeWidth + 1 : strokeWidth)
      .attr("d", line);

    // Add dots
    g.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", d => xScale(d.name) || 0)
      .attr("cy", d => yScale(d.value))
      .attr("r", isVerySmall ? 1.5 : isSmall ? 2 : isLarge ? 4 : isXL ? 5 : 3)
      .attr("fill", color)
      .attr("stroke", "white")
      .attr("stroke-width", isVerySmall ? 0.5 : isLarge || isXL ? 2 : 1);

    // Add value labels for larger charts with better spacing and larger fonts
    if ((isLarge || isXL) && innerHeight > 120) {
      g.selectAll(".label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", d => xScale(d.name) || 0)
        .attr("y", d => Math.max(yScale(d.value) - 10, 12))
        .attr("text-anchor", "middle")
        .style("font-size", isXL ? "12px" : "11px")
        .style("fill", "#666")
        .style("font-weight", "500")
        .text(d => d3.format(".0s")(d.value));
    }

  }, [data, width, height, color, strokeWidth, margin]);

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

export default D3LineChart;
