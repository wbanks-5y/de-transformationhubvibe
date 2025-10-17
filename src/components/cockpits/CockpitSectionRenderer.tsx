
import React from "react";
import { Plus } from "lucide-react";
import { CockpitSection } from "@/types/cockpit";
import { MetricDisplay } from "@/types/metrics";
import { useIsMobile } from "@/hooks/use-mobile";
import { CockpitLayoutOptimizer } from "./CockpitLayoutOptimizer";
import { CockpitMetricRenderer } from "./CockpitMetricRenderer";

interface CockpitSectionRendererProps {
  section: CockpitSection & { cockpit_metrics: MetricDisplay[] };
}

export const CockpitSectionRenderer: React.FC<CockpitSectionRendererProps> = ({ section }) => {
  const isMobile = useIsMobile();
  
  const activeMetrics = section.cockpit_metrics
    .filter(metric => metric.is_active)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">{section.display_name}</h2>
        {section.description && (
          <p className="text-gray-600 text-sm">{section.description}</p>
        )}
      </div>
      
      {activeMetrics.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <Plus className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">
            No metrics configured for this section
          </p>
        </div>
      ) : (
        <CockpitLayoutOptimizer metrics={activeMetrics}>
          {(optimizedMetrics) => (
            <div className="transition-all duration-300 ease-in-out">
              {/* Mobile Layout - Single Column Stack */}
              {isMobile && (
                <div className="flex flex-col space-y-4">
                  {optimizedMetrics.map((metric) => (
                    <div key={metric.id} className="w-full animate-fade-in">
                      <CockpitMetricRenderer metric={metric} />
                    </div>
                  ))}
                </div>
              )}
              
              {/* Desktop Layout - Optimized Responsive Grid with CSS Grid auto-fit */}
              {!isMobile && (
                <div 
                  className="grid gap-6 transition-all duration-300 ease-in-out" 
                  style={{
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gridAutoRows: 'minmax(280px, auto)',
                  }}
                >
                  {optimizedMetrics.map((metric) => {
                    // Determine grid span based on size config using CSS grid-column
                    let gridStyle: React.CSSProperties = {};
                    
                    switch (metric.size_config) {
                      case 'small':
                        gridStyle = { gridColumn: 'span 1' };
                        break;
                      case 'medium':
                        gridStyle = { gridColumn: 'span 1' };
                        break;
                      case 'large':
                        gridStyle = { gridColumn: 'span 2', gridRow: 'span 1' };
                        break;
                      case 'xl':
                        gridStyle = { gridColumn: 'span 3', gridRow: 'span 2' };
                        break;
                      default:
                        gridStyle = { gridColumn: 'span 1' };
                    }
                    
                    return (
                      <div 
                        key={metric.id}
                        style={gridStyle}
                        className="min-h-fit animate-fade-in"
                      >
                        <CockpitMetricRenderer metric={metric} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </CockpitLayoutOptimizer>
      )}
    </div>
  );
};
