
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

interface D3PieChartProps {
  data: ChartDataPoint[];
  width?: number;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  showLabels?: boolean;
}

const D3PieChart: React.FC<D3PieChartProps> = ({
  data,
  width = 300,
  height = 200,
  innerRadius = 0,
  outerRadius,
  showLabels = true
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Determine chart size categories with more conservative thresholds
    const isSmall = width < 220 || height < 180;
    const isVerySmall = width < 160 || height < 140;
    const isLarge = width > 400;
    const isXL = width > 600;
    
    // Calculate safe radius to prevent overflow with more aggressive margins for larger charts
    const maxRadius = Math.min(width, height) / 2;
    let safeMargin = 20;
    
    if (isXL) {
      safeMargin = 80;
    } else if (isLarge) {
      safeMargin = 60;
    } else if (isVerySmall) {
      safeMargin = 20;
    } else if (isSmall) {
      safeMargin = 30;
    } else {
      safeMargin = 40;
    }
    
    const radius = Math.max(maxRadius - safeMargin, 15);
    const finalOuterRadius = outerRadius || radius;
    const finalInnerRadius = Math.min(innerRadius, finalOuterRadius - 8);

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Create color scale
    const colorScale = d3.scaleOrdinal<string>()
      .domain(data.map(d => d.name))
      .range(data.map(d => d.color || "#3B82F6"));

    // Create pie generator
    const pie = d3.pie<ChartDataPoint>()
      .value(d => d.value)
      .sort(null);

    // Create arc generator
    const arc = d3.arc<d3.PieArcDatum<ChartDataPoint>>()
      .innerRadius(finalInnerRadius)
      .outerRadius(finalOuterRadius);

    // Create pie slices
    const arcs = g.selectAll(".arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc");

    // Add pie slices
    arcs.append("path")
      .attr("d", arc)
      .attr("fill", d => colorScale(d.data.name))
      .attr("stroke", "white")
      .attr("stroke-width", isVerySmall ? 1 : 1.5);

    if (showLabels) {
      if (isVerySmall || isSmall) {
        // For small charts, create a more compact legend positioned better with larger fonts
        const legend = svg.append("g")
          .attr("class", "legend");

        // Position legend in top-left corner with better margins
        const legendX = 8;
        const legendY = 8;
        
        legend.attr("transform", `translate(${legendX}, ${legendY})`);

        const legendItems = legend.selectAll(".legend-item")
          .data(data.slice(0, isVerySmall ? 2 : 3))
          .enter()
          .append("g")
          .attr("class", "legend-item")
          .attr("transform", (d, i) => `translate(0, ${i * (isVerySmall ? 12 : 14)})`);

        legendItems.append("rect")
          .attr("width", isVerySmall ? 6 : 7)
          .attr("height", isVerySmall ? 6 : 7)
          .attr("fill", d => d.color || "#3B82F6");

        legendItems.append("text")
          .attr("x", isVerySmall ? 9 : 11)
          .attr("y", isVerySmall ? 3 : 4)
          .attr("dy", ".35em")
          .style("font-size", isVerySmall ? "8px" : "9px")
          .style("fill", "#374151")
          .text(d => {
            const percent = (d.value / d3.sum(data, d => d.value)) * 100;
            const maxLength = isVerySmall ? 4 : 6;
            const name = d.name.length > maxLength ? d.name.substring(0, maxLength) + "..." : d.name;
            return `${name}: ${percent.toFixed(0)}%`;
          });

      } else {
        // For larger charts, show percentage labels on slices and external labels with larger fonts
        const arc = d3.arc<d3.PieArcDatum<ChartDataPoint>>()
          .innerRadius(finalInnerRadius)
          .outerRadius(finalOuterRadius);

        const pie = d3.pie<ChartDataPoint>()
          .value(d => d.value)
          .sort(null);

        const arcs = g.selectAll(".arc")
          .data(pie(data))
          .enter()
          .append("g")
          .attr("class", "arc");

        // Add pie slices
        arcs.append("path")
          .attr("d", arc)
          .attr("fill", d => d.data.color || "#3B82F6")
          .attr("stroke", "white")
          .attr("stroke-width", isVerySmall ? 1 : 1.5);

        // Percentage labels on slices with larger fonts
        arcs.append("text")
          .attr("transform", d => `translate(${arc.centroid(d)})`)
          .attr("text-anchor", "middle")
          .attr("dy", ".35em")
          .style("font-size", isLarge ? "13px" : isXL ? "14px" : "11px")
          .style("font-weight", "bold")
          .style("fill", "white")
          .text(d => {
            const percent = (d.value / d3.sum(data, d => d.value)) * 100;
            return percent > 8 ? `${percent.toFixed(0)}%` : '';
          });

        // External labels for larger charts with better spacing and larger fonts
        if (finalOuterRadius > 60 && (isLarge || isXL)) {
          const labelArc = d3.arc<d3.PieArcDatum<ChartDataPoint>>()
            .innerRadius(finalOuterRadius + (isXL ? 20 : 12))
            .outerRadius(finalOuterRadius + (isXL ? 20 : 12));

          const labelSelection = arcs.filter(d => {
            const percent = (d.value / d3.sum(data, d => d.value)) * 100;
            return percent > 5;
          });

          // Add external labels without lines for cleaner look with larger fonts
          labelSelection.append("text")
            .attr("transform", d => {
              const pos = labelArc.centroid(d);
              return `translate(${pos})`;
            })
            .attr("text-anchor", d => {
              const centroid = labelArc.centroid(d);
              return centroid[0] > 0 ? "start" : "end";
            })
            .attr("dy", ".35em")
            .style("font-size", isXL ? "13px" : "11px")
            .style("fill", "#374151")
            .style("font-weight", "500")
            .text(d => {
              const maxLength = isXL ? 12 : 10;
              const name = d.data.name.length > maxLength ? d.data.name.substring(0, maxLength) + "..." : d.data.name;
              return name;
            });
        }
      }
    }

  }, [data, width, height, innerRadius, outerRadius, showLabels]);

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

export default D3PieChart;
