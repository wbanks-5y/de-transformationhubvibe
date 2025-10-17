
import React from "react";
import { CockpitSection } from "@/types/cockpit";
import { MetricDisplay } from "@/types/metrics";
import { CockpitSectionRenderer } from "./CockpitSectionRenderer";

interface CockpitSectionWithControlsProps {
  section: CockpitSection & { cockpit_metrics: MetricDisplay[] };
}

const CockpitSectionWithControls: React.FC<CockpitSectionWithControlsProps> = ({ section }) => {
  if (!section.cockpit_metrics || section.cockpit_metrics.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">{section.name}</h2>
        </div>
        {section.description && (
          <p className="text-gray-600 text-sm">{section.description}</p>
        )}
        <div className="text-center py-8">
          <p className="text-gray-500">No metrics available in this section</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{section.name}</h2>
          {section.description && (
            <p className="text-gray-600 text-sm mt-1">{section.description}</p>
          )}
        </div>
      </div>

      {/* Render section content */}
      <CockpitSectionRenderer section={section} />
    </div>
  );
};

export default CockpitSectionWithControls;
