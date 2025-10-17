
import React, { useMemo } from 'react';

export interface RingData {
  id: string;
  title: string;
  value: number;
  color: string;
  icon?: React.ReactNode;
}

interface RingChartProps {
  data: RingData[];
  size?: number;
  strokeWidth?: number;
  iconSize?: number;
  gap?: number;
  removeIcons?: boolean;
  className?: string;
}

export const RingChart = ({
  data,
  size = 240,
  strokeWidth = 16,
  iconSize = 32,
  gap = 8,
  removeIcons = false,
  className = '',
}: RingChartProps) => {
  // Calculate ring positions and sizes
  const rings = useMemo(() => {
    const radius = (size - strokeWidth) / 2;
    const ringCount = data.length;
    
    // Adjust spacing based on number of rings
    const ringGap = gap; // Use the provided gap
    const maxRingWidth = strokeWidth;
    const adjustedStrokeWidth = ringCount > 5 ? Math.max(8, strokeWidth - (ringCount - 5) * 2) : maxRingWidth;
    
    return data.map((item, index) => {
      // Calculate the ring spacing to fit all rings
      const ringRadius = Math.max(0, radius - (index * (adjustedStrokeWidth + ringGap)));
      
      // Skip rings that are too small to render properly
      if (ringRadius < adjustedStrokeWidth / 2) {
        return null;
      }
      
      const ringCircumference = 2 * Math.PI * ringRadius;
      
      return {
        ...item,
        radius: ringRadius,
        circumference: ringCircumference,
        dashOffset: ringCircumference - (item.value / 100) * ringCircumference,
        strokeWidth: adjustedStrokeWidth
      };
    }).filter(Boolean);
  }, [data, size, strokeWidth, gap]);

  // Calculate center for placing icons
  const center = size / 2;

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {rings.map((ring) => (
          <g key={ring.id}>
            {/* Background circle */}
            <circle
              cx={center}
              cy={center}
              r={ring.radius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth={ring.strokeWidth}
            />
            {/* Colored progress circle */}
            <circle
              cx={center}
              cy={center}
              r={ring.radius}
              fill="none"
              stroke={ring.color}
              strokeWidth={ring.strokeWidth}
              strokeDasharray={ring.circumference}
              strokeDashoffset={ring.dashOffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${center} ${center})`}
              style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
            />
          </g>
        ))}
      </svg>
      
      {/* Icons positioned around the rings */}
      {!removeIcons && rings.map((ring) => {
        // Position icons at the top of each ring
        const iconX = center;
        const iconY = center - ring.radius;
        
        if (!ring.icon) return null;
        
        // Use provided iconSize or calculate based on number of rings
        const finalIconSize = iconSize || (rings.length > 5 ? 24 : 32);
        const iconOffset = finalIconSize / 2;
        
        return (
          <div
            key={`icon-${ring.id}`}
            className="absolute flex items-center justify-center rounded-full bg-white shadow-sm p-1"
            style={{
              width: finalIconSize,
              height: finalIconSize,
              left: iconX - iconOffset,
              top: iconY - iconOffset,
            }}
          >
            {ring.icon}
          </div>
        );
      })}
    </div>
  );
};
