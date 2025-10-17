import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import * as d3 from "d3";
import { 
  DollarSign, 
  Users, 
  Settings, 
  Lightbulb, 
  TrendingUp,
  Award,
  BarChart,
  Layers,
  Book,
  Briefcase,
  Puzzle,
  Star,
  HeartHandshake
} from "lucide-react";
import { useResizeObserver } from "@/hooks/useResizeObserver";

// Define types for our strategy items
interface StrategyItem {
  id: string;
  title: string;
  description: string;
  category: StrategyCategory;
  subcategory?: string;
  performance: number;
  objectives: string[];
  icon?: React.ReactNode;
  connections?: string[];
  x?: number;
  y?: number;
}

type StrategyCategory = 
  | "financial" 
  | "customer" 
  | "internal" 
  | "learning";

// Enhanced data structure for the strategy map
const strategyItems: StrategyItem[] = [
  // Financial Perspective
  {
    id: "financial-growth",
    title: "Revenue Growth",
    description: "Increase revenue by 20% YoY",
    category: "financial",
    subcategory: "Growth Strategy",
    performance: 85,
    objectives: ["Expand market share", "Increase customer spending"],
    icon: <TrendingUp className="h-5 w-5" />,
    connections: ["customer-satisfaction", "customer-acquisition"]
  },
  {
    id: "financial-profitability",
    title: "Profitability",
    description: "Improve profit margins by 5%",
    category: "financial",
    subcategory: "Productivity Strategy",
    performance: 72,
    objectives: ["Reduce operational costs", "Optimize pricing strategy"],
    icon: <DollarSign className="h-5 w-5" />,
    connections: ["internal-efficiency", "internal-quality"]
  },
  {
    id: "financial-sustainability",
    title: "Financial Sustainability",
    description: "Maintain healthy cash flow",
    category: "financial",
    subcategory: "Productivity Strategy",
    performance: 91,
    objectives: ["Improve working capital", "Diversify revenue streams"],
    icon: <BarChart className="h-5 w-5" />,
    connections: ["internal-innovation"]
  },
  
  // Customer Perspective
  {
    id: "customer-satisfaction",
    title: "Customer Satisfaction",
    description: "Achieve 90% customer satisfaction",
    category: "customer",
    subcategory: "Service",
    performance: 87,
    objectives: ["Improve service quality", "Enhance product experience"],
    icon: <Award className="h-5 w-5" />,
    connections: ["internal-quality"]
  },
  {
    id: "customer-acquisition",
    title: "Customer Acquisition",
    description: "Increase new customers by 15%",
    category: "customer",
    subcategory: "Partnership",
    performance: 65,
    objectives: ["Optimize marketing campaigns", "Implement referral program"],
    icon: <Users className="h-5 w-5" />,
    connections: ["learning-technology"]
  },
  {
    id: "customer-retention",
    title: "Customer Retention",
    description: "Increase retention rate to 85%",
    category: "customer",
    subcategory: "Brand",
    performance: 78,
    objectives: ["Develop loyalty program", "Improve customer support"],
    icon: <HeartHandshake className="h-5 w-5" />,
    connections: ["learning-employee"]
  },
  
  // Internal Business Processes
  {
    id: "internal-quality",
    title: "Quality Management",
    description: "Reduce defects by 25%",
    category: "internal",
    subcategory: "Operations Management",
    performance: 82,
    objectives: ["Implement quality controls", "Enhance production processes"],
    icon: <Settings className="h-5 w-5" />,
    connections: ["learning-employee"]
  },
  {
    id: "internal-efficiency",
    title: "Operational Efficiency",
    description: "Reduce delivery time by 30%",
    category: "internal",
    subcategory: "Operations Management",
    performance: 58,
    objectives: ["Streamline workflows", "Eliminate bottlenecks"],
    icon: <Layers className="h-5 w-5" />,
    connections: ["learning-culture"]
  },
  {
    id: "internal-innovation",
    title: "Innovation",
    description: "Launch 5 new products/services",
    category: "internal",
    subcategory: "Innovation Processes",
    performance: 93,
    objectives: ["Increase R&D investment", "Create innovation culture"],
    icon: <Lightbulb className="h-5 w-5" />,
    connections: ["learning-technology"]
  },
  
  // Learning and Growth
  {
    id: "learning-employee",
    title: "Employee Development",
    description: "100 hours training per employee annually",
    category: "learning",
    subcategory: "Human Capital",
    performance: 76,
    objectives: ["Implement training programs", "Create career paths"],
    icon: <Briefcase className="h-5 w-5" />
  },
  {
    id: "learning-culture",
    title: "Organizational Culture",
    description: "Improve employee engagement score to 4.5/5",
    category: "learning",
    subcategory: "Organization Capital",
    performance: 81,
    objectives: ["Enhance workplace environment", "Improve internal communication"],
    icon: <Puzzle className="h-5 w-5" />
  },
  {
    id: "learning-technology",
    title: "Technology Capabilities",
    description: "Modernize 80% of legacy systems",
    category: "learning",
    subcategory: "Information Capital",
    performance: 69,
    objectives: ["Invest in new technologies", "Develop IT infrastructure"],
    icon: <Book className="h-5 w-5" />
  }
];

// Helper function to determine color based on performance
const getColorForPerformance = (performance: number): string => {
  if (performance >= 85) return "#9AE6B4"; // green
  if (performance >= 70) return "#90CDF4"; // blue
  if (performance >= 50) return "#FEEBC8"; // amber
  return "#FEB2B2"; // red
};

// Helper function to determine text for performance
const getTextForPerformance = (performance: number): string => {
  if (performance >= 85) return "Excellent";
  if (performance >= 70) return "Good";
  if (performance >= 50) return "Needs Improvement";
  return "Critical";
};

interface StrategyMapProps {
  standalone?: boolean;
  onItemClick?: (item: StrategyItem) => void;
}

// D3 Strategy Map Component
const StrategyMap: React.FC<StrategyMapProps> = ({ 
  standalone = true, 
  onItemClick 
}) => {
  const [highlightConnections, setHighlightConnections] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dimensions = useResizeObserver(wrapperRef);

  const handleItemClick = (item: StrategyItem) => {
    toast(item.title, {
      description: `Performance: ${item.performance}% - ${getTextForPerformance(item.performance)}`,
    });
    
    setSelectedItem(item.id);
    setHighlightConnections([item.id, ...(item.connections || [])]);
    
    // Call the onItemClick callback if provided
    if (onItemClick) {
      onItemClick(item);
    }
    
    // Reset after a delay
    setTimeout(() => {
      setSelectedItem(null);
      setHighlightConnections([]);
    }, 2000);
  };

  // D3 rendering logic
  useEffect(() => {
    if (!dimensions || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    
    // Clear previous rendering
    svg.selectAll("*").remove();
    
    const width = dimensions.width;
    const height = dimensions.height;
    
    // Define category positions
    const categoryPositions = {
      financial: { y: height * 0.1, title: "Financial Perspective" },
      customer: { y: height * 0.3, title: "Customer Perspective" },
      internal: { y: height * 0.5, title: "Internal Business Processes" },
      learning: { y: height * 0.7, title: "Learning and Growth" }
    };
    
    // Group items by category
    const itemsByCategory: Record<StrategyCategory, StrategyItem[]> = {
      financial: [],
      customer: [],
      internal: [],
      learning: []
    };
    
    strategyItems.forEach(item => {
      itemsByCategory[item.category].push({...item});
    });
    
    // Calculate positions for each item
    Object.entries(itemsByCategory).forEach(([category, items]) => {
      const categoryKey = category as StrategyCategory;
      const categoryY = categoryPositions[categoryKey].y;
      
      items.forEach((item, index) => {
        const itemCount = items.length;
        const itemSpacing = Math.min(180, (width * 0.8) / itemCount);
        const startX = (width - (itemSpacing * (itemCount - 1) + 160)) / 2;
        
        item.x = startX + index * itemSpacing;
        item.y = categoryY;
      });
    });
    
    // Draw category labels
    Object.entries(categoryPositions).forEach(([category, position]) => {
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", position.y - 40)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .text(position.title);
        
      svg.append("line")
        .attr("x1", width * 0.1)
        .attr("y1", position.y - 25)
        .attr("x2", width * 0.9)
        .attr("y2", position.y - 25)
        .attr("stroke", "#E2E8F0")
        .attr("stroke-width", 1);
    });
    
    // Fixed width and height for all items
    const itemWidth = 160;
    const itemHeight = 60;
    
    // Draw connections
    const connectionsGroup = svg.append("g").attr("class", "connections");
    
    strategyItems.forEach(sourceItem => {
      if (!sourceItem.connections) return;
      
      const sourceItemInCategory = Object.values(itemsByCategory)
        .flat()
        .find(item => item.id === sourceItem.id);
      
      if (!sourceItemInCategory || !sourceItemInCategory.x || !sourceItemInCategory.y) return;
      
      sourceItem.connections.forEach(targetId => {
        const targetItemInCategory = Object.values(itemsByCategory)
          .flat()
          .find(item => item.id === targetId);
        
        if (!targetItemInCategory || !targetItemInCategory.x || !targetItemInCategory.y) return;
        
        const isHighlighted = 
          highlightConnections.includes(sourceItem.id) && 
          highlightConnections.includes(targetId);
        
        // Create curved path between items
        connectionsGroup.append("path")
          .attr("d", () => {
            const sourceX = sourceItemInCategory.x + itemWidth / 2;
            const sourceY = sourceItemInCategory.y + 30;  // Bottom of source
            const targetX = targetItemInCategory.x + itemWidth / 2;
            const targetY = targetItemInCategory.y - 30;  // Top of target
            const midY = (sourceY + targetY) / 2;
            
            return `M ${sourceX} ${sourceY} 
                    C ${sourceX} ${midY}, 
                      ${targetX} ${midY}, 
                      ${targetX} ${targetY}`;
          })
          .attr("fill", "none")
          .attr("stroke", isHighlighted ? "#9b87f5" : "#CBD5E0")
          .attr("stroke-width", isHighlighted ? 2 : 1)
          .attr("stroke-dasharray", isHighlighted ? "none" : "3,3");
      });
    });
    
    // Draw items
    Object.values(itemsByCategory).flat().forEach(item => {
      if (!item.x || !item.y) return;
      
      const isSelected = selectedItem === item.id;
      const isHighlighted = highlightConnections.includes(item.id);
      const itemGroup = svg.append("g")
        .attr("transform", `translate(${item.x}, ${item.y})`)
        .attr("cursor", "pointer")
        .on("click", () => handleItemClick(item));
        
      // Item background
      itemGroup.append("rect")
        .attr("width", itemWidth)
        .attr("height", itemHeight)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("fill", getColorForPerformance(item.performance))
        .attr("stroke", isHighlighted ? "#9b87f5" : "#CBD5E0")
        .attr("stroke-width", isHighlighted ? 2 : 1)
        .attr("filter", isSelected ? "drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1))" : "none");
      
      // Performance circle
      itemGroup.append("circle")
        .attr("cx", itemWidth - 15)
        .attr("cy", 15)
        .attr("r", 10)
        .attr("fill", "white")
        .attr("stroke", "#CBD5E0");
        
      // Performance text
      itemGroup.append("text")
        .attr("x", itemWidth - 15)
        .attr("y", 19)
        .attr("text-anchor", "middle")
        .attr("font-size", "9px")
        .attr("font-weight", "bold")
        .text(`${item.performance}%`);
      
      // Title
      itemGroup.append("text")
        .attr("x", 10)
        .attr("y", 20)
        .attr("font-weight", "bold")
        .attr("font-size", "11px")
        .text(item.title.length > 15 ? item.title.substring(0, 15) + "..." : item.title);
      
      // Description
      itemGroup.append("text")
        .attr("x", 10)
        .attr("y", 40)
        .attr("font-size", "9px")
        .attr("fill", "#4A5568")
        .text(item.description.length > 25 ? item.description.substring(0, 25) + "..." : item.description);
    });
    
    // Add vertical connector lines between categories
    Object.entries(categoryPositions).forEach(([category, position], index, array) => {
      if (index < array.length - 1) {
        const nextCategory = array[index + 1][1];
        
        svg.append("line")
          .attr("x1", width / 2)
          .attr("y1", position.y + 80)
          .attr("x2", width / 2)
          .attr("y2", nextCategory.y - 80)
          .attr("stroke", "#CBD5E0")
          .attr("stroke-width", 1)
          .attr("stroke-dasharray", "5,5");
        
        svg.append("circle")
          .attr("cx", width / 2)
          .attr("cy", (position.y + nextCategory.y) / 2)
          .attr("r", 15)
          .attr("fill", "#E2E8F0");
        
        svg.append("text")
          .attr("x", width / 2)
          .attr("y", (position.y + nextCategory.y) / 2 + 4)
          .attr("text-anchor", "middle")
          .attr("font-size", "16px")
          .text("↓");
      }
    });
    
  }, [dimensions, highlightConnections, selectedItem]);

  return (
    <div className={standalone ? "container mx-auto px-4 py-8" : ""}>
      {standalone && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Strategy Map</h1>
          <p className="text-gray-600">Visualizing our corporate strategy and performance</p>
        </div>
      )}
      
      <div className={standalone ? "strategy-map" : "strategy-map-integrated"} ref={wrapperRef} style={{ height: "750px", position: "relative" }}>
        <svg ref={svgRef} width="100%" height="100%" />
      </div>

      {standalone && (
        <>
          <div className="bg-gray-50 p-6 rounded-lg mt-8">
            <h2 className="text-lg font-semibold mb-4">Performance Legend</h2>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <div className="w-4 h-4 mr-2 bg-green-100 border border-green-300 rounded"></div>
                <span>Excellent (≥85%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 mr-2 bg-blue-100 border border-blue-300 rounded"></div>
                <span>Good (70-84%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 mr-2 bg-amber-100 border border-amber-300 rounded"></div>
                <span>Needs Improvement (50-69%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 mr-2 bg-red-100 border border-red-300 rounded"></div>
                <span>Critical (≤49%)</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mt-4">
            <h2 className="text-lg font-semibold mb-4">Instructions</h2>
            <p>Click on any strategy item to see its connections and objectives. Visual connections will briefly highlight to show relationships between different elements.</p>
          </div>
        </>
      )}
    </div>
  );
};

export default StrategyMap;
