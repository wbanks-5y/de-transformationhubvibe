
import React, { useState, useEffect, useRef } from 'react';

interface D3ResponsiveChartProps {
  children: (dimensions: { width: number; height: number }) => React.ReactNode;
  className?: string;
  aspectRatio?: number;
  minWidth?: number;
  minHeight?: number;
  reservedHeight?: number;
}

const D3ResponsiveChart: React.FC<D3ResponsiveChartProps> = ({
  children,
  className = "",
  aspectRatio = 16 / 9,
  minWidth = 120,
  minHeight = 80,
  reservedHeight = 0
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 300, height: 200 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        
        // Use the full container dimensions
        const availableWidth = Math.max(containerRect.width, minWidth);
        const availableHeight = Math.max(containerRect.height - reservedHeight, minHeight);
        
        // Calculate dimensions based on aspect ratio while respecting container bounds
        let finalWidth = availableWidth;
        let finalHeight = finalWidth / aspectRatio;
        
        // If calculated height exceeds available height, scale down proportionally
        if (finalHeight > availableHeight) {
          finalHeight = availableHeight;
          finalWidth = finalHeight * aspectRatio;
        }
        
        // Ensure we don't exceed container width after height-based scaling
        if (finalWidth > availableWidth) {
          finalWidth = availableWidth;
          finalHeight = finalWidth / aspectRatio;
        }
        
        const newDimensions = { 
          width: Math.max(Math.floor(finalWidth), minWidth), 
          height: Math.max(Math.floor(finalHeight), minHeight)
        };
        
        // Only update if dimensions actually changed to prevent unnecessary re-renders
        setDimensions(prev => {
          if (prev.width !== newDimensions.width || prev.height !== newDimensions.height) {
            return newDimensions;
          }
          return prev;
        });
      }
    };

    // Initial update
    updateDimensions();

    // Set up resize observer for dynamic updates
    const resizeObserver = new ResizeObserver((entries) => {
      // Use requestAnimationFrame to debounce rapid resize events
      requestAnimationFrame(updateDimensions);
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Also listen for window resize as a fallback
    const handleWindowResize = () => {
      requestAnimationFrame(updateDimensions);
    };
    
    window.addEventListener('resize', handleWindowResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [aspectRatio, minWidth, minHeight, reservedHeight]);

  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full ${className}`}
      style={{ 
        minWidth: `${minWidth}px`, 
        minHeight: `${minHeight}px`
      }}
    >
      <div className="w-full h-full flex items-center justify-center">
        {children(dimensions)}
      </div>
    </div>
  );
};

export default D3ResponsiveChart;
